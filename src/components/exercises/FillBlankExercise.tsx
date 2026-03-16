import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExerciseProps } from './types';

export default function FillBlankExercise({
  phrase,
  onAnswer,
  showResult,
}: ExerciseProps) {
  const [userInput, setUserInput] = useState('');

  const targetWord = phrase.indonesian_text;
  const sentence = phrase.context_sentence
    ? phrase.context_sentence.replace(
        new RegExp(`\\b${targetWord}\\b`, 'i'),
        '____'
      )
    : `____ means "${phrase.english_translation}"`;

  const handleSubmit = () => {
    if (!userInput.trim() || showResult) return;
    const isCorrect = userInput.trim().toLowerCase() === targetWord.toLowerCase();
    onAnswer(isCorrect, userInput.trim());
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Fill in the blank</p>
        <p className="text-xl font-semibold leading-relaxed">{sentence}</p>
        {phrase.context_translation && (
          <p className="text-sm text-muted-foreground italic">
            {phrase.context_translation}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type the missing word..."
          disabled={showResult}
          autoFocus
          className="text-center text-lg h-12"
        />
        <Button
          onClick={handleSubmit}
          disabled={!userInput.trim() || showResult}
          className="w-full h-12"
        >
          Check
        </Button>
      </div>
    </div>
  );
}
