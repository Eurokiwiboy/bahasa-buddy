import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Trophy, Target, Flame, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { greetingCards } from '@/data/sampleData';

type QuizType = 'multiple-choice' | 'fill-blank' | 'matching';

interface QuizQuestion {
  id: string;
  type: QuizType;
  indonesian: string;
  english: string;
  options?: string[];
  correctAnswer: string;
}

const generateQuestions = (): QuizQuestion[] => {
  const shuffled = [...greetingCards].sort(() => Math.random() - 0.5).slice(0, 5);
  
  return shuffled.map((card, index) => {
    const wrongOptions = greetingCards
      .filter(c => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.english);
    
    const options = [...wrongOptions, card.english].sort(() => Math.random() - 0.5);
    
    return {
      id: card.id,
      type: 'multiple-choice' as QuizType,
      indonesian: card.indonesian,
      english: card.english,
      options,
      correctAnswer: card.english,
    };
  });
};

export default function PracticePage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  const startQuiz = () => {
    setQuestions(generateQuestions());
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const progress = quizStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const xpEarned = score * 10 + (streak >= 3 ? 5 : 0);

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
              <p className="text-2xl font-bold text-foreground">{score}/{questions.length}</p>
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
            <Button onClick={startQuiz} className="flex-1 btn-primary">
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
              { icon: Zap, label: 'Today', value: '25 XP', color: 'text-xp' },
              { icon: Trophy, label: 'Best Streak', value: '5', color: 'text-accent' },
              { icon: Target, label: 'Accuracy', value: '78%', color: 'text-primary' },
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

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8 flex flex-col">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
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

      {/* Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="card-elevated p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-2">What does this mean?</p>
          <h2 className="text-3xl font-bold font-serif text-foreground">
            {question.indonesian}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          <AnimatePresence>
            {question.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              
              let bgClass = 'bg-card border-border';
              if (showResult) {
                if (isCorrectOption) {
                  bgClass = 'bg-success/10 border-success';
                } else if (isSelected && !isCorrectOption) {
                  bgClass = 'bg-destructive/10 border-destructive';
                }
              } else if (isSelected) {
                bgClass = 'bg-primary/10 border-primary';
              }
              
              return (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${bgClass} ${
                    !showResult ? 'hover:border-primary/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Feedback & Next */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4"
            >
              <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <p className={`font-semibold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {isCorrect ? '🎉 Correct!' : '😅 Not quite!'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-muted-foreground mt-1">
                    The correct answer is: <span className="font-medium text-foreground">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
              <Button onClick={nextQuestion} className="w-full btn-primary h-14 text-lg">
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
