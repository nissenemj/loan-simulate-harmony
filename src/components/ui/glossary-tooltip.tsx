
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  children,
  className
}) => {
  const { t } = useLanguage();
  
  // Get the glossary definition
  const definition = t(`guidance.glossary.${term}`);
  
  if (!definition || definition === `guidance.glossary.${term}`) {
    // If no translation found, just return the children without tooltip
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <span className={`inline-flex items-center gap-1 cursor-help underline decoration-dotted ${className}`}>
              {term}
              <HelpCircle className="h-3 w-3" />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GlossaryTooltip;
