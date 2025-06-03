
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExtraPaymentImpactProps {
  extraAmount: number;
  timeSaved?: number;
  interestSaved?: number;
  className?: string;
}

const ExtraPaymentImpact: React.FC<ExtraPaymentImpactProps> = ({
  extraAmount,
  timeSaved = 0,
  interestSaved = 0,
  className
}) => {
  const { t } = useLanguage();
  
  if (extraAmount <= 0) return null;
  
  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {t('guidance.extraPaymentImpact.adding')} €{extraAmount} {t('guidance.extraPaymentImpact.extraPerMonth')}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {timeSaved > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{timeSaved} {t('guidance.extraPaymentImpact.monthsAnd')}</p>
                <p className="text-xs text-muted-foreground">aikaa säästöä</p>
              </div>
            </div>
          )}
          
          {interestSaved > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">€{interestSaved.toLocaleString()} {t('guidance.extraPaymentImpact.inInterest')}</p>
                <p className="text-xs text-muted-foreground">korko säästöä</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtraPaymentImpact;
