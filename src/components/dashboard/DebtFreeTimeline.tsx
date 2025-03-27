
import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Award, ArrowRight, TrendingDown, BadgeDollarSign, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { Loan } from '@/utils/loanCalculations';
import { DebtItem, PrioritizationMethod, RepaymentPlan } from '@/utils/repayment/types';
import { combineDebts } from '@/utils/repayment/debtConverters';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCardType[];
  activeLoans?: Loan[];
  monthlyBudget?: number;
}

const DebtFreeTimeline = ({ 
  totalDebt, 
  formattedDebtFreeDate, 
  activeCards, 
  activeLoans = [], 
  monthlyBudget = 1500 
}: DebtFreeTimelineProps) => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  
  // Generate repayment plans using both strategies
  const combinedDebts = useMemo(() => combineDebts(activeLoans, activeCards), [activeLoans, activeCards]);
  
  const avalanchePlan = useMemo(() => 
    generateRepaymentPlan(combinedDebts, monthlyBudget, 'avalanche'),
    [combinedDebts, monthlyBudget]
  );
  
  const snowballPlan = useMemo(() => 
    generateRepaymentPlan(combinedDebts, monthlyBudget, 'snowball'),
    [combinedDebts, monthlyBudget]
  );
  
  // Get debt-free dates for each strategy with proper future dates
  const now = new Date();
  
  const getDateAfterMonths = (months: number) => {
    if (months <= 0) return '';
    
    const date = new Date(now);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString(locale);
  };
  
  // Debug logs to verify timeline calculations
  console.log('DebtFreeTimeline calculations:', {
    avalancheTotalMonths: avalanchePlan.totalMonths,
    snowballTotalMonths: snowballPlan.totalMonths,
    avalancheViable: avalanchePlan.isViable,
    snowballViable: snowballPlan.isViable,
    now: now.toISOString(),
    locale,
    activeDebts: combinedDebts.length
  });
  
  const avalancheDate = getDateAfterMonths(avalanchePlan.totalMonths);
  const snowballDate = getDateAfterMonths(snowballPlan.totalMonths);
  
  // Determine fastest method
  const fastestMethod = avalanchePlan.totalMonths <= snowballPlan.totalMonths ? 'avalanche' : 'snowball';
  const fastestDate = fastestMethod === 'avalanche' ? avalancheDate : snowballDate;
  
  // Calculate monthly difference between methods
  const monthsDifference = Math.abs(avalanchePlan.totalMonths - snowballPlan.totalMonths);
  
  // Calculate total interest savings
  const avalancheInterest = avalanchePlan.totalInterestPaid;
  const snowballInterest = snowballPlan.totalInterestPaid;
  const interestSavings = Math.abs(avalancheInterest - snowballInterest);
  
  // Get credit card free date (finding when all credit cards are paid)
  let creditCardFreeMonth = 0;
  
  const getDebtTypePayoffMonth = (debtType: 'credit-card' | 'loan', plan: RepaymentPlan) => {
    if (plan.timeline.length === 0) return 0;
    
    // Get all debt IDs of the specified type
    const debtIds = combinedDebts
      .filter(debt => debt.type === debtType)
      .map(debt => debt.id);
      
    if (debtIds.length === 0) return 0;
    
    // Find when all debts of this type are paid off
    for (let i = 0; i < plan.timeline.length; i++) {
      const month = plan.timeline[i];
      const allPaid = debtIds.every(id => {
        const debtInfo = month.debts.find(d => d.id === id);
        return !debtInfo || debtInfo.remainingBalance === 0;
      });
      
      if (allPaid) {
        return i + 1; // Add 1 because array is 0-indexed but months start at 1
      }
    }
    
    return 0;
  };
  
  // Find when all credit cards are paid off in the fastest method's plan
  const fastestPlan = fastestMethod === 'avalanche' ? avalanchePlan : snowballPlan;
  creditCardFreeMonth = getDebtTypePayoffMonth('credit-card', fastestPlan);
  const loanFreeMonth = getDebtTypePayoffMonth('loan', fastestPlan);
  
  const creditCardFreeDate = creditCardFreeMonth > 0 ? getDateAfterMonths(creditCardFreeMonth) : '';
  
  // If all debts are paid in one month, use a simpler display
  const singleMonthPayoff = avalanchePlan.totalMonths === 1 && snowballPlan.totalMonths === 1;
  
  // Calculate minimum payments for debts
  const totalMinPayments = combinedDebts.reduce((sum, debt) => {
    if (debt.type === 'loan') {
      const loanDebt = activeLoans.find(loan => loan.id === debt.id);
      return sum + (loanDebt ? loanDebt.monthlyPayment || 0 : 0);
    } else {
      const cardDebt = activeCards.find(card => card.id === debt.id);
      return sum + (cardDebt ? Math.max(cardDebt.minPayment, cardDebt.balance * (cardDebt.minPaymentPercent / 100)) : 0);
    }
  }, 0);
  
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
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
            
            <div className="relative pl-8 pb-6">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Clock className="h-3 w-3 text-primary-foreground" />
              </div>
              <h4 className="font-medium">{t('dashboard.now')}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
            </div>
            
            {activeCards.length > 0 && creditCardFreeDate && (
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <CreditCard className="h-3 w-3" />
                </div>
                <h4 className="font-medium">{t('repayment.creditCardsFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.projectDate')}: {creditCardFreeDate}
                </p>
                {creditCardFreeMonth > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('repayment.monthsUntilCreditCardFree', { months: creditCardFreeMonth })}
                  </p>
                )}
              </div>
            )}
            
            {!singleMonthPayoff && avalanchePlan.isViable && (
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-medium">{t('repayment.avalancheStrategy')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.debtFreeIn')} {avalanchePlan.totalMonths} {t('repayment.months')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('repayment.projectDate')}: {avalancheDate}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('repayment.totalInterestPaid')}: {formatCurrency(avalancheInterest)}
                </p>
              </div>
            )}
            
            {!singleMonthPayoff && snowballPlan.isViable && (
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <BadgeDollarSign className="h-3 w-3 text-white" />
                </div>
                <h4 className="font-medium">{t('repayment.snowballStrategy')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.debtFreeIn')} {snowballPlan.totalMonths} {t('repayment.months')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('repayment.projectDate')}: {snowballDate}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('repayment.totalInterestPaid')}: {formatCurrency(snowballInterest)}
                </p>
                {monthsDifference > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {fastestMethod === 'snowball' 
                      ? t('repayment.monthsFaster', { months: monthsDifference }) 
                      : t('repayment.monthsSlower', { months: monthsDifference })}
                  </p>
                )}
              </div>
            )}
            
            <div className="relative pl-8">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
              <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('repayment.projectDate')}: {fastestDate}
              </p>
              {!singleMonthPayoff && (
                <p className="text-xs text-muted-foreground">
                  {fastestMethod === 'avalanche' ? 
                    t('repayment.fastestWithAvalanche') : 
                    t('repayment.fastestWithSnowball')}
                </p>
              )}
              {interestSavings > 0 && (
                <p className="text-xs font-medium text-green-600 mt-1">
                  {t('repayment.interestSaved')}: {formatCurrency(interestSavings)}
                </p>
              )}
            </div>
          </div>
          
          {/* Minimum payments timeline */}
          {totalMinPayments > 0 && (
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {t('repayment.minimumPayments')}: {formatCurrency(totalMinPayments)}/kk
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch sm:flex-row sm:items-center">
        <Button variant="outline" onClick={() => navigate('/debt-summary')}>
          {t('dashboard.viewDetailedTimeline')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          variant="default" 
          onClick={() => navigate('/debt-summary?tab=repayment')}
          className="flex items-center"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {t('dashboard.goToRepaymentPlan')}
        </Button>
      </CardFooter>
      <div className="px-6 pb-4 pt-0 text-sm text-muted-foreground">
        <p>
          {t('repayment.timelineExplanation')}. {t('repayment.avalancheDesc')} {t('repayment.snowballDesc')}.
        </p>
      </div>
    </Card>
  );
};

export default DebtFreeTimeline;
