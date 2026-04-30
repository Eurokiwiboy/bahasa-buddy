import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Dumbbell, Users, User, Flame, Moon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { UserAvatar } from '@/components/UserAvatar';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Dumbbell },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DesktopSidebar() {
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const { profile, loading, getLevel, levelTitle } = useProfile();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Learner';
  const streak = profile?.current_streak || 0;
  const xp = profile?.xp_total || 0;
  const level = getLevel();

  return (
    <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 bg-card/95 border-r border-border/70">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/70">
        <img
          src="/logo.png"
          alt="Bahasa Buddy"
          className="w-9 h-9 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-base text-foreground font-light leading-tight">
            Bahasa <span className="font-semibold text-primary">Buddy</span>
          </h1>
          <p className="text-xs text-muted-foreground italic tracking-wide">Learn Indonesian</p>
        </div>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-gradient-to-r from-streak/10 to-primary/10">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-streak animate-fire" />
            <span className="text-sm font-semibold text-foreground">{streak} Day Streak!</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-full"
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
      <div className="p-3 border-t border-border/70">
        {isAuthenticated && !loading ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-colors text-left cursor-pointer">
                <UserAvatar avatarUrl={profile?.avatar_url} displayName={displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground">Level {level} • {levelTitle}</p>
                </div>
                <div className="xp-badge text-[10px] px-2">
                  {xp} XP
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </div>
                <Switch checked={isDark} onCheckedChange={toggleTheme} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
