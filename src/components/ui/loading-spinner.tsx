
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'calculator' | 'dots';
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className,
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-pulse",
                size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn("ml-3 text-muted-foreground", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'calculator') {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-3 p-6", className)}>
        <div className="relative">
          <Calculator className={cn("text-primary animate-pulse", sizeClasses[size])} />
          <div className="absolute -top-1 -right-1">
            <Loader2 className={cn("animate-spin text-primary/60", 
              size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
            )} />
          </div>
        </div>
        {text && (
          <p className={cn("text-center text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <span className={cn("ml-3 text-muted-foreground", textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
}
