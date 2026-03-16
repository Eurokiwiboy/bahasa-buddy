import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '@/integrations/supabase/types';

interface AchievementCardProps {
  achievement: Achievement;
  isEarned: boolean;
  earnedAt?: string | null;
  currentProgress: number | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export function AchievementCard({
  achievement,
  isEarned,
  earnedAt,
  currentProgress,
  isExpanded,
  onToggle,
}: AchievementCardProps) {
  const progressPercent =
    currentProgress !== null
      ? Math.min(Math.round((currentProgress / achievement.requirement_value) * 100), 100)
      : null;

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`w-full flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
          isEarned
            ? 'bg-primary/10 ring-2 ring-primary/30'
            : 'bg-muted/50 opacity-60'
        }`}
      >
        <span className="text-2xl">{achievement.icon}</span>
        <span className="text-xs font-medium text-foreground text-center leading-tight">
          {achievement.name}
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-xl bg-card border border-border text-sm space-y-2">
              <p className="text-muted-foreground">{achievement.description}</p>

              {progressPercent !== null && !isEarned && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {currentProgress}/{achievement.requirement_value}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>
              )}

              {isEarned && earnedAt && (
                <p className="text-xs text-primary font-medium">
                  Earned {new Date(earnedAt).toLocaleDateString()}
                </p>
              )}

              {!isEarned && progressPercent === null && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Not yet earned</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
