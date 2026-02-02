import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, ChevronRight, Send, Mic, Globe2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleChatMessages, chatRooms, sampleUser } from '@/data/sampleData';

export default function CommunityPage() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleChatMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user-main',
      senderName: sampleUser.name,
      senderAvatar: sampleUser.avatar,
      senderLevel: sampleUser.levelTitle,
      message: message,
      timestamp: new Date(),
      isIndonesian: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  if (activeRoom) {
    const room = chatRooms.find(r => r.id === activeRoom);
    
    return (
      <div className="min-h-screen flex flex-col">
        {/* Chat Header */}
        <div className="glass border-b border-border px-4 py-3 flex items-center gap-3 safe-top">
          <button
            onClick={() => setActiveRoom(null)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{room?.name}</h2>
            <p className="text-xs text-muted-foreground">{room?.members} members online</p>
          </div>
          <span className="text-2xl">{room?.icon}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isOwn = msg.senderId === 'user-main';
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {!isOwn && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full bg-muted flex-shrink-0"
                  />
                )}
                <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{msg.senderName}</span>
                      <span className="level-badge text-[10px]">{msg.senderLevel}</span>
                    </div>
                  )}
                  <div className={isOwn ? 'chat-bubble-sent' : 'chat-bubble-received'}>
                    <p>{msg.message}</p>
                  </div>
                  {msg.isIndonesian && !isOwn && (
                    <button className="text-xs text-primary mt-1 flex items-center gap-1">
                      <Globe2 className="h-3 w-3" />
                      Translate
                    </button>
                  )}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.reactions.map((reaction, i) => (
                        <span key={i} className="text-sm bg-muted/50 px-1.5 py-0.5 rounded-full">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        <div className="glass border-t border-border px-4 py-3 safe-bottom">
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Mic className="h-5 w-5 text-muted-foreground" />
            </button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-muted border-0"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full p-0 flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">Connect with fellow learners</p>
        </motion.div>

        {/* Featured: Language Exchange */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
              🌏
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground text-lg">Language Exchange</h2>
              <p className="text-sm text-muted-foreground">Find native speakers to practice with</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
          <div className="space-y-3">
            {chatRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                onClick={() => setActiveRoom(room.id)}
                className="card-interactive p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                  {room.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">{room.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {room.members}
                  </div>
                  <span className="level-badge mt-1 text-[10px]">{room.level}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Learners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-elevated p-5"
        >
          <h2 className="font-semibold text-foreground mb-4">Active Now</h2>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-card overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`}
                  alt={`User ${i}`}
                  className="w-full h-full bg-muted"
                />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
              +89
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
