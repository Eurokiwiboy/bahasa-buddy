import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Target, Flame, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCards } from '@/hooks/useCards';
import { useProfile } from '@/hooks/useProfile';
import { ExerciseShell } from '@/components/exercises';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';

function speakIndonesian(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

interface QuizCard {
  id: string;
  indonesian_text: string;
  english_translation: string;
  pronunciation_guide: string | null;
}

export default function PracticePage() {
  const { cards, loading: cardsLoading } = useCards();
  const { addXP, dailyGoals, profile, getLevel } = useProfile();
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCards, setQuizCards] = useState<QuizCard[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentResult, setCurrentResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  const startQuiz = () => {
    if (cards.length < 4) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuizCards(shuffled.map(c => ({
      id: c.id,
      indonesian_text: c.indonesian_text,
      english_translation: c.english_translation,
      pronunciation_guide: c.pronunciation_guide || null,
    })));
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setQuizComplete(false);
    setCurrentResult(null);
  };

  const handleAnswer = async (correct: boolean, _userAnswer: string) => {
    setCurrentResult(correct);
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      await addXP(10, 'quiz_correct', 'Correct quiz answer');
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizCards.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentResult(null);
    } else {
      setQuizComplete(true);
    }
  };

  const progress = quizStarted ? ((currentQuestion + 1) / quizCards.length) * 100 : 0;
  const xpEarned = score * 10 + (streak >= 3 ? 5 : 0);

  if (cardsLoading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-elevated p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-4xl font-bold text-gradient-primary mb-4">{percentage}%</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{score}/{quizCards.length}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="bg-gradient-to-br from-xp/20 to-accent/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">+{xpEarned}</p>
              <p className="text-sm text-muted-foreground">XP Earned</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setQuizStarted(false)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Back
            </Button>
            <Button onClick={startQuiz} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Practice</h1>
            <p className="text-muted-foreground mt-1">Test your knowledge</p>
          </motion.div>

          {/* Practice Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { icon: Zap, label: 'Today', value: `${dailyGoals?.xp_earned || 0} XP`, color: 'text-xp' },
              { icon: Trophy, label: 'Level', value: `${getLevel()}`, color: 'text-accent' },
              { icon: Target, label: 'Cards', value: `${cards.length}`, color: 'text-primary' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="card-elevated p-4 text-center"
              >
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quiz Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="font-semibold text-foreground">Quick Practice</h2>
            
            {[
              { type: 'Multiple Choice', desc: 'Pick the correct translation', icon: '🎯', xp: 20 },
              { type: 'Fill in the Blank', desc: 'Complete the sentence', icon: '✍️', xp: 25 },
              { type: 'Listening Challenge', desc: 'Hear and translate', icon: '👂', xp: 30 },
              { type: 'Speed Round', desc: '10 questions, 60 seconds', icon: '⚡', xp: 50 },
            ].map((quiz, i) => (
              <motion.div
                key={quiz.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                onClick={startQuiz}
                className="card-interactive p-4 flex items-center gap-4 cursor-pointer"
              >
                <span className="text-3xl">{quiz.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{quiz.type}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.desc}</p>
                </div>
                <div className="text-right">
                  <span className="xp-badge">+{quiz.xp} XP</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Weak Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-elevated p-5"
          >
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-streak" />
              Focus Areas
            </h2>
            <div className="space-y-3">
              {['Formal greetings', 'Numbers 10-100', 'Food vocabulary'].map((area, i) => (
                <div key={area} className="flex items-center justify-between">
                  <span className="text-foreground">{area}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={30 + i * 20} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{30 + i * 20}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const card = quizCards[currentQuestion];

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8 flex flex-col">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizCards.length}
          </span>
          {streak > 0 && (
            <div className="streak-badge text-xs flex items-center gap-1">
              <Flame className="h-3 w-3" />
              {streak} streak
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Exercise via shared components */}
      <ExerciseShell
        isCorrect={currentResult}
        correctAnswer={card.english_translation}
        xpEarned={currentResult === true ? 10 : undefined}
        onNext={nextQuestion}
        onPlayAudio={() => speakIndonesian(card.indonesian_text)}
      >
        <MultipleChoiceExercise
          phrase={{
            id: card.id,
            indonesian_text: card.indonesian_text,
            english_translation: card.english_translation,
            pronunciation_guide: card.pronunciation_guide,
            exercise_type: 'multiple_choice',
            difficulty_tier: 'easy',
          }}
          allPhrases={quizCards}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          showResult={currentResult !== null}
        />
      </ExerciseShell>
    </div>
  );
}
