'use client';

import { getInitials } from '@/lib/utils';

interface BuyerAvatarProps {
  name: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BuyerAvatar({ name, image, size = 'md', className = '' }: BuyerAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  if (image) {
    return (
      <img
        src={image}
        alt={`${name} avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full avatar-placeholder ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}