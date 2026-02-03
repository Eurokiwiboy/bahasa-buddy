// src/hooks/useChat.ts
// Real-time chat functionality with Supabase

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom, ChatMessage, ChatMessageWithUser, Profile } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export function useChat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessageWithUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch all chat rooms
  const fetchRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url,
            learning_level
          )
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, []);

  // Subscribe to real-time messages
  const subscribeToRoom = useCallback((roomId: string) => {
    // Unsubscribe from previous room
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch the full message with user profile
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles:user_id (
                id,
                display_name,
                avatar_url,
                learning_level
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data as ChatMessageWithUser]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id
                ? { ...msg, ...payload.new }
                : msg
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  // Join a room
  const joinRoom = useCallback(async (room: ChatRoom) => {
    if (!user) return;

    setLoading(true);
    setCurrentRoom(room);

    // Add user to room members
    await supabase
      .from('chat_room_members')
      .upsert({
        room_id: room.id,
        user_id: user.id,
        last_read_at: new Date().toISOString(),
      });

    // Fetch messages and subscribe
    await fetchMessages(room.id);
    subscribeToRoom(room.id);

    // Fetch active users in room
    const { data: members } = await supabase
      .from('chat_room_members')
      .select(`
        profiles:user_id (
          id,
          display_name,
          avatar_url,
          learning_level
        )
      `)
      .eq('room_id', room.id)
      .limit(20);

    if (members) {
      setActiveUsers(
        members
          .map(m => m.profiles)
          .filter((p): p is Profile => p !== null)
      );
    }

    setLoading(false);
  }, [user, fetchMessages, subscribeToRoom]);

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setCurrentRoom(null);
    setMessages([]);
    setActiveUsers([]);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string, messageType: 'text' | 'voice' = 'text', voiceUrl?: string) => {
    if (!user || !currentRoom || !content.trim()) return { error: 'Invalid input' };

    setSendingMessage(true);

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: currentRoom.id,
          user_id: user.id,
          content: content.trim(),
          message_type: messageType,
          voice_url: voiceUrl,
        })
        .select()
        .single();

      if (error) throw error;

      setSendingMessage(false);
      return { data, error: null };
    } catch (err) {
      console.error('Error sending message:', err);
      setSendingMessage(false);
      return { data: null, error: err instanceof Error ? err.message : 'Failed to send message' };
    }
  }, [user, currentRoom]);

  // Edit a message
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!user) return;

    try {
      await supabase
        .from('chat_messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Error editing message:', err);
    }
  }, [user]);

  // Delete a message (soft delete)
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('chat_messages')
        .update({ is_deleted: true })
        .eq('id', messageId)
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  }, [user]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        });
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  }, [user]);

  // Remove reaction
  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);
    } catch (err) {
      console.error('Error removing reaction:', err);
    }
  }, [user]);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return {
    rooms,
    currentRoom,
    messages,
    activeUsers,
    loading,
    sendingMessage,
    joinRoom,
    leaveRoom,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    refetchRooms: fetchRooms,
  };
}
