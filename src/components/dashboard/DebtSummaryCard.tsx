
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/utils/loanCalculations';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CalculationTooltip } from './CalculationExplanations';

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
  const navigate = useNavigate();
  
  // Format currency values
  const formattedTotalDebt = formatCurrency(totalDebt);
  const formattedMinPayments = formatCurrency(totalMinPayments);
  const formattedTotalPay = formatCurrency(totalAmountToPay);
  
  // Calculate interest cost
  const interestCost = totalAmountToPay - totalDebt;
  const formattedInterestCost = formatCurrency(interestCost);
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground font-medium">{t('dashboard.totalDebt')}</span>
              <CalculationTooltip 
                content={t('tooltips.totalDebt') || 'Sum of all active loan amounts and credit card balances.'}
              />
            </div>
            <span className="text-3xl font-bold mt-2">{formattedTotalDebt}</span>
            <div className="flex mt-2 items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('dashboard.estimatedInterestCost')}:</span>
              <span className="text-sm font-medium">{formattedInterestCost}</span>
              <CalculationTooltip 
                content={t('tooltips.interestCost') || 'Total estimated interest you will pay over the life of all your debts at current rates and payments.'}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground font-medium">{t('dashboard.estimatedDebtFreeDate')}</span>
              <CalculationTooltip 
                content={t('tooltips.debtFreeDate') || 'Estimated date when all your debts will be paid off based on current payment amounts.'}
              />
            </div>
            <span className="text-3xl font-bold mt-2">{debtFreeDate}</span>
            <div className="flex mt-2 items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('dashboard.totalToPayOff')}:</span>
              <span className="text-sm font-medium">{formattedTotalPay}</span>
              <CalculationTooltip 
                content={t('tooltips.totalToPayOff') || 'Total amount including principal and interest that you will pay over the life of all your debts.'}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground font-medium">{t('dashboard.minimumMonthlyPayments')}</span>
              <CalculationTooltip 
                content={t('tooltips.minimumPayments') || 'Combined minimum payments required for all your loans and credit cards.'}
              />
            </div>
            <span className="text-3xl font-bold mt-2">{formattedMinPayments}</span>
            <div className="flex mt-2 items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('dashboard.perMonth')}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pb-6 px-6 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate('/debt-summary')}
        >
          {t('dashboard.viewDetailedBreakdown')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DebtSummaryCard;
