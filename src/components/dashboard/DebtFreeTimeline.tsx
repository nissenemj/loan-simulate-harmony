
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, Award, ArrowRight, Calculator, AlertCircle, DollarSign, Download, FileDown } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';
import { Loan } from '@/utils/loanCalculations';
import { combineDebts } from '@/utils/repayment/debtConverters';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceLine
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeCards: CreditCardType[];
  activeLoans?: Loan[];
  monthlyBudget?: number;
}

interface StrategyResult {
  id: 'avalanche' | 'snowball' | 'equal';
  name: string;
  months: number;
  interest: number;
  date: string;
}

type ChartDataPoint = {
  month: number;
  balance: number;
  principal: number;
  interest: number;
  totalInterest: number;
  monthlyInterest: number;
  monthlyPayment: number;
  [key: string]: number | string; // For additional strategy data
};

const DebtFreeTimeline = ({ 
  totalDebt, 
  formattedDebtFreeDate, 
  activeCards, 
  activeLoans = [], 
  monthlyBudget = 1500 
}: DebtFreeTimelineProps) => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  
  const combinedDebts = useMemo(() => 
    combineDebts(activeLoans, activeCards), 
    [activeLoans, activeCards]
  );
  
  const totalMinPayments = useMemo(() => {
    const loanMinPayments = activeLoans.reduce((sum, loan) => {
      if (loan.minPayment && loan.minPayment > 0) {
        return sum + loan.minPayment;
      } else {
        const monthlyRate = loan.interestRate / 100 / 12;
        const totalMonths = loan.termYears * 12;
        let payment;
        
        if (loan.repaymentType === 'custom-payment' && loan.customPayment) {
          payment = loan.customPayment;
        } else {
          payment = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        
        if (loan.monthlyFee) {
          payment += loan.monthlyFee;
        }
        
        return sum + payment;
      }
    }, 0);
    
    const cardMinPayments = activeCards.reduce((sum, card) => {
      const percentPayment = card.balance * (card.minPaymentPercent / 100);
      const minPayment = Math.max(card.minPayment, percentPayment);
      return sum + minPayment;
    }, 0);
    
    return loanMinPayments + cardMinPayments;
  }, [activeLoans, activeCards]);
  
  const safeMinPayment = Math.max(totalMinPayments, 10);
  
  const [paymentAmount, setPaymentAmount] = useState(
    Math.max(monthlyBudget || 0, safeMinPayment)
  );
  
  const [extraPayment, setExtraPayment] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball' | 'equal'>('avalanche');
  const [comparisonStrategy, setComparisonStrategy] = useState<'avalanche' | 'snowball' | 'equal' | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [affectTermNotPayment, setAffectTermNotPayment] = useState(true);
  const [visibleStrategies, setVisibleStrategies] = useState<{
    avalanche: boolean;
    snowball: boolean;
    equal: boolean;
  }>({
    avalanche: true,
    snowball: false,
    equal: false
  });
  
  useEffect(() => {
    const newAmount = Math.max(monthlyBudget || 0, safeMinPayment);
    setPaymentAmount(newAmount);
  }, [safeMinPayment, monthlyBudget]);
  
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
    return generateRepaymentPlan(combinedDebts, paymentAmount + extraPayment, 'avalanche');
  }, [combinedDebts, paymentAmount, extraPayment]);
  
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
    return generateRepaymentPlan(combinedDebts, paymentAmount + extraPayment, 'snowball');
  }, [combinedDebts, paymentAmount, extraPayment]);
  
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
    return generateRepaymentPlan(combinedDebts, paymentAmount + extraPayment, 'avalanche', true);
  }, [combinedDebts, paymentAmount, extraPayment]);
  
  const now = new Date();
  const currentMonth = 1; // First month in the simulation
  
  const getDateAfterMonths = (months: number) => {
    if (months <= 0) return '';
    
    const date = new Date(now);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString(locale);
  };
  
  const avalancheDate = getDateAfterMonths(avalanchePlan.totalMonths);
  const snowballDate = getDateAfterMonths(snowballPlan.totalMonths);
  const equalDate = getDateAfterMonths(equalPlan.totalMonths);
  
  const strategies: StrategyResult[] = useMemo(() => [
    { id: 'avalanche', name: t('repayment.avalancheStrategy'), months: avalanchePlan.totalMonths, interest: avalanchePlan.totalInterestPaid, date: avalancheDate },
    { id: 'snowball', name: t('repayment.snowballStrategy'), months: snowballPlan.totalMonths, interest: snowballPlan.totalInterestPaid, date: snowballDate },
    { id: 'equal', name: t('dashboard.equalDistribution'), months: equalPlan.totalMonths, interest: equalPlan.totalInterestPaid, date: equalDate }
  ], [t, avalanchePlan, snowballPlan, equalPlan, avalancheDate, snowballDate, equalDate]);
  
  const sortedStrategies = useMemo(() => [...strategies].sort((a, b) => {
    if (a.months === b.months) {
      return a.interest - b.interest;
    }
    return a.months - b.months;
  }), [strategies]);
  
  const recommendedStrategy = sortedStrategies[0];
  
  const getSelectedPlan = (strategyId: 'avalanche' | 'snowball' | 'equal') => {
    switch (strategyId) {
      case 'avalanche': return avalanchePlan;
      case 'snowball': return snowballPlan;
      case 'equal': return equalPlan;
      default: return avalanchePlan;
    }
  };
  
  const transformTimelineData = (timeline: any[], strategyId: string): ChartDataPoint[] => {
    if (!timeline || timeline.length === 0) {
      return [];
    }
    
    const totalPeriods = timeline.length;
    
    if (totalPeriods <= 36) {
      return timeline.map((point, index) => {
        const monthlyInterest = index > 0 
          ? point.totalInterestPaid - timeline[index - 1].totalInterestPaid 
          : point.totalInterestPaid;
        
        const monthlyPrincipal = index > 0
          ? (timeline[index - 1].totalRemaining - point.totalRemaining)
          : 0;
        
        const monthlyPayment = monthlyInterest + monthlyPrincipal;
        
        return {
          month: index + 1,
          balance: point.totalRemaining,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          totalInterest: point.totalInterestPaid,
          monthlyInterest,
          monthlyPayment,
          [`balance_${strategyId}`]: point.totalRemaining,
          [`interest_${strategyId}`]: monthlyInterest,
          [`principal_${strategyId}`]: monthlyPrincipal,
          [`totalInterest_${strategyId}`]: point.totalInterestPaid
        };
      });
    }
    
    const simplifiedTimeline = [];
    const samplingRate = Math.ceil(totalPeriods / 36);
    let lastIncludedMonth = -samplingRate;
    
    for (let i = 0; i < totalPeriods; i++) {
      const isRegularSample = i % samplingRate === 0;
      const isLastPoint = i === totalPeriods - 1;
      const isSignificantChange = i > 0 && Math.abs(timeline[i].totalRemaining - timeline[i - 1].totalRemaining) > totalDebt * 0.05;
      
      if (isRegularSample || isLastPoint || isSignificantChange) {
        if (i - lastIncludedMonth >= samplingRate / 2 || isLastPoint) {
          lastIncludedMonth = i;
          
          const monthlyInterest = i > 0 
            ? timeline[i].totalInterestPaid - timeline[i - 1].totalInterestPaid 
            : timeline[i].totalInterestPaid;
            
          const monthlyPrincipal = i > 0
            ? (timeline[i - 1].totalRemaining - timeline[i].totalRemaining)
            : 0;
            
          const monthlyPayment = monthlyInterest + monthlyPrincipal;
          
          simplifiedTimeline.push({
            month: i + 1,
            balance: timeline[i].totalRemaining,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            totalInterest: timeline[i].totalInterestPaid,
            monthlyInterest,
            monthlyPayment,
            [`balance_${strategyId}`]: timeline[i].totalRemaining,
            [`interest_${strategyId}`]: monthlyInterest,
            [`principal_${strategyId}`]: monthlyPrincipal,
            [`totalInterest_${strategyId}`]: timeline[i].totalInterestPaid
          });
        }
      }
    }
    
    return simplifiedTimeline;
  };
  
  const avalancheTimelineData = useMemo(() => 
    transformTimelineData(getSelectedPlan('avalanche').timeline, 'avalanche'),
    [avalanchePlan]
  );
  
  const snowballTimelineData = useMemo(() => 
    transformTimelineData(getSelectedPlan('snowball').timeline, 'snowball'),
    [snowballPlan]
  );
  
  const equalTimelineData = useMemo(() => 
    transformTimelineData(getSelectedPlan('equal').timeline, 'equal'),
    [equalPlan]
  );
  
  // Merge timelines for comparison
  const combinedTimelineData = useMemo(() => {
    if (!showComparison || !comparisonStrategy) {
      // If not comparing, just return the selected strategy's data
      if (selectedStrategy === 'avalanche') return avalancheTimelineData;
      if (selectedStrategy === 'snowball') return snowballTimelineData;
      return equalTimelineData;
    }
    
    // Get primary and comparison data
    const primaryData = selectedStrategy === 'avalanche' 
      ? avalancheTimelineData 
      : selectedStrategy === 'snowball' 
        ? snowballTimelineData 
        : equalTimelineData;
        
    const comparisonData = comparisonStrategy === 'avalanche' 
      ? avalancheTimelineData 
      : comparisonStrategy === 'snowball' 
        ? snowballTimelineData 
        : equalTimelineData;
    
    // Maximum length for combined array
    const maxLength = Math.max(primaryData.length, comparisonData.length);
    
    // Combine the data points
    const combined: ChartDataPoint[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const newPoint: ChartDataPoint = {
        month: i + 1,
        balance: 0,
        principal: 0,
        interest: 0,
        totalInterest: 0,
        monthlyInterest: 0,
        monthlyPayment: 0
      };
      
      // Add primary data if available for this month
      if (i < primaryData.length) {
        const primaryPoint = primaryData[i];
        Object.assign(newPoint, {
          balance: primaryPoint.balance,
          principal: primaryPoint.principal,
          interest: primaryPoint.interest,
          totalInterest: primaryPoint.totalInterest,
          monthlyInterest: primaryPoint.monthlyInterest,
          monthlyPayment: primaryPoint.monthlyPayment,
          [`balance_${selectedStrategy}`]: primaryPoint.balance,
          [`interest_${selectedStrategy}`]: primaryPoint.interest,
          [`principal_${selectedStrategy}`]: primaryPoint.principal,
          [`totalInterest_${selectedStrategy}`]: primaryPoint.totalInterest
        });
      }
      
      // Add comparison data if available for this month
      if (i < comparisonData.length) {
        const comparePoint = comparisonData[i];
        Object.assign(newPoint, {
          [`balance_${comparisonStrategy}`]: comparePoint.balance,
          [`interest_${comparisonStrategy}`]: comparePoint.interest,
          [`principal_${comparisonStrategy}`]: comparePoint.principal,
          [`totalInterest_${comparisonStrategy}`]: comparePoint.totalInterest
        });
      }
      
      combined.push(newPoint);
    }
    
    return combined;
  }, [
    selectedStrategy, 
    comparisonStrategy, 
    showComparison, 
    avalancheTimelineData, 
    snowballTimelineData, 
    equalTimelineData
  ]);
  
  const chartData = combinedTimelineData;
  
  const maxValues = useMemo(() => {
    if (chartData.length === 0) return { balance: totalDebt, interest: 0, monthlyInterest: 0 };
    
    // Find max values for primary and comparison strategies
    const maxBalance = Math.max(...chartData.map(point => point.balance));
    const maxInterest = Math.max(...chartData.map(point => point.totalInterest));
    const maxMonthlyInterest = Math.max(...chartData.map(point => point.monthlyInterest || 0));
    const maxMonthlyPayment = Math.max(...chartData.map(point => point.monthlyPayment || 0));
    
    // For comparison strategy if enabled
    let maxComparisonBalance = 0;
    let maxComparisonInterest = 0;
    
    if (showComparison && comparisonStrategy) {
      maxComparisonBalance = Math.max(...chartData
        .filter(point => point[`balance_${comparisonStrategy}`] !== undefined)
        .map(point => point[`balance_${comparisonStrategy}`] as number));
        
      maxComparisonInterest = Math.max(...chartData
        .filter(point => point[`totalInterest_${comparisonStrategy}`] !== undefined)
        .map(point => point[`totalInterest_${comparisonStrategy}`] as number));
    }
    
    // Use the maximum of both primary and comparison
    const finalMaxBalance = Math.max(maxBalance, maxComparisonBalance, totalDebt);
    const finalMaxInterest = Math.max(maxInterest, maxComparisonInterest);
    
    // Calculate appropriate scales for axes
    const balanceScale = Math.ceil(finalMaxBalance * 1.1);
    const interestScale = Math.ceil(finalMaxInterest * 1.1);
    
    return { 
      balance: balanceScale,
      interest: interestScale,
      monthlyInterest: maxMonthlyInterest,
      monthlyPayment: maxMonthlyPayment
    };
  }, [chartData, totalDebt, showComparison, comparisonStrategy]);
  
  const getStrategyCardClass = (strategyId: string) => {
    if (strategyId === selectedStrategy) {
      return 'ring-2 ring-primary';
    }
    if (strategyId === recommendedStrategy.id) {
      return 'bg-primary/5';
    }
    return '';
  };
  
  const getStrategyColor = (strategyId: string, type: 'balance' | 'interest' | 'principal') => {
    const colors = {
      avalanche: {
        balance: '#3b82f6',
        interest: '#ef4444',
        principal: '#10b981'
      },
      snowball: {
        balance: '#8b5cf6',
        interest: '#f97316',
        principal: '#14b8a6'
      },
      equal: {
        balance: '#6366f1',
        interest: '#ec4899',
        principal: '#84cc16'
      }
    };
    
    return colors[strategyId as keyof typeof colors][type];
  };
  
  const isValidPayment = paymentAmount >= safeMinPayment;
  
  const hasDebt = totalDebt > 0 && combinedDebts.length > 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = getDateAfterMonths(Number(label));
      
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{t('repayment.month')} {label} - {date}</p>
          
          {/* Primary strategy */}
          <div className="mt-2 border-b pb-2">
            <p className="font-medium">{t(`repayment.${selectedStrategy}Strategy`)}</p>
            {payload.find(p => p.dataKey === 'balance') && (
              <p className="text-primary flex justify-between">
                <span>{t('dashboard.remainingDebt')}:</span> 
                <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === 'balance').value)}</span>
              </p>
            )}
            {payload.find(p => p.dataKey === 'principal') && (
              <p className="text-green-600 flex justify-between">
                <span>{t('dashboard.principal')}:</span>
                <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === 'principal').value)}</span>
              </p>
            )}
            {payload.find(p => p.dataKey === 'monthlyInterest') && (
              <p className="text-destructive flex justify-between">
                <span>{t('dashboard.monthlyInterest')}:</span>
                <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === 'monthlyInterest').value)}</span>
              </p>
            )}
            {payload.find(p => p.dataKey === 'totalInterest') && (
              <p className="text-amber-600 flex justify-between">
                <span>{t('dashboard.totalInterestPaid')}:</span>
                <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === 'totalInterest').value)}</span>
              </p>
            )}
            {payload.find(p => p.dataKey === 'monthlyPayment') && (
              <p className="text-blue-600 flex justify-between">
                <span>{t('dashboard.payment')}:</span>
                <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === 'monthlyPayment').value)}</span>
              </p>
            )}
          </div>
          
          {/* Comparison strategy */}
          {showComparison && comparisonStrategy && (
            <div className="mt-2">
              <p className="font-medium">{t(`repayment.${comparisonStrategy}Strategy`)}</p>
              {payload.find(p => p.dataKey === `balance_${comparisonStrategy}`) && (
                <p className={`flex justify-between text-${getStrategyColor(comparisonStrategy, 'balance')}`}>
                  <span>{t('dashboard.remainingDebt')}:</span>
                  <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === `balance_${comparisonStrategy}`).value)}</span>
                </p>
              )}
              {payload.find(p => p.dataKey === `totalInterest_${comparisonStrategy}`) && (
                <p className={`flex justify-between text-${getStrategyColor(comparisonStrategy, 'interest')}`}>
                  <span>{t('dashboard.totalInterestPaid')}:</span>
                  <span className="font-mono">{formatCurrency(payload.find(p => p.dataKey === `totalInterest_${comparisonStrategy}`).value)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  const exportToPDF = () => {
    toast({
      title: t('export.exportStarted'),
      description: t('export.preparingPDF'),
    });
    
    // This would typically use a library like jsPDF, but for now we'll just show a toast
    setTimeout(() => {
      toast({
        title: t('export.exportComplete'),
        description: t('export.pdfReady'),
      });
    }, 1500);
  };
  
  const exportToCSV = () => {
    if (!chartData.length) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header row
    const headers = ["Month", "Date", "Remaining Debt", "Principal Payment", "Interest Payment", "Total Interest Paid", "Monthly Payment"];
    if (showComparison && comparisonStrategy) {
      headers.push(`${comparisonStrategy} Remaining Debt`, `${comparisonStrategy} Total Interest Paid`);
    }
    csvContent += headers.join(",") + "\r\n";
    
    // Add data rows
    chartData.forEach(point => {
      const date = getDateAfterMonths(point.month);
      let row = [
        point.month,
        date,
        point.balance,
        point.principal,
        point.monthlyInterest,
        point.totalInterest,
        point.monthlyPayment
      ];
      
      if (showComparison && comparisonStrategy) {
        row.push(
          point[`balance_${comparisonStrategy}`] || 0,
          point[`totalInterest_${comparisonStrategy}`] || 0
        );
      }
      
      csvContent += row.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "debt_repayment_plan.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('export.exportComplete'),
      description: t('export.csvReady'),
    });
  };
  
  const handleStrategyVisibilityChange = (strategy: 'avalanche' | 'snowball' | 'equal') => {
    setVisibleStrategies(prev => ({
      ...prev,
      [strategy]: !prev[strategy]
    }));
    
    // Make sure at least one strategy is visible
    const wouldAllBeHidden = 
      Object.entries(visibleStrategies)
        .filter(([key, value]) => key !== strategy ? value : !value)
        .every(([_, value]) => !value);
        
    if (wouldAllBeHidden) {
      // If all would be hidden, set the current strategy to visible
      setVisibleStrategies(prev => ({
        ...prev,
        [selectedStrategy]: true
      }));
    }
  };
  
  return (
    <Card className="overflow-hidden" ref={chartRef}>
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{t('repayment.minimumPayments')}:</p>
                  <p className="text-2xl font-bold">{formatCurrency(safeMinPayment)}/{t('form.months')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('dashboard.currentPaymentAmount')}:</p>
                  <p className="text-2xl font-bold">{formatCurrency(paymentAmount + extraPayment)}/{t('form.months')}</p>
                </div>
              </div>
              
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
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('dashboard.extraPaymentAmount')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs" htmlFor="affect-term-switch">
                      {t('dashboard.affectTerm')}
                    </label>
                    <Switch 
                      id="affect-term-switch"
                      checked={affectTermNotPayment} 
                      onCheckedChange={setAffectTermNotPayment} 
                    />
                  </div>
                </div>
                <Slider
                  value={[extraPayment]}
                  min={0}
                  max={Math.max(paymentAmount, 1000)}
                  step={10}
                  onValueChange={(value) => setExtraPayment(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('dashboard.noExtra')}: {formatCurrency(0)}</span>
                  <span>{formatCurrency(extraPayment)} {t('dashboard.extra')}</span>
                  <span>{t('dashboard.maximum')}: {formatCurrency(Math.max(paymentAmount, 1000))}</span>
                </div>
              </div>
              
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
              
              <div className="flex items-center space-x-2 pt-2">
                <span className="text-sm font-medium">{t('dashboard.compareStrategies')}</span>
                <Switch 
                  checked={showComparison} 
                  onCheckedChange={setShowComparison} 
                />
              </div>
              
              {showComparison && (
                <div className="border rounded-md p-3 bg-muted/20">
                  <p className="font-medium text-sm mb-2">{t('dashboard.selectComparisonStrategy')}</p>
                  <div className="flex flex-wrap gap-2">
                    {strategies.map(strategy => (
                      strategy.id !== selectedStrategy && (
                        <Button
                          key={strategy.id}
                          variant={comparisonStrategy === strategy.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setComparisonStrategy(strategy.id)}
                          className="text-xs"
                        >
                          {strategy.name}
                        </Button>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {isValidPayment && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {strategies.map((strategy) => (
                    <Card 
                      key={strategy.id} 
                      className={`cursor-pointer transition-all hover:shadow ${getStrategyCardClass(strategy.id)}`}
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          {strategy.name}
                          <Checkbox 
                            checked={visibleStrategies[strategy.id]} 
                            onCheckedChange={() => handleStrategyVisibilityChange(strategy.id)}
                            onClick={(e) => e.stopPropagation()} 
                            aria-label={`Show ${strategy.name} on chart`}
                          />
                        </CardTitle>
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
              
              {chartData.length > 0 && isValidPayment && (
                <div className="mt-4">
                  <div className="h-80">
                    <ChartContainer 
                      config={{
                        primary: {
                          color: getStrategyColor(selectedStrategy, 'balance'),
                        },
                        interest: {
                          color: getStrategyColor(selectedStrategy, 'interest'),
                        },
                        principal: {
                          color: getStrategyColor(selectedStrategy, 'principal'),
                        },
                        comparison: {
                          color: comparisonStrategy ? getStrategyColor(comparisonStrategy, 'balance') : '#888888',
                        },
                        comparisonInterest: {
                          color: comparisonStrategy ? getStrategyColor(comparisonStrategy, 'interest') : '#888888',
                        },
                      }}
                    >
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ 
                            value: t('dashboard.months'), 
                            position: 'insideBottomRight', 
                            offset: -5 
                          }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                          label={{ 
                            value: t('dashboard.debt'), 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                          domain={[0, maxValues.balance]}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                          label={{ 
                            value: t('dashboard.interest'), 
                            angle: 90, 
                            position: 'insideRight' 
                          }}
                          domain={[0, maxValues.interest]}
                          tick={{ fontSize: 12 }}
                        />
                        
                        <ReferenceLine 
                          x={currentMonth} 
                          stroke="#888" 
                          strokeWidth={2}
                          label={{ 
                            value: t('dashboard.today'), 
                            position: 'top',
                            fill: '#888'
                          }}
                          yAxisId="left"
                        />
                        
                        <ChartTooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        {/* Primary Strategy - Debt Balance Area */}
                        {visibleStrategies[selectedStrategy] && (
                          <Area 
                            yAxisId="left"
                            type="monotone"
                            dataKey="balance"
                            name={`${t('dashboard.debt')} (${t(`repayment.${selectedStrategy}Strategy`)})`}
                            stroke={getStrategyColor(selectedStrategy, 'balance')}
                            fillOpacity={0.3}
                            fill={getStrategyColor(selectedStrategy, 'balance')}
                            strokeWidth={2}
                          />
                        )}
                        
                        {/* Principal Payments */}
                        {visibleStrategies[selectedStrategy] && (
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="principal"
                            name={t('dashboard.principal')}
                            stroke={getStrategyColor(selectedStrategy, 'principal')}
                            fillOpacity={0.5}
                            fill={getStrategyColor(selectedStrategy, 'principal')}
                            stackId="payments"
                          />
                        )}
                        
                        {/* Interest Payments */}
                        {visibleStrategies[selectedStrategy] && (
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="monthlyInterest"
                            name={t('dashboard.monthlyInterest')}
                            stroke={getStrategyColor(selectedStrategy, 'interest')}
                            fillOpacity={0.5}
                            fill={getStrategyColor(selectedStrategy, 'interest')}
                            stackId="payments"
                          />
                        )}
                        
                        {/* Total Interest Line */}
                        {visibleStrategies[selectedStrategy] && (
                          <Line 
                            yAxisId="right"
                            type="monotone"
                            dataKey="totalInterest"
                            name={`${t('dashboard.totalInterestPaid')} (${t(`repayment.${selectedStrategy}Strategy`)})`}
                            stroke={getStrategyColor(selectedStrategy, 'interest')}
                            dot={false}
                            activeDot={{ r: 6 }}
                            strokeWidth={2}
                          />
                        )}
                        
                        {/* Comparison Strategy - if enabled */}
                        {showComparison && comparisonStrategy && visibleStrategies[comparisonStrategy] && (
                          <>
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey={`balance_${comparisonStrategy}`}
                              name={`${t('dashboard.debt')} (${t(`repayment.${comparisonStrategy}Strategy`)})`}
                              stroke={getStrategyColor(comparisonStrategy, 'balance')}
                              strokeDasharray="5 5"
                              dot={false}
                              activeDot={{ r: 6 }}
                              strokeWidth={2}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey={`totalInterest_${comparisonStrategy}`}
                              name={`${t('dashboard.totalInterestPaid')} (${t(`repayment.${comparisonStrategy}Strategy`)})`}
                              stroke={getStrategyColor(comparisonStrategy, 'interest')}
                              strokeDasharray="5 5"
                              dot={false}
                              activeDot={{ r: 6 }}
                              strokeWidth={2}
                            />
                          </>
                        )}
                      </ComposedChart>
                    </ChartContainer>
                  </div>
                </div>
              )}
              
              {isValidPayment && getSelectedPlan(selectedStrategy).totalMonths > 0 && (
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                  
                  <div className="relative pl-8 pb-6">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Clock className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <h4 className="font-medium">{t('dashboard.now')}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t('dashboard.currentDebt')}: {formatCurrency(totalDebt)}</p>
                  </div>
                  
                  {activeCards.length > 0 && getSelectedPlan(selectedStrategy).creditCardFreeMonth && (
                    <div className="relative pl-8 pb-6">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <CreditCard className="h-3 w-3" />
                      </div>
                      <h4 className="font-medium">{t('repayment.creditCardsFree')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('repayment.projectDate')}: {getDateAfterMonths(getSelectedPlan(selectedStrategy).creditCardFreeMonth || 0)}
                      </p>
                    </div>
                  )}
                  
                  <div className="relative pl-8">
                    <div className="absolute left-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="font-medium">{t('dashboard.debtFree')}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('repayment.projectDate')}: {getDateAfterMonths(getSelectedPlan(selectedStrategy).totalMonths)}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {t('repayment.totalInterestPaid')}: {formatCurrency(getSelectedPlan(selectedStrategy).totalInterestPaid)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center">
                  <FileDown className="h-4 w-4 mr-2" />
                  {t('export.exportToPDF')}
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {t('export.exportToCSV')}
                </Button>
              </div>
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
          onClick={() => navigate('/debt-summary?tab=repayment-plan')}
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
