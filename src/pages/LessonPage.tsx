import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLessons } from '@/hooks/useLessons';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    lessons,
    currentLesson,
    phrases,
    loading,
    startLesson,
    updatePhraseProgress,
    completeLesson,
  } = useLessons();

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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
          <Button onClick={() => navigate('/learn')} className="btn-primary">Back to Learn</Button>
        </div>
      </div>
    );
  }

  if (completed) {
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
          <p className="text-lg font-semibold text-primary mb-6">+{lesson.xp_reward} XP</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/learn')} variant="outline" className="rounded-xl">
              Back to Learn
            </Button>
            <Button onClick={() => navigate('/practice')} className="btn-primary">
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
          <Button onClick={() => navigate('/learn')} className="btn-primary">Back to Learn</Button>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
      setIsFlipped(false);
      await updatePhraseProgress(lesson.id, currentPhraseIndex + 2);
    } else {
      await completeLesson(lesson.id, 100);
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
            {currentPhraseIndex + 1} / {phrases.length} phrases
          </p>
        </div>
      </div>

      {/* Phrase Card */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-sm cursor-pointer"
          >
            <div className="card-elevated p-8 text-center min-h-64 flex flex-col items-center justify-center">
              {!isFlipped ? (
                <>
                  <h2 className="text-3xl font-bold font-serif text-foreground mb-4">
                    {currentPhrase.indonesian_text}
                  </h2>
                  <p className="text-lg text-muted-foreground italic">
                    /{currentPhrase.pronunciation_guide}/
                  </p>
                  <p className="text-sm text-muted-foreground mt-6">Tap to see translation</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-2">{currentPhrase.indonesian_text}</p>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {currentPhrase.english_translation}
                  </h2>
                  {currentPhrase.example_dialogue_id && (
                    <div className="bg-muted/50 rounded-xl p-4 mt-4 w-full text-left">
                      <p className="text-sm text-muted-foreground mb-1">Example</p>
                      <p className="font-medium text-foreground">{currentPhrase.example_dialogue_id}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <Button onClick={handleNext} className="w-full h-14 btn-primary text-lg mt-4">
        {currentPhraseIndex < phrases.length - 1 ? (
          <>Next Phrase <ChevronRight className="h-5 w-5 ml-2" /></>
        ) : (
          <>Complete Lesson <CheckCircle2 className="h-5 w-5 ml-2" /></>
        )}
      </Button>
    </div>
  );
}
