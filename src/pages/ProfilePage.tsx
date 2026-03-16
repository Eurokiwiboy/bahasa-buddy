import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Volume2, Moon, Globe2, Shield, ChevronRight,
  Flame, Trophy, BookOpen, MessageCircle, Calendar,
  LogOut, Pencil, Check, X, Camera, Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { UserAvatar } from '@/components/UserAvatar';
import { AchievementCard } from '@/components/AchievementCard';

// Client-side image resize using Canvas API
async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
      } else {
        if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/webp',
        0.85
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const {
    profile,
    achievements,
    earnedAchievements,
    loading,
    getLevel,
    getXPProgress,
    getXPToNextLevel,
    levelTitle,
    updateProfile,
  } = useProfile();
  const { isDark, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});

  // Fetch achievement progress data
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const [lessonRes, cardProgressRes] = await Promise.all([
        supabase
          .from('user_lesson_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed'),
        supabase
          .from('user_card_progress')
          .select('times_seen, mastery_level')
          .eq('user_id', user.id),
      ]);

      const lessonsCompleted = lessonRes.count || 0;
      const cardsData = cardProgressRes.data || [];
      const cardsReviewed = cardsData.reduce((sum, c) => sum + (c.times_seen || 0), 0);
      const cardsMastered = cardsData.filter(c => (c.mastery_level || 0) >= 3).length;

      setAchievementProgress({
        lessons_completed: lessonsCompleted,
        cards_reviewed: cardsReviewed,
        cards_mastered: cardsMastered,
        streak_days: profile?.current_streak || 0,
        total_xp: profile?.xp_total || 0,
      });
    };

    fetchProgress();
  }, [user, profile]);

  const getProgress = (requirementType: string): number | null => {
    return achievementProgress[requirementType] ?? null;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const resized = await resizeImage(file, 400);
      const filePath = `${user.id}/avatar.webp`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, resized, { upsert: true, contentType: 'image/webp' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
      await updateProfile({ avatar_url: urlWithCacheBust });
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const displayName = profile?.display_name || 'Learner';
  const level = getLevel();
  const xp = profile?.xp_total || 0;
  const xpToNext = getXPToNextLevel();
  const levelProgress = getXPProgress();

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== displayName) {
      await updateProfile({ display_name: trimmed });
    }
    setEditingName(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="card-elevated p-6 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted" />
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-32 mb-2" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Flame, label: 'Day Streak', value: profile?.current_streak || 0, color: 'text-streak' },
    { icon: BookOpen, label: 'Level', value: level, color: 'text-primary' },
    { icon: MessageCircle, label: 'Title', value: levelTitle, color: 'text-success' },
    { icon: Trophy, label: 'XP Total', value: xp, color: 'text-xp' },
  ];

  const settingsItems = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell, label: 'Notifications',
          toggled: settings.notifications,
          onToggle: () => setSettings(s => ({ ...s, notifications: !s.notifications })),
        },
        {
          icon: Volume2, label: 'Sound Effects',
          toggled: settings.sound,
          onToggle: () => setSettings(s => ({ ...s, sound: !s.sound })),
        },
        {
          icon: Moon, label: 'Dark Mode',
          toggled: isDark,
          onToggle: toggleTheme,
        },
        { icon: Globe2, label: 'Language', value: 'English' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: Shield, label: 'Privacy Settings' },
        { icon: Calendar, label: 'Study Reminder', value: '9:00 AM' },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
              disabled={uploading}
            >
              <UserAvatar
                avatarUrl={previewUrl || profile?.avatar_url}
                displayName={displayName}
                size="lg"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <div className="flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="text-xl font-bold text-foreground bg-muted rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                    maxLength={30}
                  />
                  <button onClick={handleSaveName} className="p-1 text-success hover:bg-success/10 rounded">
                    <Check className="h-5 w-5" />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                  <button
                    onClick={() => { setNameInput(displayName); setEditingName(true); }}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="level-badge">Level {level}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{levelTitle}</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Next Level</span>
                  <span className="font-medium text-foreground">{xp} / {xpToNext} XP</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="card-elevated p-3 text-center"
            >
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-xp" />
              Achievements
            </h2>
            <span className="text-sm text-muted-foreground">
              {earnedAchievements.length}/{achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {achievements.map((achievement) => {
              const earned = earnedAchievements.find(e => e.achievement_id === achievement.id);
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={!!earned}
                  earnedAt={earned?.earned_at}
                  currentProgress={getProgress(achievement.requirement_type)}
                  isExpanded={expandedAchievement === achievement.id}
                  onToggle={() =>
                    setExpandedAchievement(
                      expandedAchievement === achievement.id ? null : achievement.id
                    )
                  }
                />
              );
            })}
          </div>
        </motion.div>

        {/* Settings */}
        {settingsItems.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + groupIndex * 0.1 }}
            className="card-elevated overflow-hidden"
          >
            <h2 className="font-semibold text-foreground px-5 pt-5 pb-3">{group.title}</h2>
            <div className="divide-y divide-border">
              {group.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + groupIndex * 0.1 + itemIndex * 0.05 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  {'toggled' in item && item.onToggle ? (
                    <Switch
                      checked={item.toggled}
                      onCheckedChange={item.onToggle}
                    />
                  ) : 'value' in item && item.value ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">{item.value}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => signOut()}
          className="w-full card-elevated p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </motion.button>
      </div>
    </div>
  );
}
