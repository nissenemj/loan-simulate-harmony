
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCurrencyFormatter } from '@/utils/formatting';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface WhatIfAnalysisProps {
  onApply: (changes: { extraPayment: number; interestChange: number }) => void;
}

export const WhatIfAnalysis: React.FC<WhatIfAnalysisProps> = ({ onApply }) => {
  const currencyFormatter = useCurrencyFormatter();
  const [extraPayment, setExtraPayment] = useState(100);
  const [interestChange, setInterestChange] = useState(0);
  
  const handleApply = () => {
    onApply({
      extraPayment,
      interestChange
    });
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md mt-4">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">Entä jos -analyysi</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>Kokeile erilaisia skenaarioita nähdäksesi, miten ne vaikuttavat velkojen maksuaikaan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="extra-payment" className="flex items-center">
            Ylimääräinen kuukausimaksu
            <HelpTooltip content="Ylimääräinen summa, jonka voit maksaa kuukausittain" />
          </Label>
          <span className="text-sm font-medium">{currencyFormatter.format(extraPayment)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExtraPayment(Math.max(0, extraPayment - 50))}
            aria-label="Vähennä ylimääräistä maksua 50 eurolla"
          >
            -
          </Button>
          <div className="flex-1 text-center font-medium">
            {currencyFormatter.format(extraPayment)}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExtraPayment(extraPayment + 50)}
            aria-label="Lisää ylimääräistä maksua 50 eurolla"
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="interest-rate-change" className="flex items-center">
            Koron muutos
            <HelpTooltip content="Säädä korkotasoa nähdäksesi vaikutuksen velkojen maksuun" />
          </Label>
          <span className={`text-sm font-medium ${
            interestChange > 0 ? 'text-red-500' : 
            interestChange < 0 ? 'text-green-500' : ''
          }`}>
            {interestChange > 0 ? '+' : ''}{interestChange}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInterestChange(Math.max(-5, interestChange - 0.25))}
            aria-label="Vähennä korkoa 0.25 prosenttiyksiköllä"
          >
            -
          </Button>
          <div className="flex-1 text-center font-medium">
            {interestChange > 0 ? '+' : ''}{interestChange}%
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInterestChange(Math.min(5, interestChange + 0.25))}
            aria-label="Lisää korkoa 0.25 prosenttiyksiköllä"
          >
            +
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={handleApply} 
        className="w-full"
        aria-label={`Sovella muutokset: ${currencyFormatter.format(extraPayment)} ylimääräinen maksu ja ${interestChange}% koron muutos`}
      >
        Sovella muutokset
      </Button>
    </div>
  );
};
