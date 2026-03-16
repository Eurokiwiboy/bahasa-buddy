import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExerciseProps } from './types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MatchPairsExercise({
  phrase,
  allPhrases,
  onAnswer,
  showResult,
}: ExerciseProps) {
  const pairs = useMemo(() => {
    const others = allPhrases
      .filter((p) => p.indonesian_text !== phrase.indonesian_text)
      .slice(0, 3);
    return [
      { id: phrase.indonesian_text, en: phrase.english_translation },
      ...others.map((p) => ({ id: p.indonesian_text, en: p.english_translation })),
    ];
  }, [phrase.id]);

  const leftItems = useMemo(() => shuffleArray(pairs.map((p) => p.id)), [pairs]);
  const rightItems = useMemo(() => shuffleArray(pairs.map((p) => p.en)), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  const checkPair = (left: string, right: string) => {
    const pair = pairs.find((p) => p.id === left);
    if (pair && pair.en === right) {
      const newMatched = new Set(matched);
      newMatched.add(left);
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (newMatched.size === pairs.length) {
        onAnswer(true, 'all_matched');
      }
    } else {
      setWrongPair({ left, right });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  };

  const handleLeftTap = (item: string) => {
    if (showResult || matched.has(item)) return;
    setSelectedLeft(item);
    if (selectedRight) checkPair(item, selectedRight);
  };

  const handleRightTap = (item: string) => {
    if (showResult || [...matched].some((m) => pairs.find((p) => p.id === m)?.en === item)) return;
    setSelectedRight(item);
    if (selectedLeft) checkPair(selectedLeft, item);
  };

  const isRightMatched = (en: string) =>
    [...matched].some((m) => pairs.find((p) => p.id === m)?.en === en);

  return (
    <div className="w-full max-w-md space-y-4">
      <p className="text-sm text-muted-foreground text-center">Tap matching pairs</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {leftItems.map((item) => (
            <motion.button
              key={item}
              onClick={() => handleLeftTap(item)}
              disabled={matched.has(item)}
              animate={
                matched.has(item)
                  ? { opacity: 0.3, scale: 0.95 }
                  : wrongPair?.left === item
                  ? { x: [0, -4, 4, -4, 0] }
                  : {}
              }
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                matched.has(item)
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : wrongPair?.left === item
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : selectedLeft === item
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
              }`}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {rightItems.map((item) => (
            <motion.button
              key={item}
              onClick={() => handleRightTap(item)}
              disabled={isRightMatched(item)}
              animate={
                isRightMatched(item)
                  ? { opacity: 0.3, scale: 0.95 }
                  : wrongPair?.right === item
                  ? { x: [0, -4, 4, -4, 0] }
                  : {}
              }
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                isRightMatched(item)
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : wrongPair?.right === item
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : selectedRight === item
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
              }`}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
