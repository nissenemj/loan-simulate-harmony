
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrencyFormatter } from '@/utils/formatting';

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
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium">{t('dashboard.whatIfAnalysis')}</h3>
      
      <div className="space-y-2">
        <Label>{t('dashboard.extraMonthlyPayment')}</Label>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExtraPayment(Math.max(0, extraPayment - 50))}
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
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>{t('dashboard.interestRateChange')}</Label>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInterestChange(Math.max(-5, interestChange - 0.25))}
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
          >
            +
          </Button>
        </div>
      </div>
      
      <Button onClick={handleApply} className="w-full">
        {t('dashboard.applyChanges')}
      </Button>
    </div>
  );
};
