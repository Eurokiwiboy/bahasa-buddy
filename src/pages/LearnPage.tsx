import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock, ChevronDown, ChevronRight, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useCards } from '@/hooks/useCards';
import { useLessons } from '@/hooks/useLessons';
import { useCurriculum } from '@/hooks/useCurriculum';

export default function LearnPage() {
  const { categories: cardCategories, loading: cardsLoading, getCategoryProgress } = useCards();
  const { getLessonStatus } = useLessons();
  const { stages, loading: curriculumLoading } = useCurriculum();
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string>('survival');

  const loading = cardsLoading || curriculumLoading;

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
            <p className="text-muted-foreground mt-1">Your Indonesian learning path</p>
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
          <p className="text-muted-foreground mt-1">Your Indonesian learning path</p>
        </motion.div>

        {/* Splash Card Categories */}
        {cardCategories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-xl">🎴</span> Splash Cards
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cardCategories.map((category) => {
                const progress = getCategoryProgress(category.id);
                return (
                  <Link key={category.id} to={`/learn/cards/${category.id}`}>
                    <div className="card-interactive p-4">
                      <span className="text-3xl block mb-2">{category.icon || '📚'}</span>
                      <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                      {progress > 0 && <Progress value={progress} className="h-1.5 mt-2" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Curriculum Path */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" /> Curriculum
          </h2>

          <div className="space-y-4">
            {stages.map((stage) => {
              const stageCompletion =
                stage.units.length > 0
                  ? Math.round(
                      stage.units.reduce((sum, u) => sum + u.completion, 0) / stage.units.length
                    )
                  : 0;
              const isExpanded = expandedStage === stage.key;
              const allLocked = stage.units.every((u) => u.locked);

              return (
                <div key={stage.key} className="rounded-2xl border bg-card overflow-hidden">
                  {/* Stage Header */}
                  <button
                    onClick={() => setExpandedStage(isExpanded ? '' : stage.key)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground">
                        {stage.name}{' '}
                        <span className="text-xs font-normal text-muted-foreground">({stage.cefr})</span>
                      </h3>
                      <Progress value={stageCompletion} className="h-1.5 mt-2" />
                    </div>
                    {allLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Units */}
                  {isExpanded && (
                    <div className="border-t divide-y">
                      {stage.units.map((unit) => {
                        const isUnitExpanded = expandedUnit === unit.id;

                        return (
                          <div key={unit.id}>
                            <button
                              onClick={() => {
                                if (!unit.locked) {
                                  setExpandedUnit(isUnitExpanded ? null : unit.id);
                                }
                              }}
                              disabled={unit.locked}
                              className={`w-full p-4 flex items-center gap-3 transition-colors ${
                                unit.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'
                              }`}
                            >
                              <span className="text-2xl">{unit.icon || '📚'}</span>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-foreground text-sm">
                                  Unit {unit.unit_number}: {unit.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={unit.completion} className="h-1.5 flex-1" />
                                  <span className="text-xs text-muted-foreground w-8">
                                    {unit.completion}%
                                  </span>
                                </div>
                              </div>
                              {unit.locked ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <div className="flex gap-1">
                                  {unit.lessons.map((l) => {
                                    const status = getLessonStatus(l.id);
                                    return (
                                      <div
                                        key={l.id}
                                        className={`w-2.5 h-2.5 rounded-full ${
                                          status === 'completed'
                                            ? 'bg-green-500'
                                            : status === 'in_progress'
                                            ? 'bg-primary'
                                            : 'bg-muted-foreground/30'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                              )}
                            </button>

                            {/* Expanded lesson list */}
                            {isUnitExpanded && !unit.locked && (
                              <div className="bg-muted/30 px-4 pb-3 space-y-2">
                                {unit.lessons.map((lesson) => {
                                  const status = getLessonStatus(lesson.id);
                                  const isCompleted = status === 'completed';

                                  return (
                                    <Link
                                      key={lesson.id}
                                      to={`/learn/lesson/${lesson.id}`}
                                      className={`flex items-center gap-3 p-3 rounded-xl bg-card border transition-colors hover:border-primary/50 ${
                                        isCompleted ? 'opacity-60' : ''
                                      }`}
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium text-foreground text-sm">
                                          {lesson.title}
                                        </p>
                                      </div>
                                      {isCompleted ? (
                                        <span className="text-green-500 text-lg">✓</span>
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                          <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                                        </div>
                                      )}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
