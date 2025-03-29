import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, Award, ArrowRight, TrendingDown, BadgeDollarSign, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { Loan } from '@/utils/loanCalculations';
import { DebtItem, PrioritizationMethod, RepaymentPlan } from '@/utils/repayment/types';
import { combineDebts } from '@/utils/repayment/debtConverters';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

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
  
  // Calculate total minimum payments
  const totalMinPayments = useMemo(() => combinedDebts.reduce((sum, debt) => {
    if (debt.type === 'loan') {
      const loanDebt = activeLoans.find(loan => loan.id === debt.id);
      return sum + (loanDebt ? loanDebt.minPayment || 0 : 0);
    } else {
      const cardDebt = activeCards.find(card => card.id === debt.id);
      return sum + (cardDebt ? Math.max(cardDebt.minPayment, cardDebt.balance * (cardDebt.minPaymentPercent / 100)) : 0);
    }
  }, 0), [combinedDebts, activeLoans, activeCards]);
  
  // State for payment slider (start at monthly budget or minimum payments, whichever is higher)
  const [paymentAmount, setPaymentAmount] = useState(Math.max(monthlyBudget, totalMinPayments));
  
  // State for selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState<'equal' | 'avalanche' | 'snowball'>('avalanche');
  
  // Calculate plans with different strategies
  const avalanchePlan = useMemo(() => 
    generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche'),
    [combinedDebts, paymentAmount]
  );
  
  const snowballPlan = useMemo(() => 
    generateRepaymentPlan(combinedDebts, paymentAmount, 'snowball'),
    [combinedDebts, paymentAmount]
  );
  
  // Calculate equal distribution plan (custom strategy)
  const equalPlan = useMemo(() => {
    // This would be a custom implementation that distributes extra payments equally
    // For now, we'll use the same function but with a different strategy identifier
    // In a full implementation, you would create a custom distribution algorithm
    return generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche');
  }, [combinedDebts, paymentAmount]);
  
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
    equalTotalMonths: equalPlan.totalMonths,
    paymentAmount,
    totalMinPayments,
    totalDebts: combinedDebts.length
  });
  
  const avalancheDate = getDateAfterMonths(avalanchePlan.totalMonths);
  const snowballDate = getDateAfterMonths(snowballPlan.totalMonths);
  const equalDate = getDateAfterMonths(equalPlan.totalMonths);
  
  // Determine fastest method
  const strategies = [
    { id: 'avalanche', name: t('repayment.avalancheStrategy'), months: avalanchePlan.totalMonths, interest: avalanchePlan.totalInterestPaid, date: avalancheDate },
    { id: 'snowball', name: t('repayment.snowballStrategy'), months: snowballPlan.totalMonths, interest: snowballPlan.totalInterestPaid, date: snowballDate },
    { id: 'equal', name: t('dashboard.equalDistribution'), months: equalPlan.totalMonths, interest: equalPlan.totalInterestPaid, date: equalDate }
  ];
  
  // Sort strategies by months (ascending) and then by interest (ascending)
  const sortedStrategies = [...strategies].sort((a, b) => {
    if (a.months === b.months) {
      return a.interest - b.interest;
    }
    return a.months - b.months;
  });
  
  const recommendedStrategy = sortedStrategies[0];
  
  // Prepare timeline data for the selected strategy
  const getSelectedPlan = () => {
    switch (selectedStrategy) {
      case 'avalanche': return avalanchePlan;
      case 'snowball': return snowballPlan;
      case 'equal': return equalPlan;
      default: return avalanchePlan;
    }
  };
  
  const timelineData = useMemo(() => {
    const plan = getSelectedPlan();
    return plan.timeline.map((month, index) => ({
      month: index + 1,
      balance: month.totalRemaining,
      totalInterest: month.totalInterestPaid
    }));
  }, [selectedStrategy, avalanchePlan, snowballPlan, equalPlan]);
  
  // Calculate minimum payments for debts
  const getStrategyCardClass = (strategyId: string) => {
    if (strategyId === selectedStrategy) {
      return 'ring-2 ring-primary';
    }
    if (strategyId === recommendedStrategy.id) {
      return 'bg-primary/5';
    }
    return '';
  };
  
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
        <div className="space-y-6">
          {/* Minimum payments and current amount */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t('repayment.minimumPayments')}:</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMinPayments)}/{t('form.months')}</p>
            </div>
            <div>
              <p className="text-sm font-medium">{t('dashboard.currentPaymentAmount')}:</p>
              <p className="text-2xl font-bold">{formatCurrency(paymentAmount)}/{t('form.months')}</p>
            </div>
          </div>
          
          {/* Payment amount slider */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {t('dashboard.monthlyPaymentAmount')}
            </label>
            <Slider
              value={[paymentAmount]}
              min={totalMinPayments}
              max={Math.max(totalMinPayments * 3, monthlyBudget * 2)}
              step={10}
              onValueChange={(value) => setPaymentAmount(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.minimum')}: {formatCurrency(totalMinPayments)}</span>
              <span>{t('dashboard.maximum')}: {formatCurrency(Math.max(totalMinPayments * 3, monthlyBudget * 2))}</span>
            </div>
          </div>
          
          {/* Strategy recommendation */}
          {recommendedStrategy && (
            <div className="bg-primary/5 p-4 rounded-md">
              <p className="font-medium mb-1">{t('dashboard.recommendedStrategy')}:</p>
              <p className="text-lg font-bold flex items-center">
                {recommendedStrategy.name}
                <Badge className="ml-2 bg-primary" variant="secondary">
                  {t('dashboard.recommendation')}
                </Badge>
              </p>
              <p className="text-sm mt-1">
                {t('repayment.debtFreeIn')} {recommendedStrategy.months} {t('repayment.months')}, 
                {' '}{t('repayment.totalInterestPaid')}: {formatCurrency(recommendedStrategy.interest)}
              </p>
            </div>
          )}
          
          {/* Strategy tabs */}
          <Tabs defaultValue="avalanche" value={selectedStrategy} onValueChange={(value) => setSelectedStrategy(value as any)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="equal">{t('dashboard.equalStrategy')}</TabsTrigger>
              <TabsTrigger value="snowball">{t('dashboard.snowballStrategy')}</TabsTrigger>
              <TabsTrigger value="avalanche">{t('dashboard.avalancheStrategy')}</TabsTrigger>
            </TabsList>
            
            {/* Strategy comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {strategies.map((strategy) => (
                <Card 
                  key={strategy.id} 
                  className={`cursor-pointer ${getStrategyCardClass(strategy.id)}`}
                  onClick={() => setSelectedStrategy(strategy.id as any)}
                >
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{strategy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="flex justify-between">
                      <span className="text-sm">{t('repayment.debtFreeIn')}:</span>
                      <span className="font-medium">{strategy.months} {t('form.months')}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-sm">{t('repayment.totalInterestPaid')}:</span>
                      <span className="font-medium">{formatCurrency(strategy.interest)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-sm">{t('repayment.projectDate')}:</span>
                      <span className="font-medium">{strategy.date}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
          
          {/* Timeline chart */}
          {timelineData.length > 0 && (
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                    label={{ value: `${t('repayment.balance')}`, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)} 
                    labelFormatter={(value) => `${t('repayment.month')} ${value}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name={t('repayment.balance')}
                    stroke="#3b82f6" 
                    dot={false} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalInterest" 
                    name={t('repayment.totalInterestPaid')}
                    stroke="#ef4444" 
                    dot={false} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
            
            <div className="relative pl-8 pb-6">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Clock className="h-3 w-3 text-primary-foreground" />
              </div>
              <h4 className="font-medium">{t('dashboard.now')}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
            </div>
            
            {activeCards.length > 0 && getSelectedPlan().timeline.length > 0 && (
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <CreditCard className="h-3 w-3" />
                </div>
                <h4 className="font-medium">{t('repayment.creditCardsFree')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('repayment.projectDate')}: {getDateAfterMonths(getSelectedPlan().creditCardFreeMonth || 0)}
                </p>
              </div>
            )}
            
            <div className="relative pl-8">
              <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="h-3 w-3 text-white" />
              </div>
              <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('repayment.projectDate')}: {getDateAfterMonths(getSelectedPlan().totalMonths)}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {t('repayment.totalInterestPaid')}: {formatCurrency(getSelectedPlan().totalInterestPaid)}
              </p>
            </div>
          </div>
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
