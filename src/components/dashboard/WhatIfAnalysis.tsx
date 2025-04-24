
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
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
        <h3 className="font-medium">{t('dashboard.whatIfAnalysis')}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>{t('scenarios.whatIfDescription') || 'Experiment with different scenarios to see how they affect your debt payoff timeline'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="extra-payment" className="flex items-center">
            {t('dashboard.extraMonthlyPayment')}
            <HelpTooltip content={t('scenarios.extraPaymentHelp') || 'Additional amount you can pay each month'} />
          </Label>
          <span className="text-sm font-medium">{currencyFormatter.format(extraPayment)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExtraPayment(Math.max(0, extraPayment - 50))}
            aria-label={`Decrease extra payment by 50`}
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
            aria-label={`Increase extra payment by 50`}
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="interest-rate-change" className="flex items-center">
            {t('dashboard.interestRateChange')}
            <HelpTooltip content={t('dashboard.interestRateChangeTooltip')} />
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
            aria-label={`Decrease interest rate by 0.25%`}
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
            aria-label={`Increase interest rate by 0.25%`}
          >
            +
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={handleApply} 
        className="w-full"
        aria-label={`Apply changes with ${currencyFormatter.format(extraPayment)} extra payment and ${interestChange}% interest rate change`}
      >
        {t('dashboard.applyChanges')}
      </Button>
    </div>
  );
};
