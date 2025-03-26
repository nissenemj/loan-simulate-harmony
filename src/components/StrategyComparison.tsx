
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { DebtItem, PrioritizationMethod, RepaymentPlan } from '@/utils/repayment/types';
import { prioritizeDebts } from '@/utils/repayment/prioritization';
import { simulateRepayment } from '@/utils/repayment/simulateRepayment';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';
import { formatCurrency } from '@/utils/loanCalculations';

// Define colors for the charts
const COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#1EAEDB', // Bright Blue
  '#33C3F0', // Sky Blue
];

interface StrategyComparisonProps {
  debts: DebtItem[];
  monthlyBudget: number;
}

type Plan = {
  totalMonths: number;
  totalInterestPaid: number;
  timeline: RepaymentPlan['timeline'];
};

type PayoffData = {
  debtId: string;
  debtName: string;
  initialBalance: number;
  interestRate: number;
  minimumMonths: number;
  snowballMonths: number;
  avalancheMonths: number;
};

const StrategyComparison: React.FC<StrategyComparisonProps> = ({ debts, monthlyBudget }) => {
  const { t } = useLanguage();
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [avalanchePlan, setAvalanchePlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [] });
  const [snowballPlan, setSnowballPlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [] });
  const [minimumPlan, setMinimumPlan] = useState<Plan>({ totalMonths: 0, totalInterestPaid: 0, timeline: [] });
  const [payoffData, setPayoffData] = useState<PayoffData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (debts.length === 0 || monthlyBudget <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Calculate the plan for each strategy
    calculatePlans();
  }, [debts, monthlyBudget]);

  const calculatePlans = () => {
    // Calculate minimum payments plan
    const minPlan = calculateMinimumPaymentsPlan(debts);
    setMinimumPlan(minPlan);

    // Calculate snowball plan
    const snowPlan = generateRepaymentPlan(debts, monthlyBudget, 'snowball');
    if (snowPlan.isViable) {
      setSnowballPlan({
        totalMonths: snowPlan.totalMonths,
        totalInterestPaid: snowPlan.totalInterestPaid,
        timeline: snowPlan.timeline
      });
    }

    // Calculate avalanche plan
    const avaPlan = generateRepaymentPlan(debts, monthlyBudget, 'avalanche');
    if (avaPlan.isViable) {
      setAvalanchePlan({
        totalMonths: avaPlan.totalMonths,
        totalInterestPaid: avaPlan.totalInterestPaid,
        timeline: avaPlan.timeline
      });
    }

    // Calculate payoff times for each debt in each strategy
    const payoffInfo = calculatePayoffInfo(debts, minPlan, snowPlan, avaPlan);
    setPayoffData(payoffInfo);

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
      timeline
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

      return {
        debtId: debt.id,
        debtName: debt.name,
        initialBalance: debt.balance,
        interestRate: debt.interestRate,
        minimumMonths,
        snowballMonths,
        avalancheMonths
      };
    });
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

  const prepareTimelineData = () => {
    const timeline = selectedStrategy === 'avalanche' ? 
      avalanchePlan.timeline : 
      snowballPlan.timeline;
    
    if (!timeline || timeline.length === 0) {
      return [];
    }
    
    // Convert the timeline data to the format required by the chart
    return timeline.map((month, idx) => {
      const monthData: any = { month: idx + 1 };
      
      month.debts.forEach(debt => {
        monthData[debt.name] = debt.remainingBalance;
      });
      
      return monthData;
    });
  };

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
          <Tabs defaultValue="timeline">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">{t('repayment.payoffTimeline')}</TabsTrigger>
              <TabsTrigger value="comparison">{t('repayment.strategyComparison')}</TabsTrigger>
              <TabsTrigger value="details">{t('repayment.debtDetails')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="pt-4">
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareTimelineData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -10 }} 
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
              <p className="text-sm text-muted-foreground text-center mt-4">
                {t('repayment.timelineExplanation')}
              </p>
            </TabsContent>
            
            <TabsContent value="comparison" className="pt-4">
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `€${Math.floor(value)}`}
                      label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line 
                      name={t('repayment.minimumPayments')}
                      type="monotone"
                      data={minimumPlan.timeline.map((m, idx) => ({ month: idx + 1, balance: m.totalRemaining }))}
                      dataKey="balance"
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      name={t('repayment.snowball')}
                      type="monotone"
                      data={snowballPlan.timeline.map((m, idx) => ({ month: idx + 1, balance: m.totalRemaining }))}
                      dataKey="balance"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      name={t('repayment.avalanche')}
                      type="monotone"
                      data={avalanchePlan.timeline.map((m, idx) => ({ month: idx + 1, balance: m.totalRemaining }))}
                      dataKey="balance"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left bg-muted">
                      <th className="p-2">{t('repayment.debtName')}</th>
                      <th className="p-2">{t('form.amount')}</th>
                      <th className="p-2">{t('loan.interestRate')}</th>
                      <th className="p-2">{t('repayment.minimumPayments')}</th>
                      <th className="p-2">{t('repayment.snowball')}</th>
                      <th className="p-2">{t('repayment.avalanche')}</th>
                      <th className="p-2">{t('repayment.bestStrategy')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoffData.map(debt => {
                      // Determine best strategy for this debt
                      const minMonths = debt.minimumMonths;
                      const snowballMonths = debt.snowballMonths;
                      const avalancheMonths = debt.avalancheMonths;
                      
                      let bestStrategy = '';
                      let bestMonths = Infinity;
                      
                      if (minMonths < bestMonths) {
                        bestStrategy = t('repayment.minimumPayments');
                        bestMonths = minMonths;
                      }
                      
                      if (snowballMonths < bestMonths) {
                        bestStrategy = t('repayment.snowball');
                        bestMonths = snowballMonths;
                      }
                      
                      if (avalancheMonths < bestMonths) {
                        bestStrategy = t('repayment.avalanche');
                        bestMonths = avalancheMonths;
                      }
                      
                      return (
                        <tr key={debt.debtId} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{debt.debtName}</td>
                          <td className="p-2">{formatCurrency(debt.initialBalance)}</td>
                          <td className="p-2">{debt.interestRate.toFixed(2)}%</td>
                          <td className="p-2">{debt.minimumMonths === Infinity ? 
                            <span className="text-destructive">∞</span> : 
                            `${debt.minimumMonths} ${t('form.months')}`
                          }</td>
                          <td className="p-2">{debt.snowballMonths} {t('form.months')}</td>
                          <td className="p-2">{debt.avalancheMonths} {t('form.months')}</td>
                          <td className="p-2 font-medium">{bestStrategy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Payment Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>{t('repayment.paymentFlowVisualization')}</CardTitle>
          <CardDescription>{t('repayment.paymentFlowDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4 mb-4">
            <Button 
              variant={selectedStrategy === 'avalanche' ? 'default' : 'outline'}
              onClick={() => setSelectedStrategy('avalanche')}
            >
              {t('repayment.avalanche')}
            </Button>
            <Button 
              variant={selectedStrategy === 'snowball' ? 'default' : 'outline'}
              onClick={() => setSelectedStrategy('snowball')}
            >
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
                  dataKey="month" 
                  label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  tickFormatter={(value) => `€${Math.floor(value)}`}
                  label={{ value: t('repayment.payment'), angle: -90, position: 'insideLeft' }}
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
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            {t('repayment.paymentFlowExplanation')}
          </p>
        </CardContent>
      </Card>
      
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('repayment.strategySummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-medium">{t('repayment.minimumPayments')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">{t('repayment.totalMonths')}:</div>
                <div className="text-sm font-medium">
                  {minimumPlan.totalMonths === Infinity ? 
                    <span className="text-destructive">∞</span> : 
                    `${minimumPlan.totalMonths} ${t('form.months')}`
                  }
                </div>
                <div className="text-sm text-muted-foreground">{t('repayment.totalInterestPaid')}:</div>
                <div className="text-sm font-medium">
                  {minimumPlan.totalInterestPaid === Infinity ? 
                    <span className="text-destructive">∞</span> : 
                    formatCurrency(minimumPlan.totalInterestPaid)
                  }
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-medium">{t('repayment.snowball')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">{t('repayment.totalMonths')}:</div>
                <div className="text-sm font-medium">{snowballPlan.totalMonths} {t('form.months')}</div>
                <div className="text-sm text-muted-foreground">{t('repayment.totalInterestPaid')}:</div>
                <div className="text-sm font-medium">{formatCurrency(snowballPlan.totalInterestPaid)}</div>
                <div className="text-sm text-muted-foreground">{t('repayment.savingsVsMinimum')}:</div>
                <div className="text-sm font-medium text-green-600">
                  {minimumPlan.totalInterestPaid === Infinity ? 
                    '∞' : 
                    formatCurrency(minimumPlan.totalInterestPaid - snowballPlan.totalInterestPaid)
                  }
                </div>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-medium">{t('repayment.avalanche')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">{t('repayment.totalMonths')}:</div>
                <div className="text-sm font-medium">{avalanchePlan.totalMonths} {t('form.months')}</div>
                <div className="text-sm text-muted-foreground">{t('repayment.totalInterestPaid')}:</div>
                <div className="text-sm font-medium">{formatCurrency(avalanchePlan.totalInterestPaid)}</div>
                <div className="text-sm text-muted-foreground">{t('repayment.savingsVsMinimum')}:</div>
                <div className="text-sm font-medium text-green-600">
                  {minimumPlan.totalInterestPaid === Infinity ? 
                    '∞' : 
                    formatCurrency(minimumPlan.totalInterestPaid - avalanchePlan.totalInterestPaid)
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyComparison;
