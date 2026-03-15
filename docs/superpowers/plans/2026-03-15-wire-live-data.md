# Wire Live Supabase Data to UI Components Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded sample data with real Supabase hooks across 5 page components and the sidebar, fixing all 6 bugs from the 2026-03-15 test report.

**Architecture:** The hooks (`useAuth`, `useProfile`, `useCards`, `useLessons`, `useChat`) are already fully implemented with correct Supabase queries, SM-2 spaced repetition, and real-time subscriptions. The problem is that most UI components import from `src/data/sampleData.ts` instead of using these hooks. The fix is a wiring job — replace sample data imports with hook calls and add proper loading/error/empty states.

**Tech Stack:** React 18, TypeScript, Supabase, TanStack Query, Framer Motion, Tailwind CSS, shadcn/ui, Vitest

**Root Cause:** Most bugs share one root cause — UI reads from `src/data/sampleData.ts` instead of Supabase hooks.

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| BUG 1: Auth state split | Sidebar reads `sampleUser`, HomePage reads `useAuth()` | Wire sidebar to `useAuth` + `useProfile` |
| BUG 2: 404 on lesson routes | No `/learn/lesson/:id` route; `/login` link 404s | Add missing routes to App.tsx |
| BUG 3: Content vanishing | LearnPage uses hardcoded arrays | Wire to `useCards` + `useLessons` |
| BUG 4: Blank flashcard | SplashCardsPage uses `greetingCards` for all categories | Wire to `useCards.fetchCardsByCategory` |
| BUG 5: Chat rooms empty | Rooms exist in hook but DB may be empty | Seed chat_rooms + verify RLS |
| BUG 6: XP not updating | Sidebar shows `sampleUser.xp`; Practice never calls `addXP` | Wire sidebar + Practice to `useProfile.addXP` |

---

## File Structure

**Files to modify:**
- `src/App.tsx` — add missing routes (BUG 2)
- `src/components/DesktopSidebar.tsx` — wire to `useAuth` + `useProfile` (BUG 1, BUG 6)
- `src/pages/LearnPage.tsx` — wire to `useCards` + `useLessons` (BUG 3)
- `src/pages/SplashCardsPage.tsx` — wire to `useCards` (BUG 4)
- `src/pages/PracticePage.tsx` — wire to `useCards` + `useProfile` (BUG 6)
- `src/pages/ProfilePage.tsx` — wire to `useProfile` (BUG 6)
- `src/pages/HomePage.tsx` — fix `/login` link (BUG 2)

**Files to create:**
- `src/pages/LessonPage.tsx` — new lesson detail page (BUG 2)
- `src/pages/AuthPage.tsx` — new auth page (BUG 2)
- `supabase/migrations/20260315000003_seed_chat_rooms.sql` — seed data (BUG 5)

**Files NOT modified:** All hooks (`useAuth`, `useProfile`, `useCards`, `useLessons`, `useChat`) are correct as-is. `src/data/sampleData.ts` will be left in place but no longer imported (can be deleted later).

---

## Chunk 1: Auth & Routing (BUG 1, BUG 2)

### Task 1: Wire DesktopSidebar to real auth + profile data

**Files:**
- Modify: `src/components/DesktopSidebar.tsx`

- [ ] **Step 1: Replace sampleData import with hooks**

Replace the entire file content:

```tsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Dumbbell, Users, User, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Dumbbell },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { profile, loading, getLevel, levelTitle } = useProfile();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Learner';
  const avatarUrl = profile?.avatar_url;
  const streak = profile?.current_streak || 0;
  const xp = profile?.xp_total || 0;
  const level = getLevel();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl">
          B
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">Bahasa Buddy</h1>
          <p className="text-xs text-muted-foreground">Learn Indonesian</p>
        </div>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-streak/10 to-primary/10">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-streak animate-fire" />
            <span className="font-semibold text-foreground">{streak} Day Streak!</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-border">
        {isAuthenticated && !loading ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {displayName[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">Level {level} • {levelTitle}</p>
            </div>
            <div className="xp-badge text-xs">
              {xp} XP
            </div>
          </div>
        ) : isAuthenticated && loading ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-20 mb-1" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>
        ) : (
          <Link to="/auth" className="block p-3 rounded-xl bg-primary/10 text-center">
            <p className="text-sm font-medium text-primary">Sign In</p>
          </Link>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Verify the app builds**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to DesktopSidebar.tsx

- [ ] **Step 3: Commit**

```bash
git add src/components/DesktopSidebar.tsx
git commit -m "fix: wire sidebar to real auth + profile data (BUG 1, BUG 6)"
```

---

### Task 2: Create AuthPage and add missing routes

**Files:**
- Create: `src/pages/AuthPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx` (line 70: fix `/login` → `/auth`)

- [ ] **Step 1: Create AuthPage**

```tsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, isAuthenticated, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName || undefined);
      if (error) {
        setFormError(error.message);
      } else {
        navigate('/');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setFormError(error.message);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-3xl mx-auto mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isSignUp ? 'Start learning Indonesian today' : 'Sign in to continue learning'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-xl"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {(formError || error) && (
            <p className="text-sm text-destructive">{formError || error?.message}</p>
          )}

          <Button type="submit" className="w-full h-12 btn-primary" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl"
          onClick={() => signInWithGoogle()}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setFormError(null); }}
            className="text-primary font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Add routes to App.tsx**

In `src/App.tsx`, add the imports and routes:

After `import NotFound from "@/pages/NotFound";` add:
```tsx
import AuthPage from "@/pages/AuthPage";
import LessonPage from "@/pages/LessonPage";
```

After the `/learn/cards/:categoryId` route, add:
```tsx
            <Route path="/learn/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
```

- [ ] **Step 3: Fix HomePage `/login` link to `/auth`**

In `src/pages/HomePage.tsx` line 70, change:
```tsx
          <Link to="/login">
```
to:
```tsx
          <Link to="/auth">
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/AuthPage.tsx src/App.tsx src/pages/HomePage.tsx
git commit -m "fix: add auth page and missing /learn/lesson/:id route (BUG 2)"
```

---

### Task 3: Create LessonPage component

**Files:**
- Create: `src/pages/LessonPage.tsx`

- [ ] **Step 1: Create the lesson detail page**

```tsx
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
```

- [ ] **Step 2: Verify build**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/pages/LessonPage.tsx
git commit -m "feat: add lesson detail page for /learn/lesson/:id (BUG 2)"
```

---

## Chunk 2: Data Wiring (BUG 3, BUG 4, BUG 6)

### Task 4: Wire LearnPage to real data

**Files:**
- Modify: `src/pages/LearnPage.tsx`

- [ ] **Step 1: Rewrite LearnPage to use hooks**

Replace entire file:

```tsx
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useCards } from '@/hooks/useCards';
import { useLessons } from '@/hooks/useLessons';

export default function LearnPage() {
  const { categories, loading: cardsLoading, getCategoryProgress } = useCards();
  const { lessons, loading: lessonsLoading, getLessonStatus } = useLessons();

  const loading = cardsLoading || lessonsLoading;

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
            <p className="text-muted-foreground mt-1">Choose what to study today</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
          <p className="text-muted-foreground mt-1">Choose what to study today</p>
        </motion.div>

        {/* Splash Card Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl">🎴</span> Splash Cards
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">No card categories available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => {
                const progress = getCategoryProgress(category.id);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                  >
                    <Link to={`/learn/cards/${category.id}`}>
                      <div className="card-interactive p-4 relative overflow-hidden">
                        <div className="relative">
                          <span className="text-3xl block mb-2">{category.icon || '📚'}</span>
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description || ''}</p>
                          {progress > 0 && (
                            <div className="mt-2">
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Lessons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Lessons
            </h2>
          </div>

          {lessons.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">No lessons available yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const status = getLessonStatus(lesson.id);
                const isCompleted = status === 'completed';
                const category = categories.find(c => c.id === lesson.category_id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <Link to={`/learn/lesson/${lesson.id}`}>
                      <div className={`card-interactive p-4 flex items-center gap-4 ${isCompleted ? 'opacity-60' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl">{category?.icon || '📚'}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.estimated_minutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {lesson.xp_reward} XP
                            </span>
                          </div>
                        </div>
                        {isCompleted ? (
                          <span className="text-success text-xl">✓</span>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/LearnPage.tsx
git commit -m "fix: wire LearnPage to real Supabase data (BUG 3)"
```

---

### Task 5: Wire SplashCardsPage to real data

**Files:**
- Modify: `src/pages/SplashCardsPage.tsx`

- [ ] **Step 1: Rewrite SplashCardsPage to use hooks**

Replace entire file:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SplashCardsPage.tsx
git commit -m "fix: wire SplashCardsPage to real Supabase cards (BUG 4)"
```

---

### Task 6: Wire PracticePage to real data + persist XP

**Files:**
- Modify: `src/pages/PracticePage.tsx`

- [ ] **Step 1: Update PracticePage to use hooks**

At the top of the file, replace the imports and quiz generation:

Replace:
```tsx
import { greetingCards } from '@/data/sampleData';
```
with:
```tsx
import { useCards } from '@/hooks/useCards';
import { useProfile } from '@/hooks/useProfile';
```

Replace the `generateQuestions` function and the beginning of `PracticePage`:

```tsx
export default function PracticePage() {
  const { cards, loading: cardsLoading } = useCards();
  const { addXP, dailyGoals, profile, getLevel } = useProfile();
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  const generateQuestions = (): QuizQuestion[] => {
    const available = cards.length > 0 ? cards : [];
    if (available.length < 4) return [];

    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, 5);

    return shuffled.map((card) => {
      const wrongOptions = available
        .filter(c => c.id !== card.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.english_translation);

      const options = [...wrongOptions, card.english_translation].sort(() => Math.random() - 0.5);

      return {
        id: card.id,
        type: 'multiple-choice' as QuizType,
        indonesian: card.indonesian_text,
        english: card.english_translation,
        options,
        correctAnswer: card.english_translation,
      };
    });
  };

  const startQuiz = () => {
    const q = generateQuestions();
    if (q.length === 0) return;
    setQuestions(q);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };
```

In the `handleAnswer` function, add the XP call after updating the score:
```tsx
  const handleAnswer = async (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      await addXP(10, 'quiz_correct', 'Correct quiz answer');
    } else {
      setStreak(0);
    }
  };
```

In the stats section (the `!quizStarted` render), replace the hardcoded stats with real data:
```tsx
          {[
              { icon: Zap, label: 'Today', value: `${dailyGoals?.xp_earned || 0} XP`, color: 'text-xp' },
              { icon: Trophy, label: 'Level', value: `${getLevel()}`, color: 'text-accent' },
              { icon: Target, label: 'Cards', value: `${cards.length}`, color: 'text-primary' },
            ].map((stat, i) => (
```

Add a loading check at the top of the component return:
```tsx
  if (cardsLoading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
```

Add `Loader2` to the lucide-react import.

- [ ] **Step 2: Commit**

```bash
git add src/pages/PracticePage.tsx
git commit -m "fix: wire PracticePage to real data + persist XP (BUG 6)"
```

---

### Task 7: Wire ProfilePage to real data

**Files:**
- Modify: `src/pages/ProfilePage.tsx`

- [ ] **Step 1: Rewrite ProfilePage to use hooks**

Replace the `sampleUser` import and hardcoded stats:

Replace:
```tsx
import { sampleUser } from '@/data/sampleData';
```
with:
```tsx
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
```

Replace the component body to read from hooks:

```tsx
export default function ProfilePage() {
  const { signOut } = useAuth();
  const {
    profile,
    achievements,
    earnedAchievements,
    loading,
    getLevel,
    getXPProgress,
    getXPToNextLevel,
    levelTitle,
  } = useProfile();

  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
  });

  const displayName = profile?.display_name || 'Learner';
  const level = getLevel();
  const xp = profile?.xp_total || 0;
  const xpToNext = getXPToNextLevel();
  const levelProgress = getXPProgress();

  if (loading) {
    return (
      <div className="min-h-screen p-4 pt-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="card-elevated p-6 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted" />
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-32 mb-2" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
```

Then update the stats array:
```tsx
  const stats = [
    { icon: Flame, label: 'Day Streak', value: profile?.current_streak || 0, color: 'text-streak' },
    { icon: BookOpen, label: 'Level', value: level, color: 'text-primary' },
    { icon: MessageCircle, label: 'Title', value: levelTitle, color: 'text-success' },
    { icon: Trophy, label: 'XP Total', value: xp, color: 'text-xp' },
  ];
```

Replace `sampleUser.name` with `displayName`, `sampleUser.level` with `level`, `sampleUser.xp` with `xp`, `sampleUser.xpToNextLevel` with `xpToNext`, and the avatar img tag with:
```tsx
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {displayName[0]?.toUpperCase() || '?'}
              </div>
```

Replace the achievements count header:
```tsx
// Old:
{sampleUser.achievements.filter(a => a.earned).length}/{sampleUser.achievements.length}
// New:
{earnedAchievements.length}/{achievements.length}
```

Replace the achievements grid to use real data:
```tsx
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement, index) => {
              const isEarned = earnedAchievements.some(e => e.achievement_id === achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  className={`achievement-badge ${isEarned ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'} text-xl cursor-pointer`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  {achievement.icon}
                </motion.div>
              );
            })}
          </div>
```

Wire the logout button:
```tsx
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => signOut()}
          className="w-full card-elevated p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </motion.button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ProfilePage.tsx
git commit -m "fix: wire ProfilePage to real profile data (BUG 6)"
```

---

## Chunk 3: Chat Seed Data & Final Verification (BUG 5)

### Task 8: Seed chat rooms in the database

**Files:**
- Create: `supabase/migrations/20260315000003_seed_chat_rooms.sql`

- [ ] **Step 1: Create seed migration**

```sql
-- Seed initial chat rooms for community feature
-- Only inserts if no rooms exist yet (idempotent)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM chat_rooms LIMIT 1) THEN
    INSERT INTO chat_rooms (name, description, icon, level_requirement, is_active) VALUES
      ('Beginners Lounge', 'Perfect for A1-A2 learners', '🌱', 'beginner', true),
      ('Intermediate Discussion', 'For B1-B2 level conversations', '📖', 'intermediate', true),
      ('Advanced Conversations', 'Fluent speakers welcome', '🎓', 'advanced', true),
      ('Food & Recipes', 'Discuss Indonesian cuisine', '🍜', 'beginner', true),
      ('Travel Tips', 'Share travel experiences', '✈️', 'beginner', true),
      ('Culture & Traditions', 'Learn about Indonesian culture', '🎭', 'beginner', true);
  END IF;
END $$;
```

- [ ] **Step 2: Apply to live database**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && supabase db push`

Or manually paste the SQL into Supabase Dashboard → SQL Editor if CLI is not available.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260315000003_seed_chat_rooms.sql
git commit -m "fix: seed chat rooms for community feature (BUG 5)"
```

---

### Task 9: Final build + test verification

- [ ] **Step 1: Run TypeScript check**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run existing tests**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && npm run test`
Expected: All 11 existing tests pass

- [ ] **Step 3: Run production build**

Run: `cd "/Users/ej/Library/Mobile Documents/com~apple~CloudDocs/EKB Labs/02_Products/App Building Station/Bahasa Buddy" && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 5: Manual smoke test on live app**

Verify at `bahasabuddy.lovable.app`:
1. Sidebar shows real user data (not "Anya, Level 5, 450 XP")
2. `/learn/lesson/[id]` routes load the lesson page (no 404)
3. Learn page loads categories from Supabase
4. Flashcards show real card data from the database
5. Chat rooms list populates with seeded rooms
6. XP updates in sidebar after completing quiz questions
7. Auth page works at `/auth`
