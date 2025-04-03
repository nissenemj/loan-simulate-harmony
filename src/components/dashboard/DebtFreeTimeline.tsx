
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/loanCalculations';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCard[];
  activeLoans: Loan[];
  monthlyBudget: number;
}

const DebtFreeTimeline = ({
  totalDebt,
  formattedDebtFreeDate,
  activeCards,
  activeLoans,
  monthlyBudget
}: DebtFreeTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const hasDebts = totalDebt > 0 || activeCards.length > 0 || activeLoans.length > 0;
  
  const hasValidDate = formattedDebtFreeDate && formattedDebtFreeDate !== "Invalid Date";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          {t('dashboard.debtFreeTimeline')}
        </CardTitle>
        <CardDescription>{t('dashboard.timelineDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasDebts ? (
          <div className="relative pt-4">
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
            
            <div className="relative mb-12">
              <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-primary"></div>
              <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                <h4 className="font-medium">{t('dashboard.now')}</h4>
                <p className="text-sm text-muted-foreground">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
              </div>
            </div>
            
            {activeCards.length > 0 && (
              <div className="relative mb-12">
                <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-primary/70"></div>
                <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                  <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.projectDate')}: {hasValidDate ? formattedDebtFreeDate : t('debtStrategies.errorMaxMonths')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 -mt-8 w-4 h-4 rounded-full bg-green-600"></div>
              <div className="ml-[calc(50%+1.5rem)] pl-4 -mt-1">
                <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.projectDate')}: {hasValidDate ? formattedDebtFreeDate : t('debtStrategies.errorMaxMonths')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">{t('noDebtToDisplay')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {t('dashboard.timelineExplanation')}. {t('dashboard.paymentFlowExplanation')}.
        </div>
        <Button variant="outline" onClick={() => navigate('/debt-summary?tab=repayment-plan')}>
          {t('dashboard.goToRepaymentPlan')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DebtFreeTimeline;
