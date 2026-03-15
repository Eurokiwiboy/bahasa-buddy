import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, Volume2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';

export default function SplashCardsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, fetchCardsByCategory, recordCardReview, loading: hooksLoading } = useCards();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const category = categories.find(c => c.id === categoryId);

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

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentCard) return;

    const isCorrect = direction === 'right';

    if (isCorrect) {
      setMasteredCards(prev => [...prev, currentCard.id]);
    } else {
      setReviewCards(prev => [...prev, currentCard.id]);
    }

    // Record the review in Supabase
    await recordCardReview(currentCard.id, isCorrect);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowCelebration(true);
    }
  };

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
            {masteredCards.length} mastered • {reviewCards.length} to review
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
            {cards.slice(0, Math.min(cards.length, 10)).map((_, i) => (
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
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleSwipe('right');
              else if (info.offset.x < -100) handleSwipe('left');
            }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer w-full max-w-sm"
          >
            <div
              className="splash-card splash-card-greetings aspect-[3/4] relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
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

              {/* Back */}
              <div
                className={`absolute inset-0 p-6 flex flex-col text-white overflow-auto transition-opacity duration-300 ${
                  isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{currentCard.english_translation}</h3>
                <div className="mt-4 space-y-4">
                  {currentCard.example_sentence_id && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm text-white/70 mb-1">Example</p>
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe hints */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="h-6 w-6 text-destructive" />
          </div>
          <span className="text-sm">Practice more</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-sm">Got it!</span>
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-6 w-6 text-success" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => handleSwipe('left')}
          variant="outline"
          className="flex-1 h-14 rounded-2xl text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <X className="h-6 w-6 mr-2" />
          Review Later
        </Button>
        <Button
          onClick={() => handleSwipe('right')}
          className="flex-1 h-14 rounded-2xl bg-success hover:bg-success/90 text-success-foreground"
        >
          <Check className="h-6 w-6 mr-2" />
          Got It!
        </Button>
      </div>
    </div>
  );
}
