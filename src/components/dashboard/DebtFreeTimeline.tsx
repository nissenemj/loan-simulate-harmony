
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Award, ArrowRight } from 'lucide-react';
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
  const combinedDebts = combineDebts(activeLoans, activeCards);
  
  const avalanchePlan = generateRepaymentPlan(combinedDebts, monthlyBudget, 'avalanche');
  const snowballPlan = generateRepaymentPlan(combinedDebts, monthlyBudget, 'snowball');
  
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
    locale
  });
  
  const avalancheDate = getDateAfterMonths(avalanchePlan.totalMonths);
  const snowballDate = getDateAfterMonths(snowballPlan.totalMonths);
  
  // Determine fastest method
  const fastestMethod = avalanchePlan.totalMonths <= snowballPlan.totalMonths ? 'avalanche' : 'snowball';
  const fastestDate = fastestMethod === 'avalanche' ? avalancheDate : snowballDate;
  
  // Calculate different dates to ensure they're not all the same
  const getFutureDate = (addMonths: number) => {
    const date = new Date(now);
    date.setMonth(date.getMonth() + addMonths);
    return date.toLocaleDateString(locale);
  };
  
  // Get credit card free date (finding when all credit cards are paid)
  let creditCardFreeMonth = 0;
  
  if (activeCards.length > 0 && avalanchePlan.timeline.length > 0) {
    const cardIds = activeCards.map(card => card.id);
    
    for (let i = 0; i < avalanchePlan.timeline.length; i++) {
      const month = avalanchePlan.timeline[i];
      const allCardsPaid = cardIds.every(id => {
        const debtInfo = month.debts.find(d => d.id === id);
        return !debtInfo || debtInfo.remainingBalance === 0;
      });
      
      if (allCardsPaid) {
        creditCardFreeMonth = i + 1;
        break;
      }
    }
  }
  
  const creditCardFreeDate = creditCardFreeMonth > 0 ? getDateAfterMonths(creditCardFreeMonth) : '';
  
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
                <h4 className="font-medium">{t('dashboard.creditCardsFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.projectDate')}: {creditCardFreeDate}
                </p>
              </div>
            )}
            
            {avalanchePlan.isViable && snowballPlan.isViable && (
              <>
                <div className="relative pl-8 pb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-medium">{t('repayment.avalancheStrategy')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('repayment.debtFreeIn')} {avalanchePlan.totalMonths} {t('repayment.months')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('repayment.projectDate')}: {avalancheDate}
                  </p>
                </div>
                
                <div className="relative pl-8 pb-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-medium">{t('repayment.snowballStrategy')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('repayment.debtFreeIn')} {snowballPlan.totalMonths} {t('repayment.months')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('repayment.projectDate')}: {snowballDate}
                  </p>
                </div>
              </>
            )}
            
            <div className="relative pl-8">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
              <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('repayment.projectDate')}: {fastestDate}
                {fastestMethod === 'avalanche' ? 
                  ` (${t('repayment.avalancheStrategy')})` : 
                  ` (${t('repayment.snowballStrategy')})`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate('/debt-summary')}>
          {t('dashboard.viewDetailedTimeline')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DebtFreeTimeline;
