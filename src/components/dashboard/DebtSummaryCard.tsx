
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedNumber from '@/components/AnimatedNumber';
import { CalendarClock, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';

interface DebtSummaryCardProps {
  totalDebt: number;
  debtFreeDate: string;
  totalMinPayments: number;
  totalAmountToPay: number;
}

const DebtSummaryCard = ({ 
  totalDebt, 
  debtFreeDate, 
  totalMinPayments,
  totalAmountToPay
}: DebtSummaryCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-gradient-to-br from-muted/50 to-background border shadow-md">
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalDebt')}</h3>
            <div className="text-2xl font-bold">
              <AnimatedNumber
                value={totalDebt}
                formatter={formatCurrency}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.debtFreeDate')}</h3>
            <div className="text-2xl font-bold flex items-center">
              <CalendarClock className="mr-2 h-5 w-5 text-primary" />
              {debtFreeDate}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalMonthlyPayment')}</h3>
            <div className="text-2xl font-bold">
              <AnimatedNumber
                value={totalMinPayments}
                formatter={formatCurrency}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t('results.totalPaid')}</h3>
            <div className="text-2xl font-bold flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              <AnimatedNumber
                value={totalAmountToPay}
                formatter={formatCurrency}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtSummaryCard;
