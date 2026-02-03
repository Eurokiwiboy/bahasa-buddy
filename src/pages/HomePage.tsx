// src/pages/HomePage.tsx
// Dashboard with real user data from Supabase

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Zap, BookOpen, MessageCircle, Trophy, ChevronRight, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, levelTitles } from '@/hooks/useProfile';
import { useLessons } from '@/hooks/useLessons';
import { useCards } from '@/hooks/useCards';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const {
    profile,
    dailyGoals,
    achievements,
    earnedAchievements,
    loading: profileLoading,
    getLevel,
    getXPProgress,
    levelTitle,
  } = useProfile();
  const { getNextLesson, getLessonCompletion } = useLessons();
  const { categories, getCategoryProgress } = useCards();

  const nextLesson = getNextLesson();
  const greetingCategory = categories.find(c => c.name === 'Greetings');
  const greetingProgress = greetingCategory ? getCategoryProgress(greetingCategory.id) : 0;

  // Calculate daily XP progress
  const dailyXPProgress = dailyGoals
    ? Math.min((dailyGoals.xp_earned / dailyGoals.xp_target) * 100, 100)
    : 0;

  // Get display name
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Learner';

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="card-elevated p-6">
              <div className="h-4 bg-muted rounded w-full mb-4" />
              <div className="h-2 bg-muted rounded w-3/4" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card-elevated p-4 h-24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to Bahasa Buddy</h1>
          <p className="text-muted-foreground mb-6">Sign in to start learning Indonesian</p>
          <Link to="/login">
            <Button className="btn-primary">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Halo, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Level {getLevel()} {levelTitle}
            </p>
          </div>
          {profile && profile.current_streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="streak-badge"
            >
              <Flame className="h-4 w-4" />
              <span>{profile.current_streak} day{profile.current_streak !== 1 ? 's' : ''}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Daily XP Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-xp" />
              <span className="font-semibold text-foreground">Daily Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {dailyGoals?.xp_earned || 0} / {dailyGoals?.xp_target || 50} XP
            </span>
          </div>
          <Progress value={dailyXPProgress} className="h-3" />
          {dailyXPProgress >= 100 && (
            <p className="text-sm text-success mt-2 font-medium">
              🎉 Daily goal achieved! Keep going for bonus XP!
            </p>
          )}
        </motion.div>

        {/* Continue Learning Card */}
        {greetingCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link to={`/learn/cards/${greetingCategory.id}`}>
              <div className="card-interactive p-5 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl">
                    {greetingCategory.icon || '👋'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Continue Learning</p>
                    <h3 className="font-semibold text-foreground">{greetingCategory.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={greetingProgress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{greetingProgress}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            {
              icon: BookOpen,
              label: 'Words',
              value: profile?.xp_total ? Math.floor(profile.xp_total / 10) : 0,
              color: 'text-primary',
            },
            {
              icon: MessageCircle,
              label: 'Phrases',
              value: dailyGoals?.cards_completed || 0,
              color: 'text-success',
            },
            {
              icon: Zap,
              label: 'XP Today',
              value: dailyGoals?.xp_earned || 0,
              color: 'text-xp',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="card-elevated p-4 text-center"
            >
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Goals Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-xp" />
            Today's Goals
          </h2>
          <div className="space-y-3">
            {[
              {
                label: 'Complete 1 lesson',
                completed: (dailyGoals?.lessons_completed || 0) >= (dailyGoals?.lessons_target || 1),
                current: dailyGoals?.lessons_completed || 0,
                target: dailyGoals?.lessons_target || 1,
                xp: 20,
              },
              {
                label: 'Practice 10 flashcards',
                completed: (dailyGoals?.cards_completed || 0) >= (dailyGoals?.cards_target || 10),
                current: dailyGoals?.cards_completed || 0,
                target: dailyGoals?.cards_target || 10,
                xp: 15,
              },
              {
                label: 'Chat for 5 minutes',
                completed: (dailyGoals?.chat_minutes_completed || 0) >= (dailyGoals?.chat_minutes_target || 5),
                current: dailyGoals?.chat_minutes_completed || 0,
                target: dailyGoals?.chat_minutes_target || 5,
                xp: 10,
              },
            ].map((goal, index) => (
              <motion.div
                key={goal.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  goal.completed ? 'bg-success/10' : 'bg-muted/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    goal.completed
                      ? 'bg-success text-success-foreground'
                      : 'border-2 border-muted-foreground'
                  }`}
                >
                  {goal.completed && <span className="text-sm">✓</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.label}
                  </p>
                  {!goal.completed && (
                    <p className="text-xs text-muted-foreground">
                      {goal.current} / {goal.target}
                    </p>
                  )}
                </div>
                <span className="xp-badge text-xs">+{goal.xp} XP</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        {earnedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-elevated p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-xp" />
                Achievements
              </h2>
              <Link to="/profile" className="text-sm text-primary flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {earnedAchievements.slice(0, 5).map((earned, index) => {
                const achievement = achievements.find(a => a.id === earned.achievement_id);
                if (!achievement) return null;

                return (
                  <motion.div
                    key={earned.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                    className="flex-shrink-0 w-20 text-center"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-xp/20 to-accent/20 flex items-center justify-center text-2xl mb-1">
                      {achievement.icon}
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {achievement.name}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link to="/learn">
            <Button className="w-full h-14 btn-primary text-base">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Lesson
            </Button>
          </Link>
          <Link to="/practice">
            <Button variant="outline" className="w-full h-14 text-base rounded-xl">
              <Zap className="h-5 w-5 mr-2" />
              Quick Quiz
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
