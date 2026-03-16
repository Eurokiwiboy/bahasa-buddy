import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Volume2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseShellProps {
  children: React.ReactNode;
  isCorrect: boolean | null;
  correctAnswer: string;
  xpEarned?: number;
  onNext: () => void;
  onPlayAudio?: () => void;
}

export default function ExerciseShell({
  children,
  isCorrect,
  correctAnswer,
  xpEarned,
  onNext,
  onPlayAudio,
}: ExerciseShellProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`p-4 rounded-t-2xl ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground">
                    Correct answer: <strong>{correctAnswer}</strong>
                  </p>
                )}
                {isCorrect && xpEarned && (
                  <p className="text-sm text-green-600">+{xpEarned} XP</p>
                )}
              </div>
              {onPlayAudio && (
                <button onClick={onPlayAudio} className="ml-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-primary" />
                </button>
              )}
            </div>
            <Button onClick={onNext} className="w-full h-12">
              Continue <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
