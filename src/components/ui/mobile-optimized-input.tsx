
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function MobileOptimizedInput({
  label,
  error,
  helpText,
  icon,
  wrapperClassName,
  className,
  ...props
}: MobileOptimizedInputProps) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <Label 
        htmlFor={props.id} 
        className="text-sm font-medium text-foreground block"
      >
        {label}
      </Label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <Input
          {...props}
          className={cn(
            // Mobile-optimized sizing
            "h-12 md:h-10 text-base md:text-sm",
            // Better touch targets
            "touch-manipulation",
            // Prevent zoom on iOS
            "text-[16px] md:text-sm",
            // Icon spacing
            icon && "pl-10",
            // Error styling
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
