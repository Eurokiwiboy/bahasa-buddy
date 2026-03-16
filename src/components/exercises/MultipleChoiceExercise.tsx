import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExerciseProps } from './types';

interface MultipleChoiceProps extends ExerciseProps {
  reverse?: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MultipleChoiceExercise({
  phrase,
  allPhrases,
  onAnswer,
  showResult,
  reverse = false,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const prompt = reverse ? phrase.english_translation : phrase.indonesian_text;
  const correctAnswer = reverse ? phrase.indonesian_text : phrase.english_translation;

  const options = useMemo(() => {
    const wrongOptions = allPhrases
      .filter((p) =>
        reverse
          ? p.indonesian_text !== phrase.indonesian_text
          : p.english_translation !== phrase.english_translation
      )
      .map((p) => (reverse ? p.indonesian_text : p.english_translation));

    const uniqueWrong = [...new Set(wrongOptions)];
    const picked = shuffleArray(uniqueWrong).slice(0, 3);
    return shuffleArray([...picked, correctAnswer]);
  }, [phrase.id, reverse]);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    onAnswer(option === correctAnswer, option);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {reverse ? 'Translate to Indonesian' : 'What does this mean?'}
        </p>
        <p className="text-2xl font-bold">{prompt}</p>
        {!reverse && phrase.pronunciation_guide && (
          <p className="text-sm text-muted-foreground italic">
            {phrase.pronunciation_guide}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, i) => {
          let variant = 'default';
          if (showResult && selected === option) {
            variant = option === correctAnswer ? 'correct' : 'wrong';
          } else if (showResult && option === correctAnswer) {
            variant = 'correct';
          }

          return (
            <motion.button
              key={`${option}-${i}`}
              whileTap={!showResult ? { scale: 0.97 } : undefined}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                variant === 'correct'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : variant === 'wrong'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : selected === option
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span className="text-sm font-medium">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
