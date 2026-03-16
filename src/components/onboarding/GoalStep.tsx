import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const goals = [
  {
    label: 'Casual',
    xp: 50,
    emoji: '☕',
    description: '5 minutes a day',
  },
  {
    label: 'Regular',
    xp: 100,
    emoji: '📚',
    description: '10 minutes a day',
  },
  {
    label: 'Serious',
    xp: 200,
    emoji: '🔥',
    description: '20 minutes a day',
  },
];

interface GoalStepProps {
  onNext: (xpTarget: number) => void;
}

export function GoalStep({ onNext }: GoalStepProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Set your daily goal
        </h2>
        <p className="text-muted-foreground mt-1">
          How much do you want to learn each day?
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {goals.map((goal, i) => (
          <motion.button
            key={goal.xp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            onClick={() => setSelected(goal.xp)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              selected === goal.xp
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{goal.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{goal.label}</p>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
              <span className="text-sm font-medium text-primary">{goal.xp} XP</span>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="w-full h-14 btn-primary text-lg rounded-2xl"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
