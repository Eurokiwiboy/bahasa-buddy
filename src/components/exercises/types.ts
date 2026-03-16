export interface ExerciseProps {
  phrase: {
    id: string;
    indonesian_text: string;
    english_translation: string;
    pronunciation_guide: string | null;
    context_sentence?: string | null;
    context_translation?: string | null;
    exercise_type: string;
    difficulty_tier: string;
    audio_url?: string | null;
  };
  allPhrases: Array<{ indonesian_text: string; english_translation: string }>;
  onAnswer: (correct: boolean, userAnswer: string) => void;
  onNext: () => void;
  showResult: boolean;
}

export type ExerciseType = 'multiple_choice' | 'multiple_choice_reverse' | 'match_pairs' | 'fill_blank' | 'word_bank';
