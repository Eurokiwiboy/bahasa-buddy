import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CompletionStepProps {
  onFinish: () => void;
}

export function CompletionStep({ onFinish }: CompletionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-8xl"
      >
        🎉
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">You're all set!</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Let's learn your first Indonesian words
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs"
      >
        <Button onClick={onFinish} className="w-full h-14 btn-primary text-lg rounded-2xl">
          Start Learning
        </Button>
      </motion.div>
    </motion.div>
  );
}
