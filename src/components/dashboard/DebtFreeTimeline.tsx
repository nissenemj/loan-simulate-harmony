
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CornerDownRight, ArrowRight, Calendar, Download, FileText } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/utils/loanCalculations';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { useLanguage } from '@/contexts/LanguageContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DebtItem, PrioritizationMethod } from '@/utils/repayment/types';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
}

// Convert loans and credit cards to debt items for repayment calculations
const convertToDebtItems = (loans: Loan[], cards: CreditCard[]): DebtItem[] => {
  const debtItems: DebtItem[] = [];
  
  // Convert loans to debt items
  loans.forEach(loan => {
    debtItems.push({
      id: loan.id,
      name: loan.name,
      balance: loan.amount,
      interestRate: loan.interestRate,
      minPayment: loan.minPayment || (loan.amount / (loan.termYears * 12)),
      type: 'loan',
      isActive: loan.isActive
    });
  });
  
  // Convert credit cards to debt items
  cards.forEach(card => {
    const percentPayment = card.balance * (card.minPaymentPercent / 100);
    const minPayment = Math.max(card.minPayment, percentPayment);
    
    debtItems.push({
      id: card.id,
      name: card.name,
      balance: card.balance,
      interestRate: card.apr,
      minPayment: minPayment,
      type: 'credit-card',
      isActive: card.isActive
    });
  });
  
  return debtItems;
};

type RepaymentStrategy = 'avalanche' | 'snowball' | 'equal';

const DebtFreeTimeline: React.FC<DebtFreeTimelineProps> = ({
  totalDebt,
  formattedDebtFreeDate,
  activeLoans,
  activeCards,
  monthlyBudget
}) => {
  const { t, locale } = useLanguage();
  const [extraPayment, setExtraPayment] = useState(0);
  const [strategy, setStrategy] = useState<RepaymentStrategy>('avalanche');
  const [comparisonStrategy, setComparisonStrategy] = useState<RepaymentStrategy | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Create debt items from loans and credit cards
  const debtItems = convertToDebtItems(activeLoans, activeCards);
  
  // Generate repayment plans for all strategies
  const generatePlans = () => {
    // Generate plans for each strategy with the current extra payment
    const avalanchePlan = generateRepaymentPlan(
      debtItems,
      monthlyBudget + extraPayment,
      'avalanche',
      false // not equally distributed
    );
    
    const snowballPlan = generateRepaymentPlan(
      debtItems,
      monthlyBudget + extraPayment,
      'snowball',
      false // not equally distributed
    );
    
    const equalPlan = generateRepaymentPlan(
      debtItems,
      monthlyBudget + extraPayment,
      'avalanche', // Method doesn't matter for equal distribution
      true // equally distributed
    );
    
    return { avalanchePlan, snowballPlan, equalPlan };
  };
  
  // Get the active plan based on current strategy
  const getActivePlan = (plans: any, selectedStrategy: RepaymentStrategy) => {
    switch (selectedStrategy) {
      case 'avalanche':
        return plans.avalanchePlan;
      case 'snowball':
        return plans.snowballPlan;
      case 'equal':
        return plans.equalPlan;
      default:
        return plans.avalanchePlan;
    }
  };
  
  // Format date helper function
  const formatDate = (month: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString(locale || 'fi-FI', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  // Prepare data for chart - use repayment plan timeline
  const prepareChartData = (activePlan: any, comparisonPlan: any | null, showComparison: boolean) => {
    if (!activePlan.isViable || activePlan.timeline.length === 0) {
      return [];
    }
    
    return activePlan.timeline.map((month: any, i: number) => {
      const comparisonMonth = comparisonPlan && comparisonPlan.isViable && i < comparisonPlan.timeline.length
        ? comparisonPlan.timeline[i]
        : null;
      
      // Extract data from the active plan
      const dataPoint = {
        month: month.month,
        date: formatDate(month.month - 1),
        "RemainingDebt": month.totalRemaining,
        "Principal": month.debts.reduce((sum: number, debt: any) => sum + (debt.payment - debt.interestPaid), 0),
        "Interest": month.totalInterestPaid,
      };
      
      // Add comparison data if available
      if (showComparison && comparisonMonth) {
        return {
          ...dataPoint,
          "RemainingDebt_Comparison": comparisonMonth.totalRemaining,
          "Principal_Comparison": comparisonMonth.debts.reduce((sum: number, debt: any) => sum + (debt.payment - debt.interestPaid), 0),
          "Interest_Comparison": comparisonMonth.totalInterestPaid,
        };
      }
      
      return dataPoint;
    });
  };
  
  // Effect to recalculate plans when inputs change
  useEffect(() => {
    const plans = generatePlans();
    const activePlan = getActivePlan(plans, strategy);
    const comparisonPlan = comparisonStrategy ? getActivePlan(plans, comparisonStrategy) : null;
    
    const newChartData = prepareChartData(activePlan, comparisonPlan, showComparison);
    setChartData(newChartData);
    
    // Debug log to help troubleshooting
    console.log('Updated chart data with extraPayment:', extraPayment, {
      totalMonths: activePlan.totalMonths,
      totalInterestPaid: activePlan.totalInterestPaid,
      dataPoints: newChartData.length
    });
  }, [extraPayment, strategy, comparisonStrategy, showComparison, monthlyBudget, debtItems]);
  
  // Export to PDF
  const exportToPDF = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('velaton-aikajana.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };
  
  // Export to CSV 
  const exportToCSV = () => {
    const plans = generatePlans();
    const activePlan = getActivePlan(plans, strategy);
    
    if (!activePlan.isViable || activePlan.timeline.length === 0) {
      return;
    }
    
    const headers = ['Kuukausi', 'Päivämäärä', 'Jäljellä oleva velka', 'Kuukausimaksu', 'Pääoma', 'Korko'];
    
    const csvContent = [
      headers.join(','),
      ...activePlan.timeline.map((month: any) => {
        const principal = month.debts.reduce((sum: number, debt: any) => sum + (debt.payment - debt.interestPaid), 0);
        return [
          month.month,
          formatDate(month.month - 1),
          month.totalRemaining.toFixed(2),
          (principal + month.totalInterestPaid).toFixed(2),
          principal.toFixed(2),
          month.totalInterestPaid.toFixed(2)
        ].join(',');
      })
    ].join('\n');
    
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'velaton-aikajana.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate all plans for current parameters
  const plans = generatePlans();
  const activePlan = getActivePlan(plans, strategy);
  const comparisonPlan = comparisonStrategy ? getActivePlan(plans, comparisonStrategy) : null;

  // Ensure we have valid data before rendering
  const hasValidData = activePlan.isViable && activePlan.timeline.length > 0;
  const currentMonth = 1;
  
  // Get the summary statistics from the repayment plan
  const totalMonths = hasValidData ? activePlan.totalMonths : 0;
  const totalInterestPaid = hasValidData ? activePlan.totalInterestPaid : 0;
  const yearsPart = Math.floor(totalMonths / 12);
  const monthsPart = totalMonths % 12;
  
  // Compare strategies if showing comparison
  const comparisonTotalMonths = (showComparison && comparisonPlan && comparisonPlan.isViable) ? 
    comparisonPlan.totalMonths : 0;
  const comparisonTotalInterest = (showComparison && comparisonPlan && comparisonPlan.isViable) ? 
    comparisonPlan.totalInterestPaid : 0;
  
  // Handle strategy change
  const handleStrategyChange = (newStrategy: RepaymentStrategy) => {
    if (newStrategy === strategy) return;
    
    setStrategy(newStrategy);
    
    // If comparison is visible, make sure we're not comparing the same strategy
    if (showComparison && comparisonStrategy === newStrategy) {
      // Find a different strategy to show as comparison
      const strategies: RepaymentStrategy[] = ['avalanche', 'snowball', 'equal'];
      const otherStrategies = strategies.filter(s => s !== newStrategy);
      setComparisonStrategy(otherStrategies[0]);
    }
  };
  
  const getStrategyName = (strat: RepaymentStrategy): string => {
    switch (strat) {
      case 'avalanche':
        return t('dashboard.avalancheStrategy') || 'Lumivyöry';
      case 'snowball':
        return t('dashboard.snowballStrategy') || 'Lumipallo';
      case 'equal':
        return t('dashboard.equalStrategy') || 'Tasainen jakelu';
      default:
        return strat;
    }
  };
  
  // Handle extra payment change
  const handleExtraPaymentChange = (values: number[]) => {
    setExtraPayment(values[0]);
    console.log('Extra payment changed to:', values[0]);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.debtFreeTimeline')}</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPDF}
              aria-label={t('dashboard.exportToPDF') || 'Vie PDF-muodossa'}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('dashboard.exportToPDF') || 'Vie PDF'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              aria-label={t('dashboard.exportToCSV') || 'Vie CSV-muodossa'}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('dashboard.exportToCSV') || 'Vie CSV'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {t('dashboard.timelineDescription') || 'Näe miten velkasi kehittyy ajan myötä'}
        </CardDescription>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="extra-payment">{t('dashboard.extraPayment') || 'Lisämaksu kuukaudessa'}</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="extra-payment"
                min={0}
                max={2000}
                step={50}
                value={[extraPayment]}
                onValueChange={handleExtraPaymentChange}
                aria-label={t('dashboard.extraPayment') || 'Lisämaksu kuukaudessa'}
                className="flex-1"
              />
              <span className="w-20 text-right font-medium">{formatCurrency(extraPayment)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="strategy-select">{t('dashboard.repaymentStrategy') || 'Takaisinmaksustrategia'}</Label>
              <Tabs
                value={strategy}
                onValueChange={(value) => handleStrategyChange(value as RepaymentStrategy)}
                className="mt-1"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="avalanche">{t('dashboard.avalancheStrategy') || 'Lumivyöry'}</TabsTrigger>
                  <TabsTrigger value="snowball">{t('dashboard.snowballStrategy') || 'Lumipallo'}</TabsTrigger>
                  <TabsTrigger value="equal">{t('dashboard.equalStrategy') || 'Tasainen'}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="comparison-toggle">{t('dashboard.compareStrategies') || 'Vertaa strategioita'}</Label>
                <Button 
                  variant={showComparison ? "secondary" : "outline"} 
                  size="sm"
                  onClick={() => {
                    if (showComparison) {
                      setShowComparison(false);
                    } else {
                      setShowComparison(true);
                      // Choose a different strategy for comparison
                      const strategies: RepaymentStrategy[] = ['avalanche', 'snowball', 'equal'];
                      const otherStrategies = strategies.filter(s => s !== strategy);
                      setComparisonStrategy(otherStrategies[0]);
                    }
                  }}
                >
                  {showComparison ? 
                    (t('dashboard.hideComparison') || 'Piilota vertailu') : 
                    (t('dashboard.showComparison') || 'Näytä vertailu')}
                </Button>
              </div>
              
              {showComparison && comparisonStrategy && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {t('dashboard.comparing') || 'Vertaillaan'}: <span className="font-medium">{getStrategyName(strategy)}</span> vs <span className="font-medium">{getStrategyName(comparisonStrategy)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('dashboard.currentDebt') || 'Nykyinen velka'}</div>
              <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('dashboard.estimatedDebtFreeDate') || 'Arvioitu velaton päivä'}</div>
              <div className="text-2xl font-bold">{hasValidData ? `${totalMonths} ${t('form.months') || 'kuukautta'}` : formattedDebtFreeDate}</div>
              <div className="text-xs text-muted-foreground">{yearsPart} {t('table.years') || 'vuotta'} {monthsPart} {t('form.months') || 'kuukautta'}</div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('dashboard.totalInterestPaid') || 'Maksettava korkosumma'}</div>
              <div className="text-2xl font-bold">
                {hasValidData 
                  ? formatCurrency(totalInterestPaid)
                  : formatCurrency(totalDebt * 0.2)}
              </div>
            </div>
          </div>
          
          <div className="h-[400px]" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                stackOffset="none"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ 
                    value: t('table.months') || 'Kuukaudet', 
                    position: 'insideBottom', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `${formatCurrency(value)}`}
                  label={{ 
                    value: t('dashboard.debt') || 'Velka', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${formatCurrency(value)}`}
                  label={{ 
                    value: t('dashboard.payment') || 'Maksu', 
                    angle: 90, 
                    position: 'insideRight' 
                  }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    // Format based on the data type
                    const formattedValue = formatCurrency(Number(value));
                    
                    // Translate series names
                    let translatedName = name;
                    if (name === 'RemainingDebt') translatedName = t('dashboard.remainingDebt') || 'Jäljellä oleva velka';
                    else if (name === 'Principal') translatedName = t('dashboard.principal') || 'Pääoma';
                    else if (name === 'Interest') translatedName = t('dashboard.interest') || 'Korko';
                    else if (name === 'RemainingDebt_Comparison') {
                      translatedName = `${t('dashboard.remainingDebt') || 'Jäljellä oleva velka'} (${comparisonStrategy && getStrategyName(comparisonStrategy)})`;
                    }
                    else if (name === 'Principal_Comparison') {
                      translatedName = `${t('dashboard.principal') || 'Pääoma'} (${comparisonStrategy && getStrategyName(comparisonStrategy)})`;
                    }
                    else if (name === 'Interest_Comparison') {
                      translatedName = `${t('dashboard.interest') || 'Korko'} (${comparisonStrategy && getStrategyName(comparisonStrategy)})`;
                    }
                    
                    return [formattedValue, translatedName];
                  }}
                  labelFormatter={(label) => `${t('dashboard.date') || 'Päivämäärä'}: ${label}`}
                />
                <Legend />
                
                <ReferenceLine 
                  x={currentMonth} 
                  stroke="#ff0000" 
                  label={{ 
                    value: t('dashboard.today') || "Tänään", 
                    position: "top",
                    fill: "#ff0000"
                  }} 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  yAxisId="left"
                />
                
                {/* Primary strategy */}
                <Area 
                  type="monotone" 
                  dataKey="RemainingDebt" 
                  name={t('dashboard.remainingDebt') || 'Jäljellä oleva velka'}
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  yAxisId="left"
                />
                <Area 
                  type="monotone" 
                  dataKey="Principal" 
                  name={t('dashboard.principal') || 'Pääoma'}
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  yAxisId="right"
                />
                <Area 
                  type="monotone" 
                  dataKey="Interest" 
                  name={t('dashboard.interest') || 'Korko'}
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                  yAxisId="right"
                />
                
                {/* Comparison strategy (if enabled) */}
                {showComparison && comparisonStrategy && (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="RemainingDebt_Comparison" 
                      name={`${t('dashboard.remainingDebt') || 'Jäljellä oleva velka'} (${getStrategyName(comparisonStrategy)})`}
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      yAxisId="left"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Principal_Comparison"
                      name={`${t('dashboard.principal') || 'Pääoma'} (${getStrategyName(comparisonStrategy)})`}
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      yAxisId="right"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Interest_Comparison"
                      name={`${t('dashboard.interest') || 'Korko'} (${getStrategyName(comparisonStrategy)})`}
                      stroke="#eab308" 
                      fill="#eab308" 
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      yAxisId="right"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">{t('dashboard.totalDebt') || 'Kokonaisvelka nyt'}</h4>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">{t('dashboard.monthlyPayment') || 'Kuukausimaksu'}</h4>
              <p className="text-2xl font-bold">{formatCurrency(monthlyBudget + extraPayment)}</p>
              {extraPayment > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.includesExtra') || 'Sisältää lisämaksun'}: {formatCurrency(extraPayment)}
                </p>
              )}
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">{t('dashboard.paymentDuration') || 'Maksuaika'}</h4>
              <p className="text-2xl font-bold">{totalMonths} {t('form.months') || 'kuukautta'}</p>
              <p className="text-xs text-muted-foreground">
                {yearsPart} {t('table.years') || 'vuotta'} {monthsPart} {t('form.months') || 'kuukautta'}
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">{t('dashboard.interestPaid') || 'Korkoa maksetaan'}</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(totalInterestPaid)}
              </p>
            </div>
          </div>
          
          {showComparison && comparisonStrategy && comparisonPlan && comparisonPlan.isViable && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{t('dashboard.strategyComparison') || 'Strategiavertailu'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">{getStrategyName(strategy)}</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>{t('dashboard.paymentDuration') || 'Maksuaika'}:</span>
                      <span className="font-medium">{totalMonths} {t('form.months') || 'kuukautta'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('dashboard.interestPayments') || 'Korkomaksut'}:</span>
                      <span className="font-medium">{formatCurrency(totalInterestPaid)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('dashboard.initialPayment') || 'Alkumaksu'}:</span>
                      <span className="font-medium">
                        {formatCurrency(hasValidData && activePlan.timeline.length > 0 ? 
                          activePlan.timeline[0].debts.reduce((sum: number, debt: any) => sum + debt.payment, 0) : 0)}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">{getStrategyName(comparisonStrategy)}</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>{t('dashboard.paymentDuration') || 'Maksuaika'}:</span>
                      <span className="font-medium">{comparisonTotalMonths} {t('form.months') || 'kuukautta'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('dashboard.interestPayments') || 'Korkomaksut'}:</span>
                      <span className="font-medium">{formatCurrency(comparisonTotalInterest)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('dashboard.initialPayment') || 'Alkumaksu'}:</span>
                      <span className="font-medium">
                        {formatCurrency(comparisonPlan.timeline.length > 0 ? 
                          comparisonPlan.timeline[0].debts.reduce((sum: number, debt: any) => sum + debt.payment, 0) : 0)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium">
                  {getStrategyName(strategy)} vs {getStrategyName(comparisonStrategy)}:
                </p>
                <p>
                  {totalMonths < comparisonTotalMonths 
                    ? `${Math.abs(totalMonths - comparisonTotalMonths)} ${t('form.months') || 'kuukautta'} ${t('dashboard.fasterPayoff') || 'nopeampi maksuaika'}` 
                    : totalMonths > comparisonTotalMonths
                      ? `${Math.abs(totalMonths - comparisonTotalMonths)} ${t('form.months') || 'kuukautta'} ${t('dashboard.slowerPayoff') || 'hitaampi maksuaika'}`
                      : t('dashboard.samePayoffTime') || "Sama maksuaika molemmilla strategioilla"
                  }
                </p>
                <p>
                  {totalInterestPaid < comparisonTotalInterest
                    ? `${t('dashboard.youSave') || 'Säästät'} ${formatCurrency(Math.abs(comparisonTotalInterest - totalInterestPaid))} ${t('dashboard.inInterest') || 'korkomaksuissa'}` 
                    : `${t('dashboard.youPay') || 'Maksat'} ${formatCurrency(Math.abs(totalInterestPaid - comparisonTotalInterest))} ${t('dashboard.moreInterest') || 'enemmän korkoja'}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtFreeTimeline;
