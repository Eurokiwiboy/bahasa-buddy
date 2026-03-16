import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-20 h-20 text-3xl',
};

export function UserAvatar({ avatarUrl, displayName, size = 'sm', className }: UserAvatarProps) {
  const initial = displayName?.[0]?.toUpperCase() || '?';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold',
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
