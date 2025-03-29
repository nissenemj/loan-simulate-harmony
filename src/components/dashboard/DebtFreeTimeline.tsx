
import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CreditCard, Award, ArrowRight, Calculator, AlertCircle, DollarSign, BadgePercent } from 'lucide-react';
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
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar
} from 'recharts';

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
  const combinedDebts = useMemo(() => 
    combineDebts(activeLoans, activeCards), 
    [activeLoans, activeCards]
  );
  
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
    
    return loanMinPayments + cardMinPayments;
  }, [activeLoans, activeCards]);
  
  // Ensure minimum payment is never less than 10 to avoid division by zero or negative values
  const safeMinPayment = Math.max(totalMinPayments, 10);
  
  // State for payment slider (start at monthly budget or minimum payments, whichever is higher)
  const [paymentAmount, setPaymentAmount] = useState(
    Math.max(monthlyBudget || 0, safeMinPayment)
  );
  
  // Update payment amount if minimum payments or budget changes
  useEffect(() => {
    const newAmount = Math.max(monthlyBudget || 0, safeMinPayment);
    setPaymentAmount(newAmount);
  }, [safeMinPayment, monthlyBudget]);
  
  // State for selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball' | 'equal'>('avalanche');
  
  // State for chart view mode
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  
  // Calculate plans with different strategies only when dependencies change
  const avalanchePlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: true,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    return generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche');
  }, [combinedDebts, paymentAmount]);
  
  const snowballPlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: true,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    return generateRepaymentPlan(combinedDebts, paymentAmount, 'snowball');
  }, [combinedDebts, paymentAmount]);
  
  // Calculate equal distribution plan (custom strategy)
  const equalPlan = useMemo(() => {
    if (combinedDebts.length === 0) {
      return {
        isViable: true,
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: []
      };
    }
    return generateRepaymentPlan(combinedDebts, paymentAmount, 'avalanche', true);
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
  
  // Improved timeline data preparation with better sampling for longer timelines
  const timelineData = useMemo(() => {
    const plan = getSelectedPlan();
    
    if (!plan.timeline || plan.timeline.length === 0) {
      return [];
    }
    
    const timeline = plan.timeline;
    const totalPeriods = timeline.length;
    
    // For small datasets, include all points
    if (totalPeriods <= 24) {
      return timeline.map((point, index) => ({
        month: index + 1,
        balance: point.totalRemaining,
        interest: point.totalInterestPaid,
        interestRate: point.totalInterestPaid / (totalDebt + 0.01) * 100, // Avoid division by zero
        monthlyInterest: index > 0 ? point.totalInterestPaid - timeline[index - 1].totalInterestPaid : point.totalInterestPaid
      }));
    }
    
    // For larger datasets, use intelligent sampling to preserve important features
    const simplifiedTimeline = [];
    const samplingRate = Math.ceil(totalPeriods / 24); // Aim for about 24 points
    
    // Always include first and last points
    let lastIncludedMonth = -samplingRate;
    
    for (let i = 0; i < totalPeriods; i++) {
      // Include points at regular intervals, or if there's a significant change
      const isRegularSample = i % samplingRate === 0;
      const isLastPoint = i === totalPeriods - 1;
      const isSignificantChange = i > 0 && Math.abs(timeline[i].totalRemaining - timeline[i - 1].totalRemaining) > totalDebt * 0.05;
      
      if (isRegularSample || isLastPoint || isSignificantChange) {
        // Avoid points too close together
        if (i - lastIncludedMonth >= samplingRate / 2 || isLastPoint) {
          lastIncludedMonth = i;
          
          // Calculate monthly interest correctly
          const monthlyInterest = i > 0 
            ? timeline[i].totalInterestPaid - timeline[i - 1].totalInterestPaid 
            : timeline[i].totalInterestPaid;
          
          simplifiedTimeline.push({
            month: i + 1,
            balance: timeline[i].totalRemaining,
            interest: timeline[i].totalInterestPaid,
            interestRate: timeline[i].totalInterestPaid / (totalDebt + 0.01) * 100, // Avoid division by zero
            monthlyInterest: monthlyInterest
          });
        }
      }
    }
    
    return simplifiedTimeline;
  }, [selectedStrategy, avalanchePlan, snowballPlan, equalPlan, totalDebt]);
  
  // Calculate the maximum interest value for scaling the chart
  const maxInterest = useMemo(() => {
    if (timelineData.length === 0) return 0;
    return Math.max(...timelineData.map(point => point.interest));
  }, [timelineData]);
  
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
  const isValidPayment = paymentAmount >= safeMinPayment;
  
  // Check if we have any debt to pay
  const hasDebt = totalDebt > 0 && combinedDebts.length > 0;
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{t('repayment.month')} {label}</p>
          {payload[0] && (
            <p className="text-primary">
              {t('repayment.balance')}: {formatCurrency(payload[0].value)}
            </p>
          )}
          {payload[1] && (
            <p className="text-destructive">
              {t('repayment.totalInterestPaid')}: {formatCurrency(payload[1].value)}
            </p>
          )}
          {payload[2] && (
            <p className="text-amber-500">
              {t('repayment.monthlyInterest')}: {formatCurrency(payload[2].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
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
                  <p className="text-2xl font-bold">{formatCurrency(safeMinPayment)}/{t('form.months')}</p>
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
                  min={safeMinPayment}
                  max={Math.max(safeMinPayment * 3, monthlyBudget * 2, safeMinPayment + 500)}
                  step={10}
                  onValueChange={(value) => setPaymentAmount(value[0])}
                  className={`w-full ${!isValidPayment ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('dashboard.minimum')}: {formatCurrency(safeMinPayment)}</span>
                  <span>{t('dashboard.maximum')}: {formatCurrency(Math.max(safeMinPayment * 3, monthlyBudget * 2, safeMinPayment + 500))}</span>
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
              
              {/* Chart view tabs */}
              {timelineData.length > 0 && isValidPayment && (
                <Tabs value={chartView} onValueChange={(value) => setChartView(value as 'combined' | 'separate')} className="mt-4">
                  <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                    <TabsTrigger value="combined">
                      <DollarSign className="mr-2 h-4 w-4" />
                      {t('repayment.combinedView')}
                    </TabsTrigger>
                    <TabsTrigger value="separate">
                      <BadgePercent className="mr-2 h-4 w-4" />
                      {t('repayment.separateView')}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Combined view (traditional line chart) */}
                  <TabsContent value="combined">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={timelineData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -5 }} 
                          />
                          <YAxis 
                            yAxisId="left"
                            tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                            label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                            label={{ value: t('repayment.interest'), angle: 90, position: 'insideRight' }}
                            domain={[0, maxInterest * 1.1]} // Scale the interest axis
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="balance"
                            name={t('repayment.balance')}
                            fill="#3b82f6"
                            stroke="#3b82f6"
                            fillOpacity={0.2}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="interest" 
                            name={t('repayment.totalInterestPaid')}
                            stroke="#ef4444" 
                            dot={false} 
                            activeDot={{ r: 6 }}
                            strokeWidth={2} 
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  {/* Separate view (bar chart for monthly interest) - Fixed labels and logic */}
                  <TabsContent value="separate">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={timelineData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -5 }} 
                          />
                          <YAxis 
                            yAxisId="left"
                            tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                            label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            label={{ value: t('repayment.monthlyInterest'), angle: 90, position: 'insideRight' }}
                            // Fix: Use proper formatting and scale for monthly interest
                            tickFormatter={(value) => `${Math.round(value)}`}
                            domain={[0, 'auto']}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="balance" 
                            name={t('repayment.balance')}
                            stroke="#3b82f6" 
                            dot={false}
                            strokeWidth={2}
                          />
                          <Bar 
                            yAxisId="right"
                            dataKey="monthlyInterest" 
                            name={t('repayment.monthlyInterest')}
                            fill="#f59e0b" 
                            barSize={15}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
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
