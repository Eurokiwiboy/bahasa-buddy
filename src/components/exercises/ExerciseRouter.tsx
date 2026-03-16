import { ExerciseProps } from './types';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import MatchPairsExercise from './MatchPairsExercise';
import FillBlankExercise from './FillBlankExercise';
import WordBankExercise from './WordBankExercise';

export default function ExerciseRouter({ phrase, ...props }: ExerciseProps) {
  switch (phrase.exercise_type) {
    case 'multiple_choice':
      return <MultipleChoiceExercise phrase={phrase} {...props} />;
    case 'multiple_choice_reverse':
      return <MultipleChoiceExercise phrase={phrase} {...props} reverse />;
    case 'match_pairs':
      return <MatchPairsExercise phrase={phrase} {...props} />;
    case 'fill_blank':
      return <FillBlankExercise phrase={phrase} {...props} />;
    case 'word_bank':
      return <WordBankExercise phrase={phrase} {...props} />;
    default:
      return <MultipleChoiceExercise phrase={phrase} {...props} />;
  }
}
