import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, Volume2, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { greetingCards } from '@/data/sampleData';
import { Button } from '@/components/ui/button';

export default function SplashCardsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const cards = greetingCards; // Would filter by categoryId in real app
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setMasteredCards([...masteredCards, currentCard.id]);
    } else {
      setReviewCards([...reviewCards, currentCard.id]);
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowCelebration(true);
    }
  };

  const getCategoryClass = () => {
    switch (categoryId) {
      case 'food': return 'splash-card-food';
      case 'travel': return 'splash-card-travel';
      case 'shopping': return 'splash-card-shopping';
      case 'emergency': return 'splash-card-emergency';
      case 'casual': return 'splash-card-casual';
      default: return 'splash-card-greetings';
    }
  };

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
            {cards.slice(0, 10).map((_, i) => (
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
      <div className="flex-1 flex items-center justify-center perspective-1000">
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
              className={`splash-card ${getCategoryClass()} aspect-[3/4] relative transform-style-3d transition-transform duration-500 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0 p-6 flex flex-col items-center justify-center text-white backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Would play audio here
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Volume2 className="h-5 w-5" />
                </button>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl lg:text-4xl font-bold font-serif text-center mb-4"
                >
                  {currentCard.indonesian}
                </motion.h2>
                <p className="text-lg text-white/80 italic">
                  /{currentCard.pronunciation}/
                </p>
                <p className="absolute bottom-6 text-sm text-white/60">
                  Tap to flip
                </p>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 p-6 flex flex-col text-white backface-hidden rotate-y-180 overflow-auto"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h3 className="text-2xl font-bold mb-2">{currentCard.english}</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70 mb-1">Example</p>
                    <p className="font-medium font-serif">{currentCard.exampleSentence}</p>
                    <p className="text-sm text-white/80 mt-1">{currentCard.exampleTranslation}</p>
                  </div>
                  
                  {currentCard.culturalContext && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm text-white/70 mb-1">💡 Cultural Context</p>
                      <p className="text-sm">{currentCard.culturalContext}</p>
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
