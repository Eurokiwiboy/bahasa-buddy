// src/hooks/useClaudeControl.ts
// Subscribes to real-time Claude commands from the claude_commands table.
// Claude (via service_role) inserts commands; this hook surfaces them to the UI.

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ClaudeCommand, ClaudeCommandStatus } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export function useClaudeControl() {
  const { user } = useAuth();
  const [commands, setCommands] = useState<ClaudeCommand[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch any un-dismissed commands that haven't expired yet
  const fetchPendingCommands = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('claude_commands' as never)
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[ClaudeControl] Error fetching commands:', error);
      return;
    }
    setCommands((data as unknown as ClaudeCommand[]) ?? []);
  }, []);

  // Subscribe to real-time inserts/updates on claude_commands
  const subscribe = useCallback((userId: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('claude-control')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'claude_commands',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const cmd = payload.new as ClaudeCommand;
          if (new Date(cmd.expires_at) > new Date()) {
            setCommands((prev) => [...prev, cmd]);
          }
        }
      )
      // Also listen for broadcast commands (user_id IS NULL)
      // Supabase Realtime doesn't support IS NULL in filters, so we use a
      // separate channel with no filter and check in the handler.
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'claude_commands',
        },
        (payload) => {
          const cmd = payload.new as ClaudeCommand;
          if (cmd.user_id === null && new Date(cmd.expires_at) > new Date()) {
            setCommands((prev) => {
              // Avoid duplicates from the user-specific channel
              if (prev.some((c) => c.id === cmd.id)) return prev;
              return [...prev, cmd];
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  useEffect(() => {
    if (!user) {
      setCommands([]);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    fetchPendingCommands(user.id);
    subscribe(user.id);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, fetchPendingCommands, subscribe]);

  // Mark a command as executed or dismissed
  const updateCommandStatus = useCallback(async (
    commandId: string,
    status: ClaudeCommandStatus
  ) => {
    setCommands((prev) => prev.filter((c) => c.id !== commandId));

    await supabase
      .from('claude_commands' as never)
      .update({ status } as never)
      .eq('id', commandId);
  }, []);

  const dismissCommand = useCallback(
    (commandId: string) => updateCommandStatus(commandId, 'dismissed'),
    [updateCommandStatus]
  );

  const markExecuted = useCallback(
    (commandId: string) => updateCommandStatus(commandId, 'executed'),
    [updateCommandStatus]
  );

  // The oldest pending command is the "active" one shown to the user
  const activeCommand = commands[0] ?? null;

  return { activeCommand, commands, dismissCommand, markExecuted };
}
