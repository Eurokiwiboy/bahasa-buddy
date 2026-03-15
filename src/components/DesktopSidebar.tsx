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
