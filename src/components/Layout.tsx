import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/login' || location.pathname === '/onboarding';
  const showChrome = isAuthenticated && !isAuthPage;

  return (
    <div className="min-h-screen bg-background">
      {showChrome && <DesktopSidebar />}
      <main className={showChrome ? 'lg:pl-64 pb-20 lg:pb-0' : ''}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
