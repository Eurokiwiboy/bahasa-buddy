import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExerciseProps } from './types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function WordBankExercise({
  phrase,
  allPhrases,
  onAnswer,
  showResult,
}: ExerciseProps) {
  const correctWords = phrase.indonesian_text.split(' ');

  const allTiles = useMemo(() => {
    const distractors = allPhrases
      .filter((p) => p.indonesian_text !== phrase.indonesian_text)
      .flatMap((p) => p.indonesian_text.split(' '))
      .filter((w) => !correctWords.includes(w));
    const uniqueDistractors = [...new Set(distractors)];
    const picked = shuffleArray(uniqueDistractors).slice(0, Math.min(3, uniqueDistractors.length));
    return shuffleArray([...correctWords, ...picked]);
  }, [phrase.id]);

  const [available, setAvailable] = useState<string[]>(allTiles);
  const [placed, setPlaced] = useState<string[]>([]);

  const handleTapAvailable = (index: number) => {
    if (showResult) return;
    const word = available[index];
    setPlaced([...placed, word]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  const handleTapPlaced = (index: number) => {
    if (showResult) return;
    const word = placed[index];
    setAvailable([...available, word]);
    setPlaced(placed.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (showResult || placed.length === 0) return;
    const assembled = placed.join(' ');
    const isCorrect = assembled.toLowerCase() === phrase.indonesian_text.toLowerCase();
    onAnswer(isCorrect, assembled);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Build the sentence</p>
        <p className="text-xl font-semibold">{phrase.english_translation}</p>
      </div>

      {/* Answer area */}
      <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-border flex flex-wrap gap-2">
        {placed.length === 0 && (
          <span className="text-muted-foreground text-sm">Tap words to build...</span>
        )}
        {placed.map((word, i) => (
          <motion.button
            key={`placed-${i}`}
            layout
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={() => handleTapPlaced(i)}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((word, i) => (
          <motion.button
            key={`avail-${i}`}
            layout
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTapAvailable(i)}
            disabled={showResult}
            className="px-3 py-2 rounded-lg border-2 border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors"
          >
            {word}
          </motion.button>
        ))}
      </div>

      <Button
        onClick={handleCheck}
        disabled={placed.length === 0 || showResult}
        className="w-full h-12"
      >
        Check
      </Button>
    </div>
  );
}
