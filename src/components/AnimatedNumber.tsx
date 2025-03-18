
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
  delay?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  formatter = (val) => val.toString(),
  className,
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (value !== displayValue) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        
        // Use requestAnimationFrame to ensure smooth animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            setDisplayValue(value);
            setIsAnimating(false);
          }, 50); // Small delay to ensure animation triggers
        });
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [value, displayValue, delay]);
  
  return (
    <span className={cn(
      "inline-block transition-all duration-300 relative",
      isAnimating && "animate-number-change",
      className
    )}>
      {formatter(displayValue)}
    </span>
  );
};

export default AnimatedNumber;
