import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { LevelStep } from '@/components/onboarding/LevelStep';
import { GoalStep } from '@/components/onboarding/GoalStep';
import { CompletionStep } from '@/components/onboarding/CompletionStep';

type LearningLevel = 'beginner' | 'elementary' | 'intermediate';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile, updateDailyGoals } = useProfile();

  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>('beginner');

  // Show spinner while loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Already onboarded → home
  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />;
  }

  const displayName =
    user?.user_metadata?.display_name ||
    profile?.display_name ||
    user?.email?.split('@')[0] ||
    'Learner';

  const handleLevelSelected = (level: LearningLevel) => {
    setSelectedLevel(level);
    setStep(2);
  };

  const handleGoalSelected = async (xpTarget: number) => {
    // Save level to profile
    await updateProfile({ learning_level: selectedLevel });
    // Save XP goal to daily goals
    await updateDailyGoals({ xp_target: xpTarget });
    setStep(3);
  };

  const handleFinish = async () => {
    await updateProfile({ onboarding_completed: true });
    navigate('/learn');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Step indicators */}
        <div className="flex gap-2 mb-8 px-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <WelcomeStep
              key="welcome"
              displayName={displayName}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <LevelStep key="level" onNext={handleLevelSelected} />
          )}
          {step === 2 && (
            <GoalStep key="goal" onNext={handleGoalSelected} />
          )}
          {step === 3 && (
            <CompletionStep key="completion" onFinish={handleFinish} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
