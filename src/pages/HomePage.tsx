import { motion } from 'framer-motion';
import { Flame, BookOpen, MessageCircle, Trophy, ChevronRight, Check, Target, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { sampleUser, greetingCards } from '@/data/sampleData';
import { Link } from 'react-router-dom';

const dailyGoals = [
  { id: 1, label: 'Complete 1 lesson', completed: true, xp: 20 },
  { id: 2, label: 'Practice 10 flashcards', completed: false, xp: 15 },
  { id: 3, label: 'Chat for 5 minutes', completed: false, xp: 15 },
];

const quickStats = [
  { label: 'Words', value: sampleUser.wordsLearned, icon: BookOpen, color: 'text-primary' },
  { label: 'Phrases', value: sampleUser.phrasesMastered, icon: Zap, color: 'text-accent' },
  { label: 'Chat mins', value: sampleUser.chatMinutes, icon: MessageCircle, color: 'text-success' },
];

export default function HomePage() {
  const dailyXP = 32;
  const dailyGoalXP = 50;
  const xpProgress = (dailyXP / dailyGoalXP) * 100;

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Halo, {sampleUser.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">Ready to learn today?</p>
          </div>
          <div className="streak-badge flex items-center gap-1.5 px-3 py-2">
            <Flame className="h-5 w-5 animate-fire" />
            <span className="font-bold">{sampleUser.streak}</span>
          </div>
        </motion.div>

        {/* Daily XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Daily Goal</span>
            </div>
            <span className="xp-badge">{dailyXP} / {dailyGoalXP} XP</span>
          </div>
          <Progress value={xpProgress} className="h-3 bg-muted" />
          <p className="text-sm text-muted-foreground mt-2">
            {dailyGoalXP - dailyXP} XP more to reach your daily goal!
          </p>
        </motion.div>

        {/* Continue Learning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link to="/learn" className="block">
            <div className="card-interactive p-5 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl splash-card-greetings flex items-center justify-center text-2xl">
                    👋
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Continue where you left off</p>
                    <h3 className="font-semibold text-foreground text-lg">Greetings & Introductions</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={35} className="w-24 h-2" />
                      <span className="text-xs text-muted-foreground">7/20 cards</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="card-elevated p-4 text-center"
            >
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="font-semibold text-foreground">Daily Goals</h2>
          </div>
          <div className="space-y-3">
            {dailyGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  goal.completed ? 'bg-success/10' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      goal.completed
                        ? 'bg-success text-success-foreground'
                        : 'border-2 border-muted-foreground'
                    }`}
                  >
                    {goal.completed && <Check className="h-4 w-4" />}
                  </div>
                  <span
                    className={`font-medium ${
                      goal.completed ? 'text-success line-through' : 'text-foreground'
                    }`}
                  >
                    {goal.label}
                  </span>
                </div>
                <span className={`text-sm font-medium ${goal.completed ? 'text-success' : 'text-muted-foreground'}`}>
                  +{goal.xp} XP
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="font-semibold text-foreground">Recent Achievements</h2>
            </div>
            <Link to="/profile" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
            {sampleUser.achievements
              .filter((a) => a.earned)
              .map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className={`achievement-badge ${achievement.color} text-white text-2xl flex-shrink-0 cursor-pointer`}
                  title={achievement.name}
                >
                  {achievement.icon}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link to="/learn">
            <div className="card-interactive p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-3xl mb-2 block">📚</span>
              <p className="font-semibold text-foreground">Start Lesson</p>
            </div>
          </Link>
          <Link to="/practice">
            <div className="card-interactive p-4 text-center bg-gradient-to-br from-accent/10 to-accent/5">
              <span className="text-3xl mb-2 block">🧠</span>
              <p className="font-semibold text-foreground">Quick Quiz</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
