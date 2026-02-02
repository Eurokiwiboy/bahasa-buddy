import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Play, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { greetingCards, sampleLesson } from '@/data/sampleData';

const categories = [
  { id: 'greetings', name: 'Greetings', icon: '👋', color: 'splash-card-greetings', cards: 20, progress: 35 },
  { id: 'food', name: 'Food & Dining', icon: '🍜', color: 'splash-card-food', cards: 25, progress: 0 },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'splash-card-travel', cards: 30, progress: 0 },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'splash-card-shopping', cards: 20, progress: 0 },
  { id: 'emergency', name: 'Emergency', icon: '🏥', color: 'splash-card-emergency', cards: 15, progress: 0 },
  { id: 'casual', name: 'Casual Talk', icon: '💬', color: 'splash-card-casual', cards: 35, progress: 0 },
];

const lessons = [
  { id: 'l1', title: 'Restaurant Basics', category: 'food', duration: 10, xp: 50, completed: false },
  { id: 'l2', title: 'Meeting People', category: 'greetings', duration: 8, xp: 40, completed: true },
  { id: 'l3', title: 'At the Airport', category: 'travel', duration: 12, xp: 60, completed: false },
  { id: 'l4', title: 'Bargaining Tips', category: 'shopping', duration: 10, xp: 50, completed: false },
];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
          <p className="text-muted-foreground mt-1">Choose what to study today</p>
        </motion.div>

        {/* Splash Card Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl">🎴</span> Splash Cards
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Link to={`/learn/cards/${category.id}`}>
                  <div className={`card-interactive p-4 relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${category.color} opacity-10`} />
                    <div className="relative">
                      <span className="text-3xl block mb-2">{category.icon}</span>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.cards} cards</p>
                      {category.progress > 0 && (
                        <div className="mt-2">
                          <Progress value={category.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lessons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Lessons
            </h2>
          </div>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <Link to={`/learn/lesson/${lesson.id}`}>
                  <div className={`card-interactive p-4 flex items-center gap-4 ${lesson.completed ? 'opacity-60' : ''}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      categories.find(c => c.id === lesson.category)?.color || 'bg-muted'
                    }`}>
                      <span className="text-2xl">
                        {categories.find(c => c.id === lesson.category)?.icon || '📚'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {lesson.xp} XP
                        </span>
                      </div>
                    </div>
                    {lesson.completed ? (
                      <span className="text-success text-xl">✓</span>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
