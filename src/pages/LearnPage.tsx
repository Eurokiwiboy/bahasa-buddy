import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useCards } from '@/hooks/useCards';
import { useLessons } from '@/hooks/useLessons';

export default function LearnPage() {
  const { categories, loading: cardsLoading, getCategoryProgress } = useCards();
  const { lessons, loading: lessonsLoading, getLessonStatus } = useLessons();

  const loading = cardsLoading || lessonsLoading;

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
            <p className="text-muted-foreground mt-1">Choose what to study today</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

          {categories.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">No card categories available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => {
                const progress = getCategoryProgress(category.id);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                  >
                    <Link to={`/learn/cards/${category.id}`}>
                      <div className="card-interactive p-4 relative overflow-hidden">
                        <div className="relative">
                          <span className="text-3xl block mb-2">{category.icon || '📚'}</span>
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description || ''}</p>
                          {progress > 0 && (
                            <div className="mt-2">
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
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

          {lessons.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">No lessons available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const status = getLessonStatus(lesson.id);
                const isCompleted = status === 'completed';
                const category = categories.find(c => c.id === lesson.category_id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <Link to={`/learn/lesson/${lesson.id}`}>
                      <div className={`card-interactive p-4 flex items-center gap-4 ${isCompleted ? 'opacity-60' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl">{category?.icon || '📚'}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.estimated_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {lesson.xp_reward} XP
                            </span>
                          </div>
                        </div>
                        {isCompleted ? (
                          <span className="text-success text-xl">✓</span>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
