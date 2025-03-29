
import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, Award, ArrowRight, Calculator, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { Loan } from '@/utils/loanCalculations';
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
import { calculateEffectiveMinPayment } from '@/utils/creditCardCalculations';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCardType[];
  activeLoans?: Loan[];
  monthlyBudget?: number;
}

// Type definition for strategy results
interface StrategyResult {
  id: 'avalanche' | 'snowball' | 'equal';
  name: string;
  months: number;
  interest: number;
  date: string;
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
  
  // Generate combined debts from loans and credit cards
  const combinedDebts = useMemo(() => {
    const debts = combineDebts(activeLoans, activeCards);
    console.log('Combined debts:', debts);
    return debts;
  }, [activeLoans, activeCards]);
  
  // Calculate total minimum payments correctly for both loan and credit card debts
  const totalMinPayments = useMemo(() => {
    // For loans: Use the loan's minimum payment or calculate from monthly result
    const loanMinPayments = activeLoans.reduce((sum, loan) => {
      if (loan.minPayment && loan.minPayment > 0) {
        return sum + loan.minPayment;
      } else {
        // Calculate based on loan parameters (simplified calculation)
        const monthlyRate = loan.interestRate / 100 / 12;
        const totalMonths = loan.termYears * 12;
        let payment;
        
        if (loan.repaymentType === 'custom-payment' && loan.customPayment) {
          payment = loan.customPayment;
        } else {
          // Use annuity formula for standard loan types
          payment = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        
        // Add monthly fee if present
        if (loan.monthlyFee) {
          payment += loan.monthlyFee;
        }
        
        return sum + payment;
      }
    }, 0);
    
    // For credit cards: Calculate the effective minimum payment (greater of fixed amount or percentage)
    const cardMinPayments = activeCards.reduce((sum, card) => {
      const percentPayment = card.balance * (card.minPaymentPercent / 100);
      const minPayment = Math.max(card.minPayment, percentPayment);
      return sum + minPayment;
    }, 0);
    
    const total = loanMinPayments + cardMinPayments;
    console.log('Total minimum payments:', { loanMinPayments, cardMinPayments, total });
    
    return total;
  }, [activeLoans, activeCards]);
  
  // State for payment slider (start at monthly budget or minimum payments, whichever is higher)
  const [paymentAmount, setPaymentAmount] = useState(Math.max(monthlyBudget || 0, totalMinPayments || 0));
  
  // Update payment amount if minimum payments or budget changes
  useEffect(() => {
    const newAmount = Math.max(monthlyBudget || 0, totalMinPayments || 0);
    console.log('Updating payment amount:', { monthlyBudget, totalMinPayments, newAmount });
    setPaymentAmount(newAmount);
  }, [totalMinPayments, monthlyBudget]);
  
  // State for selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball' | 'equal'>('avalanche');
  
  // Calculate plans with different strategies only when dependencies change
  const avalanchePlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: false,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    const plan = generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche');
    console.log('Avalanche plan:', plan);
    return plan;
  }, [combinedDebts, paymentAmount]);
  
  const snowballPlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: false,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    const plan = generateRepaymentPlan(combinedDebts, paymentAmount, 'snowball');
    console.log('Snowball plan:', plan);
    return plan;
  }, [combinedDebts, paymentAmount]);
  
  // Calculate equal distribution plan (custom strategy)
  const equalPlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: false,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    const plan = generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche', true);
    console.log('Equal distribution plan:', plan);
    return plan;
  }, [combinedDebts, paymentAmount]);
  
  // Get debt-free dates for each strategy with proper future dates
  const now = new Date();
  
  const getDateAfterMonths = (months: number) => {
    if (months <= 0) return '';
    
    const date = new Date(now);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString(locale);
  };
  
  const avalancheDate = getDateAfterMonths(avalanchePlan.totalMonths);
  const snowballDate = getDateAfterMonths(snowballPlan.totalMonths);
  const equalDate = getDateAfterMonths(equalPlan.totalMonths);
  
  // Define strategy information
  const strategies: StrategyResult[] = useMemo(() => [
    { id: 'avalanche', name: t('repayment.avalancheStrategy'), months: avalanchePlan.totalMonths, interest: avalanchePlan.totalInterestPaid, date: avalancheDate },
    { id: 'snowball', name: t('repayment.snowballStrategy'), months: snowballPlan.totalMonths, interest: snowballPlan.totalInterestPaid, date: snowballDate },
    { id: 'equal', name: t('dashboard.equalDistribution'), months: equalPlan.totalMonths, interest: equalPlan.totalInterestPaid, date: equalDate }
  ], [t, avalanchePlan, snowballPlan, equalPlan, avalancheDate, snowballDate, equalDate]);
  
  // Sort strategies by months (ascending) and then by interest (ascending)
  const sortedStrategies = useMemo(() => [...strategies].sort((a, b) => {
    if (a.months === b.months) {
      return a.interest - b.interest;
    }
    return a.months - b.months;
  }), [strategies]);
  
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
    
    if (!plan.timeline || plan.timeline.length === 0) {
      return [];
    }
    
    // Simplify the timeline to include fewer data points for better chart rendering
    // Take one data point per quarter (every 3 months) plus the last point
    const simplifiedTimeline = [];
    
    for (let i = 0; i < plan.timeline.length; i++) {
      if (i % 3 === 0 || i === plan.timeline.length - 1) {
        simplifiedTimeline.push({
          month: i + 1,
          balance: plan.timeline[i].totalRemaining,
          totalInterest: plan.timeline[i].totalInterestPaid
        });
      }
    }
    
    return simplifiedTimeline;
  }, [selectedStrategy, avalanchePlan, snowballPlan, equalPlan]);
  
  // Helper function for strategy card styling
  const getStrategyCardClass = (strategyId: string) => {
    if (strategyId === selectedStrategy) {
      return 'ring-2 ring-primary';
    }
    if (strategyId === recommendedStrategy.id) {
      return 'bg-primary/5';
    }
    return '';
  };
  
  // Check if payment amount is valid (at least meet minimum payments)
  const isValidPayment = paymentAmount >= totalMinPayments;
  
  // Check if we have any debt to pay
  const hasDebt = totalDebt > 0;
  
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
          {!hasDebt ? (
            <div className="p-4 text-center">
              <p>{t('dashboard.noDebtToDisplay')}</p>
            </div>
          ) : (
            <>
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
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>{t('dashboard.monthlyPaymentAmount')}</span>
                  {!isValidPayment && (
                    <span className="text-destructive flex items-center text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t('repayment.minPaymentRequired')}
                    </span>
                  )}
                </label>
                <Slider
                  value={[paymentAmount]}
                  min={totalMinPayments > 0 ? totalMinPayments : 1}
                  max={Math.max(totalMinPayments * 3, monthlyBudget * 2)}
                  step={10}
                  onValueChange={(value) => setPaymentAmount(value[0])}
                  className={`w-full ${!isValidPayment ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('dashboard.minimum')}: {formatCurrency(totalMinPayments)}</span>
                  <span>{t('dashboard.maximum')}: {formatCurrency(Math.max(totalMinPayments * 3, monthlyBudget * 2))}</span>
                </div>
              </div>
              
              {/* Strategy recommendation */}
              {recommendedStrategy && isValidPayment && recommendedStrategy.months > 0 && (
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
              
              {/* Strategy cards */}
              {isValidPayment && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {strategies.map((strategy) => (
                    <Card 
                      key={strategy.id} 
                      className={`cursor-pointer transition-all hover:shadow ${getStrategyCardClass(strategy.id)}`}
                      onClick={() => setSelectedStrategy(strategy.id)}
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
              )}
              
              {/* Timeline chart */}
              {timelineData.length > 0 && isValidPayment && (
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
              
              {/* Timeline milestones */}
              {isValidPayment && getSelectedPlan().totalMonths > 0 && (
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                  
                  <div className="relative pl-8 pb-6">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Clock className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <h4 className="font-medium">{t('dashboard.now')}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
                  </div>
                  
                  {activeCards.length > 0 && getSelectedPlan().creditCardFreeMonth && (
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
              )}
            </>
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
