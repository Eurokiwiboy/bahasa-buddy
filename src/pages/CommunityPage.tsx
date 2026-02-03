// src/pages/CommunityPage.tsx
// Real-time community chat with Supabase

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Users, ChevronLeft, Send, Mic, Globe2,
  MoreVertical, Heart, Smile, Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { ChatRoom, ChatMessageWithUser } from '@/integrations/supabase/types';

// Level badge colors
const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  elementary: 'bg-blue-100 text-blue-800',
  intermediate: 'bg-purple-100 text-purple-800',
  upper_intermediate: 'bg-orange-100 text-orange-800',
  advanced: 'bg-red-100 text-red-800',
};

export default function CommunityPage() {
  const { user } = useAuth();
  const {
    rooms,
    currentRoom,
    messages,
    activeUsers,
    loading,
    sendingMessage,
    joinRoom,
    leaveRoom,
    sendMessage,
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const { error } = await sendMessage(messageInput);
    if (!error) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Room list view
  if (!currentRoom) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Community</h1>
            <p className="text-muted-foreground mt-1">Practice with other learners</p>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                Active Now
              </h2>
              <span className="text-xs text-muted-foreground">{rooms.reduce((acc, r) => acc + r.member_count, 0)} online</span>
            </div>
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 8).map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Avatar className="w-10 h-10 border-2 border-background">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>{user.display_name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
              {activeUsers.length > 8 && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{activeUsers.length - 8}
                </div>
              )}
            </div>
          </motion.div>

          {/* Chat Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Chat Rooms
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card-elevated p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    onClick={() => joinRoom(room)}
                    className="card-interactive p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                        {room.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{room.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelColors[room.level_requirement] || 'bg-gray-100 text-gray-800'}`}>
                            {room.level_requirement}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{room.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-success">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-sm font-medium">{room.member_count}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Language Exchange Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-elevated p-5 bg-gradient-to-br from-primary/10 to-accent/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Globe2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Language Exchange</h3>
                <p className="text-sm text-muted-foreground">Find native speakers to practice with</p>
              </div>
              <Button className="btn-primary">Find Partners</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Chat room view
  return (
    <div className="min-h-screen flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={leaveRoom}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRoom.icon}</span>
              <h2 className="font-semibold text-foreground">{currentRoom.name}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>{currentRoom.member_count} members</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.user_id === user?.id}
                  showAvatar={
                    index === 0 ||
                    messages[index - 1].user_id !== message.user_id
                  }
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Mic className="h-5 w-5" />
          </button>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 h-12 rounded-2xl"
            disabled={sendingMessage}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendingMessage}
            className="w-12 h-12 rounded-full btn-primary p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Message bubble component
function MessageBubble({
  message,
  isOwn,
  showAvatar,
}: {
  message: ChatMessageWithUser;
  isOwn: boolean;
  showAvatar: boolean;
}) {
  const profile = message.profiles;
  const displayName = profile?.display_name || 'Anonymous';
  const avatarUrl = profile?.avatar_url;
  const level = profile?.learning_level || 'beginner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      {showAvatar ? (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{displayName[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8" />
      )}

      <div className={`flex-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {showAvatar && !isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${levelColors[level]}`}>
              {level}
            </span>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {!isOwn && (
            <div className="flex items-center gap-1">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Languages className="h-3 w-3" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
