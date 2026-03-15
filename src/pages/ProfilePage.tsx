import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Volume2, Moon, Globe2, Shield, ChevronRight,
  Flame, Trophy, BookOpen, MessageCircle, Calendar, Camera,
  LogOut
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const settingsGroups = [
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', hasToggle: true },
      { icon: Volume2, label: 'Sound Effects', hasToggle: true },
      { icon: Moon, label: 'Dark Mode', hasToggle: true },
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

export default function ProfilePage() {
  const { signOut } = useAuth();
  const {
    profile,
    achievements,
    earnedAchievements,
    loading,
    getLevel,
    getXPProgress,
    getXPToNextLevel,
    levelTitle,
  } = useProfile();

  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
  });

  const displayName = profile?.display_name || 'Learner';
  const level = getLevel();
  const xp = profile?.xp_total || 0;
  const xpToNext = getXPToNextLevel();
  const levelProgress = getXPProgress();

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
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {displayName[0]?.toUpperCase() || '?'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="level-badge">Level {level}</span>
                <span className="text-muted-foreground">•</span>
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
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement, index) => {
              const isEarned = earnedAchievements.some(e => e.achievement_id === achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  className={`achievement-badge ${isEarned ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'} text-xl cursor-pointer`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  {achievement.icon}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Settings */}
        {settingsGroups.map((group, groupIndex) => (
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
                  {item.hasToggle ? (
                    <Switch
                      checked={
                        item.label === 'Notifications' ? settings.notifications :
                        item.label === 'Sound Effects' ? settings.sound :
                        settings.darkMode
                      }
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          [item.label === 'Notifications' ? 'notifications' :
                           item.label === 'Sound Effects' ? 'sound' : 'darkMode']: checked,
                        });
                      }}
                    />
                  ) : item.value ? (
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
