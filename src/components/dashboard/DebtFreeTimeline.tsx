
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

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
}

type RepaymentStrategy = 'annuity' | 'equal-principal';

// Improved function to calculate a realistic payment schedule
const calculatePaymentSchedule = (
  loans: Loan[], 
  cards: CreditCard[], 
  monthlyBudget: number, 
  extraPayment: number = 0,
  strategy: RepaymentStrategy = 'annuity'
) => {
  // Validate inputs
  if (!loans || !cards || monthlyBudget <= 0) {
    console.warn('Invalid inputs for payment schedule calculation');
    return [];
  }

  const effectiveBudget = Math.max(monthlyBudget + extraPayment, 0);
  
  // Calculate minimum payments for all debts
  const loanMinPayments = loans.reduce((sum, loan) => {
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    const termMonths = loan.termYears * 12;
    
    let minPayment;
    if (strategy === 'annuity') {
      // Annuity formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      minPayment = loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths) / 
                   (Math.pow(1 + monthlyInterestRate, termMonths) - 1);
    } else {
      // Equal principal: principal + interest
      const principalPayment = loan.amount / termMonths;
      const interestPayment = loan.amount * monthlyInterestRate;
      minPayment = principalPayment + interestPayment;
    }
    
    return sum + minPayment;
  }, 0);
  
  const cardMinPayments = cards.reduce((sum, card) => {
    const percentPayment = card.balance * (card.minPaymentPercent / 100);
    return sum + Math.max(card.minPayment, percentPayment);
  }, 0);
  
  const totalMinPayment = loanMinPayments + cardMinPayments;
  
  // Check if budget is sufficient
  if (effectiveBudget < totalMinPayment) {
    console.warn(`Budget (${effectiveBudget}) is insufficient for minimum payments (${totalMinPayment})`);
    // Return some basic data even in error case
    return [
      {
        month: 1,
        remainingDebt: loans.reduce((sum, loan) => sum + loan.amount, 0) + 
                       cards.reduce((sum, card) => sum + card.balance, 0),
        payment: effectiveBudget,
        principal: 0,
        interest: totalMinPayment,
        cumulativePrincipal: 0,
        cumulativeInterest: totalMinPayment
      }
    ];
  }
  
  // Initialize the simulation
  let remainingDebt = loans.reduce((sum, loan) => sum + loan.amount, 0) + 
                     cards.reduce((sum, card) => sum + card.balance, 0);
  
  // Create deep copies to avoid modifying the originals
  const simulatedLoans = loans.map(loan => ({...loan}));
  const simulatedCards = cards.map(card => ({...card}));
  
  const months = [];
  const maxMonths = 600; // 50 years should be enough for any realistic debt
  let month = 0;
  
  let totalPrincipal = 0;
  let totalInterest = 0;
  
  // Simulate the repayment
  while (remainingDebt > 1 && month < maxMonths) {
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    let availableBudget = effectiveBudget;
    
    // Process credit cards first (typically higher interest)
    for (const card of simulatedCards) {
      if (card.balance <= 0) continue;
      
      const monthlyInterestRate = card.apr / 100 / 12;
      const interestForMonth = card.balance * monthlyInterestRate;
      
      // Minimum payment for this card
      const percentPayment = card.balance * (card.minPaymentPercent / 100);
      const minPayment = Math.max(card.minPayment, percentPayment);
      
      // Determine actual payment
      const actualPayment = Math.min(
        // Either pay full balance + interest, minimum payment, or what's left in budget
        card.fullPayment ? card.balance + interestForMonth : minPayment,
        card.balance + interestForMonth, 
        availableBudget
      );
      
      // Calculate how much goes to interest vs. principal
      const principalPayment = Math.max(0, actualPayment - interestForMonth);
      const interestPayment = Math.min(interestForMonth, actualPayment);
      
      // Update balances and totals
      card.balance = Math.max(0, card.balance - principalPayment);
      availableBudget -= actualPayment;
      monthlyInterest += interestPayment;
      monthlyPrincipal += principalPayment;
      
      // If we're out of budget, break
      if (availableBudget <= 0) break;
    }
    
    // Then process loans
    for (const loan of simulatedLoans) {
      if (loan.amount <= 0 || availableBudget <= 0) continue;
      
      const monthlyInterestRate = loan.interestRate / 100 / 12;
      const interestForMonth = loan.amount * monthlyInterestRate;
      
      // Calculate minimum payment based on strategy
      let minPayment;
      if (strategy === 'annuity') {
        const remainingTermMonths = loan.termYears * 12 - month;
        if (remainingTermMonths <= 0) {
          minPayment = loan.amount + interestForMonth;
        } else {
          minPayment = loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, remainingTermMonths) / 
                     (Math.pow(1 + monthlyInterestRate, remainingTermMonths) - 1);
        }
      } else {
        const principalPayment = loan.amount / (loan.termYears * 12);
        minPayment = principalPayment + interestForMonth;
      }
      
      // Determine actual payment
      const actualPayment = Math.min(
        minPayment,
        loan.amount + interestForMonth, 
        availableBudget
      );
      
      // Calculate how much goes to interest vs. principal
      const principalPayment = Math.max(0, actualPayment - interestForMonth);
      const interestPayment = Math.min(interestForMonth, actualPayment);
      
      // Update balances and totals
      loan.amount = Math.max(0, loan.amount - principalPayment);
      availableBudget -= actualPayment;
      monthlyInterest += interestPayment;
      monthlyPrincipal += principalPayment;
    }
    
    // Calculate remaining debt
    remainingDebt = simulatedLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
                   simulatedCards.reduce((sum, card) => sum + card.balance, 0);
    
    // Update cumulative totals
    totalPrincipal += monthlyPrincipal;
    totalInterest += monthlyInterest;
    
    // Add to monthly data
    months.push({
      month: month + 1,
      remainingDebt,
      payment: monthlyPrincipal + monthlyInterest,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      cumulativePrincipal: totalPrincipal,
      cumulativeInterest: totalInterest
    });
    
    month++;
    
    // If we've paid off the debt, break
    if (remainingDebt < 1) break;
  }
  
  return months;
};

const DebtFreeTimeline: React.FC<DebtFreeTimelineProps> = ({
  totalDebt,
  formattedDebtFreeDate,
  activeLoans,
  activeCards,
  monthlyBudget
}) => {
  const { t, locale } = useLanguage();
  const [extraPayment, setExtraPayment] = useState(0);
  const [strategy, setStrategy] = useState<RepaymentStrategy>('annuity');
  const [comparisonStrategy, setComparisonStrategy] = useState<RepaymentStrategy | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate payment schedules
  const paymentSchedule = calculatePaymentSchedule(
    activeLoans, 
    activeCards, 
    monthlyBudget, 
    extraPayment,
    strategy
  );
  
  const comparisonSchedule = showComparison && comparisonStrategy 
    ? calculatePaymentSchedule(
        activeLoans, 
        activeCards, 
        monthlyBudget, 
        extraPayment,
        comparisonStrategy
      )
    : [];
  
  // Format date helper function
  const formatDate = (month: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString(locale || 'fi-FI', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  // Prepare data for chart
  const chartData = paymentSchedule.map((month, i) => {
    const comparisonMonth = comparisonSchedule[i];
    
    return {
      month: month.month,
      date: formatDate(month.month - 1),
      // Primary strategy data
      "RemainingDebt": month.remainingDebt,
      "Principal": month.principal,
      "Interest": month.interest,
      // Comparison strategy data (if available)
      ...(showComparison && comparisonMonth ? {
        [`RemainingDebt_Comparison`]: comparisonMonth.remainingDebt,
        [`Principal_Comparison`]: comparisonMonth.principal,
        [`Interest_Comparison`]: comparisonMonth.interest,
      } : {})
    };
  });
  
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
    const headers = ['Kuukausi', 'Päivämäärä', 'Jäljellä oleva velka', 'Kuukausimaksu', 'Pääoma', 'Korko'];
    
    const csvContent = [
      headers.join(','),
      ...paymentSchedule.map(month => 
        [
          month.month,
          formatDate(month.month - 1),
          month.remainingDebt.toFixed(2),
          (month.principal + month.interest).toFixed(2),
          month.principal.toFixed(2),
          month.interest.toFixed(2)
        ].join(',')
      )
    ].join('\n');
    
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'velaton-aikajana.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ensure we have valid data before rendering
  const hasValidData = paymentSchedule && paymentSchedule.length > 0;
  const currentMonth = 1;
  
  // Calculate summaries for the stats display
  const totalMonths = hasValidData ? paymentSchedule.length : 0;
  const totalInterestPaid = hasValidData ? 
    paymentSchedule.reduce((sum, month) => sum + month.interest, 0) : 0;
  const yearsPart = Math.floor(totalMonths / 12);
  const monthsPart = totalMonths % 12;
  
  // Compare strategies if showing comparison
  const comparisonTotalMonths = showComparison && comparisonSchedule.length > 0 ? 
    comparisonSchedule.length : 0;
  const comparisonTotalInterest = showComparison && comparisonSchedule.length > 0 ? 
    comparisonSchedule.reduce((sum, month) => sum + month.interest, 0) : 0;
  
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
              aria-label="Vie PDF-muodossa"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('export.exportToPDF') || 'Vie PDF'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              aria-label="Vie CSV-muodossa"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('export.exportToCSV') || 'Vie CSV'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {t('dashboard.timelineDescription') || 'Näe miten velkasi kehittyy ajan myötä'}
        </CardDescription>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="extra-payment">Lisämaksu kuukaudessa</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="extra-payment"
                min={0}
                max={2000}
                step={50}
                value={[extraPayment]}
                onValueChange={(values) => setExtraPayment(values[0])}
                aria-label="Lisämaksu kuukaudessa"
                className="flex-1"
              />
              <span className="w-20 text-right font-medium">{formatCurrency(extraPayment)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="strategy-select">Takaisinmaksustrategia</Label>
              <Tabs
                value={strategy}
                onValueChange={(value) => setStrategy(value as RepaymentStrategy)}
                className="mt-1"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="annuity">Annuiteetti</TabsTrigger>
                  <TabsTrigger value="equal-principal">Tasalyhennys</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="comparison-toggle">Vertaa strategioita</Label>
                <Button 
                  variant={showComparison ? "secondary" : "outline"} 
                  size="sm"
                  onClick={() => {
                    if (showComparison) {
                      setShowComparison(false);
                    } else {
                      setShowComparison(true);
                      setComparisonStrategy(strategy === 'annuity' ? 'equal-principal' : 'annuity');
                    }
                  }}
                >
                  {showComparison ? 'Piilota vertailu' : 'Näytä vertailu'}
                </Button>
              </div>
              
              {showComparison && comparisonStrategy && (
                <div className="mt-1 text-sm text-muted-foreground">
                  Vertaillaan: <span className="font-medium">{strategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}</span> vs <span className="font-medium">{comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}</span>
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
              <div className="text-sm text-muted-foreground mb-1">Nykyinen velka</div>
              <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">Arvioitu velaton päivä</div>
              <div className="text-2xl font-bold">{hasValidData ? `${totalMonths} kuukautta` : formattedDebtFreeDate}</div>
              <div className="text-xs text-muted-foreground">{yearsPart} vuotta {monthsPart} kuukautta</div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">Maksettava korkosumma</div>
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
                    value: 'Kuukaudet', 
                    position: 'insideBottom', 
                    offset: -5 
                  }} 
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `${formatCurrency(value)}`}
                  label={{ 
                    value: 'Velka', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${formatCurrency(value)}`}
                  label={{ 
                    value: 'Maksu', 
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
                    if (name === 'RemainingDebt') translatedName = 'Jäljellä oleva velka';
                    else if (name === 'Principal') translatedName = 'Pääoma';
                    else if (name === 'Interest') translatedName = 'Korko';
                    else if (name === 'RemainingDebt_Comparison') translatedName = `Jäljellä oleva velka (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`;
                    else if (name === 'Principal_Comparison') translatedName = `Pääoma (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`;
                    else if (name === 'Interest_Comparison') translatedName = `Korko (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`;
                    
                    return [formattedValue, translatedName];
                  }}
                  labelFormatter={(label) => `Päivämäärä: ${label}`}
                />
                <Legend />
                
                <ReferenceLine 
                  x={currentMonth} 
                  stroke="#ff0000" 
                  label={{ 
                    value: "Tänään", 
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
                  name="Jäljellä oleva velka"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  yAxisId="left"
                />
                <Area 
                  type="monotone" 
                  dataKey="Principal" 
                  name="Pääoma"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  yAxisId="right"
                />
                <Area 
                  type="monotone" 
                  dataKey="Interest" 
                  name="Korko"
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
                      name={`Jäljellä oleva velka (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      yAxisId="left"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Principal_Comparison"
                      name={`Pääoma (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      yAxisId="right"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Interest_Comparison"
                      name={`Korko (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
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
              <h4 className="text-sm font-medium mb-2">Kokonaisvelka nyt</h4>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">Kuukausimaksu</h4>
              <p className="text-2xl font-bold">{formatCurrency(monthlyBudget + extraPayment)}</p>
              {extraPayment > 0 && (
                <p className="text-xs text-muted-foreground">
                  Sisältää lisämaksun: {formatCurrency(extraPayment)}
                </p>
              )}
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">Maksuaika</h4>
              <p className="text-2xl font-bold">{totalMonths} kuukautta</p>
              <p className="text-xs text-muted-foreground">
                {yearsPart} vuotta {monthsPart} kuukautta
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">Korkoa maksetaan</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(totalInterestPaid)}
              </p>
            </div>
          </div>
          
          {showComparison && comparisonStrategy && comparisonSchedule.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Strategiavertailu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">{strategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Maksuaika:</span>
                      <span className="font-medium">{totalMonths} kuukautta</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Korkomaksut:</span>
                      <span className="font-medium">{formatCurrency(totalInterestPaid)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Alkumaksu:</span>
                      <span className="font-medium">
                        {formatCurrency(hasValidData ? 
                          paymentSchedule[0].principal + paymentSchedule[0].interest : 0)}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">{comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Maksuaika:</span>
                      <span className="font-medium">{comparisonTotalMonths} kuukautta</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Korkomaksut:</span>
                      <span className="font-medium">{formatCurrency(comparisonTotalInterest)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Alkumaksu:</span>
                      <span className="font-medium">
                        {formatCurrency(comparisonSchedule.length > 0 ? 
                          comparisonSchedule[0].principal + comparisonSchedule[0].interest : 0)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium">
                  {strategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'} vs {comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}:
                </p>
                <p>
                  {totalMonths < comparisonTotalMonths 
                    ? `${Math.abs(totalMonths - comparisonTotalMonths)} kuukautta nopeampi maksuaika` 
                    : totalMonths > comparisonTotalMonths
                      ? `${Math.abs(totalMonths - comparisonTotalMonths)} kuukautta hitaampi maksuaika`
                      : "Sama maksuaika molemmilla strategioilla"
                  }
                </p>
                <p>
                  {totalInterestPaid < comparisonTotalInterest
                    ? `Säästät ${formatCurrency(Math.abs(comparisonTotalInterest - totalInterestPaid))} korkomaksuissa` 
                    : `Maksat ${formatCurrency(Math.abs(totalInterestPaid - comparisonTotalInterest))} enemmän korkoja`
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
