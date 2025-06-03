
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
  className?: string;
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  definition,
  children,
  className
}) => {
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
        <TooltipContent className="max-w-xs bg-white border shadow-lg">
          <p className="text-sm text-gray-900">{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GlossaryTooltip;
