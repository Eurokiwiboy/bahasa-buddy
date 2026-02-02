import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
