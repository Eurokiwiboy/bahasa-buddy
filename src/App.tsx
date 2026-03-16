import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LearnPage from "@/pages/LearnPage";
import SplashCardsPage from "@/pages/SplashCardsPage";
import PracticePage from "@/pages/PracticePage";
import CommunityPage from "@/pages/CommunityPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import LessonPage from "@/pages/LessonPage";
import OnboardingPage from "@/pages/OnboardingPage";
import { AuthGuard } from "@/components/AuthGuard";
import { ClaudeControlPanel } from "@/components/ClaudeControlPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
            <Route path="/learn" element={<AuthGuard><LearnPage /></AuthGuard>} />
            <Route path="/learn/cards/:categoryId" element={<AuthGuard><SplashCardsPage /></AuthGuard>} />
            <Route path="/learn/lesson/:lessonId" element={<AuthGuard><LessonPage /></AuthGuard>} />
            <Route path="/practice" element={<AuthGuard><PracticePage /></AuthGuard>} />
            <Route path="/community" element={<AuthGuard><CommunityPage /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <ClaudeControlPanel />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
