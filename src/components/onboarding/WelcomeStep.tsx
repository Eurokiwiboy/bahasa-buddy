import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  displayName: string;
  onNext: () => void;
}

export function WelcomeStep({ displayName, onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-8"
    >
      <motion.img
        src="/logo.png"
        alt="Bahasa Buddy"
        className="w-24 h-24 rounded-3xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      />

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Selamat datang, {displayName}!
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Let's set up your learning experience
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs"
      >
        <Button onClick={onNext} className="w-full h-14 btn-primary text-lg rounded-2xl">
          Let's get started
        </Button>
      </motion.div>
    </motion.div>
  );
}
