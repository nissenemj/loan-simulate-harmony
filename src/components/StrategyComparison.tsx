import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { DebtItem, PrioritizationMethod, RepaymentPlan } from '@/utils/repayment/types';
import { prioritizeDebts } from '@/utils/repayment/prioritization';
import { simulateRepayment } from '@/utils/repayment/simulateRepayment';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';
import { formatCurrency } from '@/utils/loanCalculations';
import { 
  TrendingUp, TrendingDown, Clock, Award, CreditCard, DollarSign, 
  Calendar, BarChart2, List, Percent, ArrowRight, Info, 
  ChevronRight, AlertCircle, CheckCircle2, CheckCircle
} from 'lucide-react';

// Define colors for the charts
const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#1EAEDB', // Bright Blue
  '#33C3F0', // Sky Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#F59E0B', // Amber
];

interface StrategyComparisonProps {
  debts: DebtItem[];
  monthlyBudget: number;
}

type Plan = {
  totalMonths: number;
  totalInterestPaid: number;
  timeline: RepaymentPlan['timeline'];
  isViable: boolean;
};

type PayoffData = {
  debtId: string;
  debtName: string;
  initialBalance: number;
  interestRate: number;
  minimumMonths: number;
  snowballMonths: number;
  avalancheMonths: number;
  bestStrategy: string;
};

type CriticalPoint = {
  month: number;
  debtPaidOff: string;
  newFocusDebt: string;
  extraPayment: number;
  date: Date;
};

// Format date using the specified locale
const formatDate = (date: Date, locale: string = 'fi-FI'): string => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
  });
};

const StrategyComparison: React.FC<StrategyComparisonProps> = ({ debts, monthlyBudget }) => {
  const { t, locale } = useLanguage();
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [extraBudget, setExtraBudget] = useState<number>(0);
  const [avalanchePlan, setAvalanchePlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [], isViable: false });
  const [snowballPlan, setSnowballPlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [], isViable: false });
  const [minimumPlan, setMinimumPlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [], isViable: false });
  const [payoffData, setPayoffData] = useState<PayoffData[]>([]);
  const [criticalPoints, setCriticalPoints] = useState<CriticalPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (debts.length === 0 || monthlyBudget <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Calculate the plan for each strategy
    calculatePlans();
  }, [debts, monthlyBudget, extraBudget]);

  const calculatePlans = () => {
    // Calculate minimum payments plan
    const minPlan = calculateMinimumPaymentsPlan(debts);
    setMinimumPlan(minPlan);

    // Calculate snowball plan with current budget + extra
    const totalBudget = monthlyBudget + extraBudget;
    const snowPlan = generateRepaymentPlan(debts, totalBudget, 'snowball');
    if (snowPlan.isViable) {
      setSnowballPlan({
        totalMonths: snowPlan.totalMonths,
        totalInterestPaid: snowPlan.totalInterestPaid,
        timeline: snowPlan.timeline,
        isViable: snowPlan.isViable
      });
    }

    // Calculate avalanche plan with current budget + extra
    const avaPlan = generateRepaymentPlan(debts, totalBudget, 'avalanche');
    if (avaPlan.isViable) {
      setAvalanchePlan({
        totalMonths: avaPlan.totalMonths,
        totalInterestPaid: avaPlan.totalInterestPaid,
        timeline: avaPlan.timeline,
        isViable: avaPlan.isViable
      });
    }

    // Calculate payoff times for each debt in each strategy
    const payoffInfo = calculatePayoffInfo(debts, minPlan, snowPlan, avaPlan);
    setPayoffData(payoffInfo);

    // Identify critical points in repayment timeline
    const criticalPointsData = identifyCriticalPoints(
      selectedStrategy === 'avalanche' ? avaPlan.timeline : snowPlan.timeline,
      debts
    );
    setCriticalPoints(criticalPointsData);

    setLoading(false);
  };

  const calculateMinimumPaymentsPlan = (debts: DebtItem[]): Plan => {
    // Create allocation with only minimum payments
    const minAllocation = debts.map(debt => ({
      id: debt.id,
      name: debt.name,
      type: debt.type,
      minPayment: debt.minPayment,
      extraPayment: 0,
      totalPayment: debt.minPayment
    }));

    // Simulate repayment with minimum payments
    const { timeline } = simulateRepayment(
      debts,
      minAllocation,
      'minimum' as PrioritizationMethod // Using 'minimum' as a strategy
    );

    // Check if all debts can be paid off with minimum payments
    const allWillBePaidOff = !debts.some(debt => {
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      return debt.minPayment <= debt.balance * monthlyInterestRate;
    });

    return {
      totalMonths: allWillBePaidOff ? timeline.length : Infinity,
      totalInterestPaid: allWillBePaidOff ? 
        timeline.reduce((sum, month) => sum + month.totalInterestPaid, 0) : 
        Infinity,
      timeline,
      isViable: allWillBePaidOff
    };
  };

  const calculatePayoffInfo = (
    debts: DebtItem[],
    minPlan: Plan,
    snowPlan: RepaymentPlan,
    avaPlan: RepaymentPlan
  ): PayoffData[] => {
    return debts.map(debt => {
      // Calculate payoff month for each strategy
      const minimumMonths = findPayoffMonth(debt.id, minPlan.timeline);
      const snowballMonths = findPayoffMonth(debt.id, snowPlan.timeline);
      const avalancheMonths = findPayoffMonth(debt.id, avaPlan.timeline);

      // Determine best strategy for this debt
      let bestStrategy = '';
      let bestMonths = Infinity;
      
      if (minimumMonths < bestMonths) {
        bestStrategy = 'minimum';
        bestMonths = minimumMonths;
      }
      
      if (snowballMonths < bestMonths) {
        bestStrategy = 'snowball';
        bestMonths = snowballMonths;
      }
      
      if (avalancheMonths < bestMonths) {
        bestStrategy = 'avalanche';
        bestMonths = avalancheMonths;
      }

      return {
        debtId: debt.id,
        debtName: debt.name,
        initialBalance: debt.balance,
        interestRate: debt.interestRate,
        minimumMonths,
        snowballMonths,
        avalancheMonths,
        bestStrategy
      };
    });
  };

  const identifyCriticalPoints = (
    timeline: RepaymentPlan['timeline'],
    debts: DebtItem[]
  ): CriticalPoint[] => {
    if (!timeline || timeline.length === 0) {
      return [];
    }

    const points: CriticalPoint[] = [];
    const startDate = new Date();
    
    // Track which debts have been paid off
    const paidOffDebts = new Set<string>();
    
    // For each month in the timeline
    for (let i = 1; i < timeline.length; i++) {
      const prevMonth = timeline[i-1];
      const currMonth = timeline[i];
      
      // Check for debts that are paid off in this month (balance was > 0 last month and = 0 this month)
      for (const debt of currMonth.debts) {
        const prevDebt = prevMonth.debts.find(d => d.id === debt.id);
        
        if (prevDebt && prevDebt.remainingBalance > 0 && debt.remainingBalance === 0) {
          // This debt was just paid off
          
          // Find the debt that will receive the extra payment next
          const remainingDebts = currMonth.debts.filter(d => 
            d.remainingBalance > 0 && !paidOffDebts.has(d.id)
          );
          
          const prioritizedDebts = prioritizeDebts(
            debts.filter(d => remainingDebts.some(rd => rd.id === d.id)),
            selectedStrategy
          );
          
          const newFocusDebt = prioritizedDebts.length > 0 ? 
            prioritizedDebts[0].name : 
            t('repayment.noRemainingDebts');
          
          // Calculate the date for this critical point
          const date = new Date(startDate);
          date.setMonth(startDate.getMonth() + i);
          
          // Add this critical point
          points.push({
            month: i,
            debtPaidOff: debt.name,
            newFocusDebt,
            extraPayment: 0, // This would need more complex logic to calculate exactly
            date
          });
          
          // Mark this debt as paid off
          paidOffDebts.add(debt.id);
        }
      }
    }
    
    return points;
  };

  const findPayoffMonth = (debtId: string, timeline: RepaymentPlan['timeline']): number => {
    // Find the month when the debt is paid off
    for (let i = 0; i < timeline.length; i++) {
      const monthData = timeline[i];
      const debtData = monthData.debts.find(d => d.id === debtId);
      
      if (!debtData) {
        // Debt is already paid off or not found in this month
        return i; // It must have been paid off in the previous month
      }
      
      if (debtData.remainingBalance === 0) {
        return i + 1; // +1 because we're 0-indexed but want to show months starting from 1
      }
    }
    
    // If we get here, the debt wasn't paid off in the timeline
    return Infinity;
  };

  const prepareTimelineData = (includeInterest: boolean = false) => {
    const timeline = selectedStrategy === 'avalanche' ? 
      avalanchePlan.timeline : 
      snowballPlan.timeline;
    
    if (!timeline || timeline.length === 0) {
      return [];
    }
    
    // Convert the timeline data to the format required by the chart
    return timeline.map((month, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() + idx);
      
      const monthData: any = { 
        month: idx + 1, 
        date: formatDate(date, locale)
      };
      
      let totalInterest = 0;
      
      month.debts.forEach(debt => {
        monthData[debt.name] = debt.remainingBalance;
        totalInterest += debt.interestPaid;
      });
      
      if (includeInterest) {
        monthData['interest'] = totalInterest;
      }
      
      return monthData;
    });
  };

  const prepareStrategyComparisonData = () => {
    if (!avalanchePlan.timeline.length || !snowballPlan.timeline.length) {
      return [];
    }

    // Create data for comparing all three strategies
    const maxMonths = Math.max(
      minimumPlan.totalMonths === Infinity ? 0 : minimumPlan.totalMonths,
      snowballPlan.totalMonths,
      avalanchePlan.totalMonths
    );

    const data = [];

    for (let i = 0; i < maxMonths; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const monthData: any = {
        month: i + 1,
        date: formatDate(date, locale)
      };

      // Add minimum payment balance if available for this month
      if (i < minimumPlan.timeline.length) {
        monthData.minimum = minimumPlan.timeline[i].totalRemaining;
      }

      // Add snowball balance if available for this month
      if (i < snowballPlan.timeline.length) {
        monthData.snowball = snowballPlan.timeline[i].totalRemaining;
      }

      // Add avalanche balance if available for this month
      if (i < avalanchePlan.timeline.length) {
        monthData.avalanche = avalanchePlan.timeline[i].totalRemaining;
      }

      data.push(monthData);
    }

    return data;
  };

  const prepareCashFlowData = () => {
    const timeline = selectedStrategy === 'avalanche' ? 
      avalanchePlan.timeline : 
      snowballPlan.timeline;
    
    if (!timeline || timeline.length === 0) {
      return [];
    }
    
    // Convert the timeline data to show payment allocations
    return timeline.map((month, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() + idx);
      
      const monthData: any = { 
        month: idx + 1, 
        date: formatDate(date, locale)
      };
      
      month.debts.forEach(debt => {
        monthData[debt.name] = debt.payment;
      });
      
      return monthData;
    });
  };

  const prepareInterestSavingsData = () => {
    if (!avalanchePlan.timeline.length || !snowballPlan.timeline.length) {
      return [];
    }

    const maxMonths = Math.max(
      snowballPlan.totalMonths,
      avalanchePlan.totalMonths
    );

    const data = [];
    
    // Calculate minimum interest each month (if plan is viable)
    const minInterestByMonth = minimumPlan.isViable ? 
      minimumPlan.timeline.map(month => month.totalInterestPaid) : 
      [];

    for (let i = 0; i < maxMonths; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const monthData: any = {
        month: i + 1,
        date: formatDate(date, locale)
      };

      // Calculate savings against minimum payments
      const minimumInterest = i < minInterestByMonth.length ? minInterestByMonth[i] : 0;

      // Add snowball interest if available for this month
      if (i < snowballPlan.timeline.length) {
        const snowballInterest = snowballPlan.timeline[i].totalInterestPaid;
        monthData.snowballInterest = snowballInterest;
        
        if (minimumPlan.isViable) {
          monthData.snowballSavings = minimumInterest - snowballInterest;
        }
      }

      // Add avalanche interest if available for this month
      if (i < avalanchePlan.timeline.length) {
        const avalancheInterest = avalanchePlan.timeline[i].totalInterestPaid;
        monthData.avalancheInterest = avalancheInterest;
        
        if (minimumPlan.isViable) {
          monthData.avalancheSavings = minimumInterest - avalancheInterest;
        }
      }

      data.push(monthData);
    }

    return data;
  };

  const getRecommendedStrategy = (): PrioritizationMethod => {
    if (!avalanchePlan.isViable && !snowballPlan.isViable) {
      return 'minimum' as PrioritizationMethod;
    }
    
    if (!avalanchePlan.isViable) return 'snowball';
    if (!snowballPlan.isViable) return 'avalanche';
    
    // If both are viable, choose based on interest savings
    return avalanchePlan.totalInterestPaid <= snowballPlan.totalInterestPaid ? 
      'avalanche' : 'snowball';
  };

  const getBudgetImpactData = () => {
    const increments = [50, 100, 200, 500];
    const baselineMonths = selectedStrategy === 'avalanche' ? 
      avalanchePlan.totalMonths : 
      snowballPlan.totalMonths;
    
    const baselineInterest = selectedStrategy === 'avalanche' ? 
      avalanchePlan.totalInterestPaid : 
      snowballPlan.totalInterestPaid;
    
    return increments.map(increment => {
      const plan = generateRepaymentPlan(
        debts, 
        monthlyBudget + increment, 
        selectedStrategy
      );
      
      return {
        increment,
        totalBudget: monthlyBudget + increment,
        months: plan.totalMonths,
        interest: plan.totalInterestPaid,
        monthsSaved: baselineMonths - plan.totalMonths,
        interestSaved: baselineInterest - plan.totalInterestPaid
      };
    });
  };

  // Calculate estimated payoff date
  const getPayoffDate = (months: number) => {
    if (months === Infinity || months <= 0) return null;
    
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  };

  // Prepare action plan for next month
  const getNextMonthActionPlan = () => {
    if (debts.length === 0) return [];
    
    const plan = selectedStrategy === 'avalanche' ? 
      avalanchePlan : 
      snowballPlan;
      
    if (!plan.isViable || plan.timeline.length === 0) return [];
    
    // Get the first month's allocation
    const firstMonth = plan.timeline[0];
    
    return firstMonth.debts.map(debt => {
      const debtDetails = debts.find(d => d.id === debt.id);
      return {
        id: debt.id,
        name: debt.name,
        payment: debt.payment,
        interestPaid: debt.interestPaid,
        type: debtDetails?.type || 'loan'
      };
    });
  };

  // Calculate how much closer to debt freedom with additional payment
  const calculateAdditionalPaymentImpact = (additionalAmount: number) => {
    const plan = generateRepaymentPlan(
      debts, 
      monthlyBudget + additionalAmount, 
      selectedStrategy
    );
    
    const currentPlan = selectedStrategy === 'avalanche' ? 
      avalanchePlan : 
      snowballPlan;
    
    if (!plan.isViable || !currentPlan.isViable) return null;
    
    const monthsSaved = currentPlan.totalMonths - plan.totalMonths;
    const interestSaved = currentPlan.totalInterestPaid - plan.totalInterestPaid;
    
    return {
      monthsSaved,
      interestSaved,
      newTotalMonths: plan.totalMonths
    };
  };

  // Render loading state
  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('repayment.strategyComparison')}</CardTitle>
          <CardDescription>{t('repayment.loadingPlans')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('repayment.strategyComparison')}</CardTitle>
          <CardDescription>{t('repayment.strategyComparisonDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="timeline">
                <Calendar className="mr-2 h-4 w-4" />
                {t('repayment.payoffTimeline')}
              </TabsTrigger>
              <TabsTrigger value="comparison">
                <BarChart2 className="mr-2 h-4 w-4" />
                {t('repayment.strategyComparison')}
              </TabsTrigger>
              <TabsTrigger value="details">
                <List className="mr-2 h-4 w-4" />
                {t('repayment.debtDetails')}
              </TabsTrigger>
              <TabsTrigger value="cashflow">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t('repayment.cashFlow')}
              </TabsTrigger>
              <TabsTrigger value="actionplan">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('repayment.actionPlan')}
              </TabsTrigger>
            </TabsList>
            
            {/* Payoff Timeline Tab */}
            <TabsContent value="timeline" className="pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-end space-x-4 mb-4">
                  <Button 
                    variant={selectedStrategy === 'avalanche' ? 'default' : 'outline'}
                    onClick={() => setSelectedStrategy('avalanche')}
                    size="sm"
                  >
                    <TrendingDown className="mr-2 h-4 w-4" />
                    {t('repayment.avalanche')}
                  </Button>
                  <Button 
                    variant={selectedStrategy === 'snowball' ? 'default' : 'outline'}
                    onClick={() => setSelectedStrategy('snowball')}
                    size="sm"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {t('repayment.snowball')}
                  </Button>
                </div>
                
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareTimelineData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: t('repayment.date'), position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${Math.floor(value)}`}
                        label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      {payoffData.map((debt, index) => (
                        <Line 
                          key={debt.debtId}
                          type="monotone"
                          dataKey={debt.debtName}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {criticalPoints.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">{t('repayment.criticalPoints')}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('repayment.date')}</TableHead>
                          <TableHead>{t('repayment.debtPaidOff')}</TableHead>
                          <TableHead>{t('repayment.newFocusDebt')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {criticalPoints.map((point, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(point.date)}</TableCell>
                            <TableCell className="font-medium">{point.debtPaidOff}</TableCell>
                            <TableCell>{point.newFocusDebt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t('repayment.timelineExplanation')}
                </p>
              </div>
            </TabsContent>
            
            {/* Strategy Comparison Tab */}
            <TabsContent value="comparison" className="pt-4">
              <div className="flex flex-col space-y-6">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareStrategyComparisonData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: t('repayment.date'), position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${Math.floor(value)}`}
                        label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      {minimumPlan.isViable && (
                        <Line 
                          name={t('repayment.minimumPayments')}
                          type="monotone"
                          dataKey="minimum"
                          stroke="#F97316"
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                      <Line 
                        name={t('repayment.snowball')}
                        type="monotone"
                        dataKey="snowball"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        name={t('repayment.avalanche')}
                        type="monotone"
                        dataKey="avalanche"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <h3 className="text-lg font-medium mt-4 mb-2">{t('repayment.interestSavings')}</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepareInterestSavingsData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: t('repayment.date'), position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${Math.floor(value)}`}
                        label={{ value: t('repayment.interestSavings'), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Area 
                        name={t('repayment.avalancheSavings')}
                        type="monotone"
                        dataKey="avalancheSavings"
                        fill="#0EA5E9"
                        stroke="#0EA5E9"
                        fillOpacity={0.3}
                      />
                      <Area 
                        name={t('repayment.snowballSavings')}
                        type="monotone"
                        dataKey="snowballSavings"
                        fill="#8B5CF6"
                        stroke="#8B5CF6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">{t('repayment.budgetImpact')}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('repayment.additionalPayment')}</TableHead>
                        <TableHead>{t('repayment.totalBudget')}</TableHead>
                        <TableHead>{t('repayment.newPayoffTime')}</TableHead>
                        <TableHead>{t('repayment.timeReduction')}</TableHead>
                        <TableHead>{t('repayment.interestSavings')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getBudgetImpactData().map((impact, index) => (
                        <TableRow key={index}>
                          <TableCell>+{formatCurrency(impact.increment)}/kk</TableCell>
                          <TableCell>{formatCurrency(impact.totalBudget)}/kk</TableCell>
                          <TableCell>{impact.months} {t('form.months')}</TableCell>
                          <TableCell className="text-green-600">
                            -{impact.monthsSaved} {t('form.months')}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {formatCurrency(impact.interestSaved)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {/* Debt Details Tab */}
            <TabsContent value="details" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('repayment.debtName')}</TableHead>
                      <TableHead>{t('form.amount')}</TableHead>
                      <TableHead>{t('loan.interestRate')}</TableHead>
                      <TableHead>{t('repayment.minimumPayments')}</TableHead>
                      <TableHead>{t('repayment.snowball')}</TableHead>
                      <TableHead>{t('repayment.avalanche')}</TableHead>
                      <TableHead>{t('repayment.bestStrategy')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoffData.map(debt => {
                      const minDate = getPayoffDate(debt.minimumMonths);
                      const snowDate = getPayoffDate(debt.snowballMonths);
                      const avaDate = getPayoffDate(debt.avalancheMonths);
                      
                      return (
                        <TableRow key={debt.debtId} className="border-b hover:bg-muted/50">
                          <TableCell className="font-medium">{debt.debtName}</TableCell>
                          <TableCell>{formatCurrency(debt.initialBalance)}</TableCell>
                          <TableCell>{debt.interestRate.toFixed(2)}%</TableCell>
                          <TableCell>{debt.minimumMonths === Infinity ? 
                            <span className="text-destructive">∞</span> : 
                            <>
                              {debt.minimumMonths} {t('form.months')}
                              {minDate && <div className="text-xs text-muted-foreground">{formatDate(minDate)}</div>}
                            </>
                          }</TableCell>
                          <TableCell>
                            {debt.snowballMonths} {t('form.months')}
                            {snowDate && <div className="text-xs text-muted-foreground">{formatDate(snowDate)}</div>}
                          </TableCell>
                          <TableCell>
                            {debt.avalancheMonths} {t('form.months')}
                            {avaDate && <div className="text-xs text-muted-foreground">{formatDate(avaDate)}</div>}
                          </TableCell>
                          <TableCell className="font-medium">
                            {t(`repayment.${debt.bestStrategy}`)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Cash Flow Tab */}
            <TabsContent value="cashflow" className="pt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-end space-x-4 mb-4">
                  <Button 
                    variant={selectedStrategy === 'avalanche' ? 'default' : 'outline'}
                    onClick={() => setSelectedStrategy('avalanche')}
                    size="sm"
                  >
                    <TrendingDown className="mr-2 h-4 w-4" />
                    {t('repayment.avalanche')}
                  </Button>
                  <Button 
                    variant={selectedStrategy === 'snowball' ? 'default' : 'outline'}
                    onClick={() => setSelectedStrategy('snowball')}
                    size="sm"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {t('repayment.snowball')}
                  </Button>
                </div>
                
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepareCashFlowData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: t('repayment.date'), position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `€${Math.floor(value)}`}
                        label={{ value: t('repayment.payment'), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      {payoffData.map((debt, index) => (
                        <Area 
                          key={debt.debtId}
                          type="monotone"
                          dataKey={debt.debtName}
                          stackId="1"
                          fill={COLORS[index % COLORS.length]}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {t('repayment.cashFlowExplanation')}
                </p>
              </div>
              
              {criticalPoints.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">{t('repayment.paymentShifts')}</h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                    
                    {criticalPoints.map((point, index) => (
                      <div key={index} className="relative pl-8 pb-6">
                        <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <h4 className="font-medium">{formatDate(point.date)}</h4>
                        <p className="text-sm mt-1">
                          {t('repayment.debtPaidOffMessage', {
                            debt: point.debtPaidOff,
                            newDebt: point.newFocusDebt
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Action Plan Tab */}
            <TabsContent value="actionplan" className="pt-4">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <Card className="w-full md:w-2/3">
                    <CardHeader className="pb-2">
                      <CardTitle>{t('repayment.recommendedStrategy')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          {getRecommendedStrategy() === 'avalanche' ? (
                            <TrendingDown className="h-6 w-6 text-primary" />
                          ) : (
                            <TrendingUp className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {t(`repayment.${getRecommendedStrategy()}`)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {getRecommendedStrategy() === 'avalanche' 
                              ? t('repayment.avalancheExplanation')
                              : getRecommendedStrategy() === 'snowball'
                                ? t('repayment.snowballExplanation')
                                : t('repayment.minimumExplanation')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">
                            {t('repayment.totalTime')}
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedStrategy === 'avalanche' 
                              ? avalanchePlan.totalMonths 
                              : snowballPlan.totalMonths} {t('form.months')}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatDate(getPayoffDate(
                              selectedStrategy === 'avalanche' 
                                ? avalanchePlan.totalMonths 
                                : snowballPlan.totalMonths
                            ) || new Date())}
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">
                            {t('repayment.totalInterest')}
                          </div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(
                              selectedStrategy === 'avalanche' 
                                ? avalanchePlan.totalInterestPaid 
                                : snowballPlan.totalInterestPaid
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">{t('repayment.extraPaymentImpact')}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[50, 100, 200].map(amount => {
                            const impact = calculateAdditionalPaymentImpact(amount);
                            if (!impact) return null;
                            
                            return (
                              <div key={amount} className="bg-muted p-4 rounded-lg text-center">
                                <div className="text-lg font-bold mb-1">+{formatCurrency(amount)}/kk</div>
                                <div className="text-sm text-green-600">
                                  -{impact.monthsSaved} {t('form.months')}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatCurrency(impact.interestSaved)} säästö
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-full md:w-1/3">
                    <CardHeader className="pb-2">
                      <CardTitle>{t('repayment.nextMonth')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getNextMonthActionPlan().map((action, index) => (
                          <div key={index} className="flex justify-between items-center pb-2 border-b border-muted">
                            <div className="flex items-center gap-2">
                              {action.type === 'credit-card' ? (
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{action.name}</span>
                            </div>
                            <div className="font-medium">{formatCurrency(action.payment)}</div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-2 font-bold">
                          <span>{t('repayment.totalPayment')}</span>
                          <span>{formatCurrency(monthlyBudget)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline" size="sm">
                        {t('repayment.downloadPlan')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t('repayment.firstFocus')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {payoffData.length > 0 && (
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <AlertCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">
                                {selectedStrategy === 'avalanche' 
                                  ? payoffData.sort((a, b) => b.interestRate - a.interestRate)[0]?.debtName
                                  : payoffData.sort((a, b) => a.initialBalance - b.initialBalance)[0]?.debtName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedStrategy === 'avalanche' 
                                  ? t('repayment.highestInterestFirst')
                                  : t('repayment.lowestBalanceFirst')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">
                                {t('form.amount')}
                              </div>
                              <div className="text-2xl font-bold">
                                {formatCurrency(
                                  selectedStrategy === 'avalanche' 
                                    ? payoffData.sort((a, b) => b.interestRate - a.interestRate)[0]?.initialBalance || 0
                                    : payoffData.sort((a, b) => a.initialBalance - b.initialBalance)[0]?.initialBalance || 0
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">
                                {t('loan.interestRate')}
                              </div>
                              <div className="text-2xl font-bold">
                                {(selectedStrategy === 'avalanche' 
                                  ? payoffData.sort((a, b) => b.interestRate - a.interestRate)[0]?.interestRate
                                  : payoffData.sort((a, b) => a.initialBalance - b.initialBalance)[0]?.interestRate
                                ).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium mb-3">{t('repayment.payoffPlan')}</h4>
                          
                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-muted-foreground">{t('repayment.estimatedPayoff')}</span>
                              <span className="font-medium">
                                {selectedStrategy === 'avalanche' 
                                  ? payoffData.sort((a, b) => b.interestRate - a.interestRate)[0]?.avalancheMonths
                                  : payoffData.sort((a, b) => a.initialBalance - b.initialBalance)[0]?.snowballMonths} {t('form.months')}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t('repayment.payoffDate')}</span>
                              <span className="font-medium">
                                {formatDate(getPayoffDate(
                                  selectedStrategy === 'avalanche' 
                                    ? payoffData.sort((a, b) => b.interestRate - a.interestRate)[0]?.avalancheMonths || 0
                                    : payoffData.sort((a, b) => a.initialBalance - b.initialBalance)[0]?.snowballMonths || 0
                                ) || new Date())}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {t('repayment.focusTip')}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-4 space-x-4">
        <div className="flex items-center border rounded-md px-3 py-1.5">
          <span className="text-sm text-muted-foreground mr-2">{t('repayment.extraBudget')}</span>
          <input
            type="number"
            value={extraBudget}
            onChange={(e) => setExtraBudget(Number(e.target.value))}
            className="w-20 text-right border-0 focus:ring-0"
            step="50"
            min="0"
          />
          <span className="text-sm ml-1">€</span>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('actionplan')}
        >
          {t('repayment.viewActionPlan')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StrategyComparison;
