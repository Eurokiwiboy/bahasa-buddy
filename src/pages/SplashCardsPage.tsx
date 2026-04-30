import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import { useProfile } from '@/hooks/useProfile';
import { playFeedbackTone, speakIndonesian } from '@/lib/audio';

// Map category names to CSS gradient class suffixes
const categoryGradientMap: Record<string, string> = {
  'Greetings': 'greetings',
  'Food': 'food',
  'Travel': 'travel',
  'Shopping': 'shopping',
  'Emergency': 'emergency',
  'Numbers': 'numbers',
  'Daily Life': 'daily-life',
  'Formal': 'formal',
};

export default function SplashCardsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, fetchCardsByCategory, recordCardReview, loading: hooksLoading } = useCards();
  const { profile } = useProfile();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const category = categories.find(c => c.id === categoryId);
  const gradientSuffix = category ? (categoryGradientMap[category.name] || 'greetings') : 'greetings';

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      fetchCardsByCategory(categoryId).then((data) => {
        setCards(data);
        setLoading(false);
      });
    }
  }, [categoryId, fetchCardsByCategory]);

  const currentCard = cards[currentIndex];
  const soundEnabled = profile?.sound_enabled ?? true;

  const playCardAudio = useCallback((text: string, audioUrl?: string | null) => {
    if (audioUrl) {
      new Audio(audioUrl).play().catch(() => speakIndonesian(text));
      return;
    }

    speakIndonesian(text);
  }, []);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (!currentCard || isReviewing) return;

    const isCorrect = direction === 'right';
    setIsReviewing(true);
    setSwipeDirection(direction);
    playFeedbackTone(isCorrect ? 'correct' : 'incorrect', soundEnabled);

    if (isCorrect) {
      setMasteredCards(prev => [...prev, currentCard.id]);
    } else {
      setReviewCards(prev => [...prev, currentCard.id]);
    }

    await recordCardReview(currentCard.id, isCorrect);

    // Small delay for exit animation
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setSwipeDirection(null);
        setIsReviewing(false);
      } else {
        setShowCelebration(true);
        setIsReviewing(false);
      }
    }, 200);
  }, [currentCard, currentIndex, cards.length, recordCardReview, isReviewing, soundEnabled]);

  if (loading || hooksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Cards Yet</h1>
          <p className="text-muted-foreground mb-4">
            {category?.name || 'This category'} doesn't have any cards yet.
          </p>
          <Button onClick={() => navigate('/learn')} className="btn-primary">Back to Learn</Button>
        </div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Deck Complete!</h1>
          <p className="text-muted-foreground mb-6">
            {masteredCards.length} mastered · {reviewCards.length} to review
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/learn')} variant="outline" className="rounded-xl">
              Back to Learn
            </Button>
            <Button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setMasteredCards([]);
                setReviewCards([]);
                setShowCelebration(false);
                setSwipeDirection(null);
                setIsReviewing(false);
              }}
              className="btn-primary"
            >
              Practice Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <div className="flex gap-1">
            {cards.slice(0, Math.min(cards.length, 15)).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            drag={isReviewing ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (isReviewing) return;
              if (info.offset.x > 100) handleSwipe('right');
              else if (info.offset.x < -100) handleSwipe('left');
            }}
            className={`w-full max-w-sm select-none ${isReviewing ? 'cursor-wait' : 'cursor-pointer'}`}
          >
            <div
              className={`splash-card splash-card-${gradientSuffix} aspect-[3/4] rounded-3xl shadow-xl`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Front Face */}
                <div className="flip-card-face p-6 flex flex-col items-center justify-center text-white">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playCardAudio(currentCard.indonesian_text, currentCard.audio_url);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <h2 className="text-3xl lg:text-4xl font-bold font-serif text-center mb-4">
                    {currentCard.indonesian_text}
                  </h2>
                  <p className="text-lg text-white/80 italic">
                    /{currentCard.pronunciation_guide}/
                  </p>
                  <p className="absolute bottom-6 text-sm text-white/60">Tap to flip</p>
                </div>

                {/* Back Face */}
                <div className="flip-card-face flip-card-back p-6 flex flex-col text-white overflow-auto">
                  <h3 className="text-2xl font-bold mb-2">{currentCard.english_translation}</h3>
                  <div className="mt-4 space-y-4">
                    {currentCard.example_sentence_id && (
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <p className="text-sm text-white/70">Example</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playCardAudio(currentCard.example_sentence_id);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                            aria-label="Play example sentence"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-medium font-serif">{currentCard.example_sentence_id}</p>
                        {currentCard.example_sentence_en && (
                          <p className="text-sm text-white/80 mt-1">{currentCard.example_sentence_en}</p>
                        )}
                      </div>
                    )}
                    {currentCard.cultural_note && (
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">💡 Cultural Context</p>
                        <p className="text-sm">{currentCard.cultural_note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Review actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleSwipe('left')}
          variant="outline"
          disabled={isReviewing}
          aria-label="Mark this card for more practice"
          className="h-14 rounded-2xl border-destructive/25 bg-background/70 text-destructive hover:bg-destructive/10"
        >
          <X className="h-6 w-6 mr-2" />
          Practice more
        </Button>
        <Button
          onClick={() => handleSwipe('right')}
          disabled={isReviewing}
          aria-label="Mark this card as understood"
          className="h-14 rounded-2xl bg-success hover:bg-success/90 text-success-foreground"
        >
          <Check className="h-6 w-6 mr-2" />
          Got it
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Swipe left to practice again, right when it feels solid.
      </p>
    </div>
  );
}
