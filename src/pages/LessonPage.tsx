import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLessons } from '@/hooks/useLessons';
import { ExerciseRouter, ExerciseShell } from '@/components/exercises';
import GrammarTipCard from '@/components/GrammarTipCard';

interface TipContent {
  title: string;
  explanation: string;
  examples: Array<{ indonesian: string; english: string; note?: string }>;
}

function speakIndonesian(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

function xpForDifficulty(tier: string | null): number {
  const map: Record<string, number> = { easy: 5, medium: 10, hard: 15 };
  return map[tier || 'easy'] || 5;
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    lessons,
    currentLesson,
    phrases,
    loading,
    startLesson,
    completeLesson,
    recordExerciseAnswer,
  } = useLessons();

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [currentResult, setCurrentResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const lesson = lessons.find(l => l.id === lessonId);
  const currentPhrase = phrases[currentPhraseIndex];
  const progress = phrases.length > 0 ? ((currentPhraseIndex + 1) / phrases.length) * 100 : 0;

  useEffect(() => {
    if (lesson && !currentLesson) {
      startLesson(lesson);
    }
  }, [lesson, currentLesson, startLesson]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Lesson not found</h1>
          <p className="text-muted-foreground mb-4">This lesson doesn't exist yet.</p>
          <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  // Grammar tip gate
  if (showTip && currentLesson?.tip_content) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/learn')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-semibold text-foreground">{lesson.title}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <GrammarTipCard
            tip={currentLesson.tip_content as TipContent}
            onDismiss={() => setShowTip(false)}
          />
        </div>
      </div>
    );
  }

  if (completed) {
    const pct = phrases.length > 0 ? Math.round((score / phrases.length) * 100) : 0;
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Lesson Complete!</h1>
          <p className="text-muted-foreground mb-2">{lesson.title}</p>
          <p className="text-lg font-semibold text-primary mb-2">
            Score: {score}/{phrases.length} ({pct}%)
          </p>
          <p className="text-muted-foreground mb-6">+{lesson.xp_reward} XP</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/learn')} variant="outline" className="rounded-xl">
              Back to Learn
            </Button>
            <Button onClick={() => navigate('/practice')}>
              Practice Now
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentPhrase) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No phrases in this lesson yet.</p>
          <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  const handleAnswer = async (correct: boolean, userAnswer: string) => {
    setCurrentResult(correct);
    if (correct) {
      setScore(s => s + 1);
    }
    await recordExerciseAnswer(
      lesson.id,
      currentPhrase.id,
      correct,
      currentPhrase.exercise_type,
      currentPhrase.difficulty_tier || 'easy',
      currentPhrase.indonesian_text,
      currentPhrase.english_translation,
      userAnswer
    );
  };

  const handleNext = async () => {
    setCurrentResult(null);
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    } else {
      const finalScore = Math.round((score / phrases.length) * 100);
      await completeLesson(lesson.id, finalScore);
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/learn')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">{lesson.title}</h2>
          <Progress value={progress} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {currentPhraseIndex + 1} / {phrases.length}
          </p>
        </div>
      </div>

      {/* Exercise Engine */}
      <ExerciseShell
        isCorrect={currentResult}
        correctAnswer={currentPhrase.english_translation}
        xpEarned={currentResult === true ? xpForDifficulty(currentPhrase.difficulty_tier) : undefined}
        onNext={handleNext}
        onPlayAudio={() => speakIndonesian(currentPhrase.indonesian_text)}
      >
        <ExerciseRouter
          phrase={currentPhrase}
          allPhrases={phrases}
          onAnswer={handleAnswer}
          onNext={handleNext}
          showResult={currentResult !== null}
        />
      </ExerciseShell>
    </div>
  );
}
