import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Dumbbell, Users, User, Flame } from 'lucide-react';
import { sampleUser } from '@/data/sampleData';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Dumbbell },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const location = useLocation();

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
      <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-streak/10 to-primary/10">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-streak animate-fire" />
          <span className="font-semibold text-foreground">{sampleUser.streak} Day Streak!</span>
        </div>
      </div>

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
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <img
            src={sampleUser.avatar}
            alt={sampleUser.name}
            className="w-10 h-10 rounded-full bg-muted"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{sampleUser.name}</p>
            <p className="text-xs text-muted-foreground">Level {sampleUser.level} • {sampleUser.levelTitle}</p>
          </div>
          <div className="xp-badge text-xs">
            {sampleUser.xp} XP
          </div>
        </div>
      </div>
    </aside>
  );
}
