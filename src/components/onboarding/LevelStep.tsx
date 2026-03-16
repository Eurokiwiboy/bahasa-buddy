import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const levels = [
  {
    value: 'beginner' as const,
    label: 'Beginner',
    emoji: '🌱',
    description: 'No prior knowledge of Indonesian',
  },
  {
    value: 'elementary' as const,
    label: 'Elementary',
    emoji: '📗',
    description: 'I know some basic words and phrases',
  },
  {
    value: 'intermediate' as const,
    label: 'Intermediate',
    emoji: '🚀',
    description: 'I can hold simple conversations',
  },
];

type LearningLevel = 'beginner' | 'elementary' | 'intermediate';

interface LevelStepProps {
  onNext: (level: LearningLevel) => void;
}

export function LevelStep({ onNext }: LevelStepProps) {
  const [selected, setSelected] = useState<LearningLevel | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          What's your Indonesian level?
        </h2>
        <p className="text-muted-foreground mt-1">
          We'll tailor your learning path
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {levels.map((level, i) => (
          <motion.button
            key={level.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            onClick={() => setSelected(level.value)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              selected === level.value
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{level.emoji}</span>
              <div>
                <p className="font-semibold text-foreground">{level.label}</p>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
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
