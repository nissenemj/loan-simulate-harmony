
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

// Function to calculate payment schedule for the active debts
const calculatePaymentSchedule = (
  loans: Loan[], 
  cards: CreditCard[], 
  monthlyBudget: number, 
  extraPayment: number = 0,
  strategy: RepaymentStrategy = 'annuity'
) => {
  // Calculate total minimum payments
  const loanMinPayments = loans.reduce((sum, loan) => {
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    const termMonths = loan.termYears * 12;
    
    let minPayment;
    if (strategy === 'annuity') {
      // Annuity formula (fixed total payment)
      minPayment = loan.amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths) / 
                   (Math.pow(1 + monthlyInterestRate, termMonths) - 1);
    } else {
      // Equal principal (principal is fixed, total payment decreases)
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
  const availableBudget = Math.max(monthlyBudget + extraPayment, totalMinPayment);
  
  // Calculate remaining balance over time
  let remainingDebt = loans.reduce((sum, loan) => sum + loan.amount, 0) + 
                     cards.reduce((sum, card) => sum + card.balance, 0);
  
  const months = [];
  const maxMonths = 360; // 30 years as safety cap
  let month = 0;
  
  // Initial debt and payment breakdown
  let totalPrincipal = 0;
  let totalInterest = 0;
  
  while (remainingDebt > 1 && month < maxMonths) {
    // For strategy comparison, we need to track interest and principal
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    
    // Calculate interest for loans
    loans.forEach(loan => {
      if (loan.amount <= 0) return;
      
      const monthlyInterestRate = loan.interestRate / 100 / 12;
      const interestForMonth = loan.amount * monthlyInterestRate;
      
      monthlyInterest += interestForMonth;
    });
    
    // Calculate interest for credit cards
    cards.forEach(card => {
      if (card.balance <= 0) return;
      
      const monthlyInterestRate = card.apr / 100 / 12;
      const interestForMonth = card.balance * monthlyInterestRate;
      
      monthlyInterest += interestForMonth;
    });
    
    // Calculate principal payment (total payment - interest)
    const effectivePayment = Math.min(availableBudget, remainingDebt + monthlyInterest);
    monthlyPrincipal = Math.max(0, effectivePayment - monthlyInterest);
    
    // Update remaining debt
    remainingDebt = Math.max(0, remainingDebt - monthlyPrincipal);
    
    // Track cumulative principal and interest
    totalPrincipal += monthlyPrincipal;
    totalInterest += monthlyInterest;
    
    // Add data point for this month
    months.push({
      month: month + 1,
      remainingDebt,
      payment: effectivePayment,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      cumulativePrincipal: totalPrincipal,
      cumulativeInterest: totalInterest
    });
    
    month++;
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
  const { t } = useLanguage();
  const [extraPayment, setExtraPayment] = useState(0);
  const [strategy, setStrategy] = useState<RepaymentStrategy>('annuity');
  const [comparisonStrategy, setComparisonStrategy] = useState<RepaymentStrategy | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate payment schedule with current parameters
  const paymentSchedule = calculatePaymentSchedule(
    activeLoans, 
    activeCards, 
    monthlyBudget, 
    extraPayment,
    strategy
  );
  
  // Calculate comparison payment schedule if needed
  const comparisonSchedule = showComparison && comparisonStrategy 
    ? calculatePaymentSchedule(
        activeLoans, 
        activeCards, 
        monthlyBudget, 
        extraPayment,
        comparisonStrategy
      )
    : [];
  
  // Get today's date for the reference line
  const today = new Date();
  const currentMonth = 1; // First month in the simulation is the current month
  
  // Prepare data for the chart
  const chartData = paymentSchedule.map((month, i) => {
    const comparisonMonth = comparisonSchedule[i];
    
    return {
      month: month.month,
      // Finnish translations for the chart
      "Jäljellä oleva velka": month.remainingDebt,
      "Pääoma": month.principal,
      "Korko": month.interest,
      ...(showComparison && comparisonMonth ? {
        [`Jäljellä oleva velka (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`]: comparisonMonth.remainingDebt,
        [`Pääoma (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`]: comparisonMonth.principal,
        [`Korko (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`]: comparisonMonth.interest,
      } : {})
    };
  });
  
  // Export functions
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
  
  const exportToCSV = () => {
    const headers = ['Kuukausi', 'Jäljellä oleva velka', 'Kuukausimaksu', 'Pääoma', 'Korko'];
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...paymentSchedule.map(month => 
        [
          month.month,
          month.remainingDebt.toFixed(2),
          month.payment.toFixed(2),
          month.principal.toFixed(2),
          month.interest.toFixed(2)
        ].join(',')
      )
    ].join('\n');
    
    // Create download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'velaton-aikajana.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="text-2xl font-bold">{paymentSchedule.length > 0 ? `${paymentSchedule.length} kuukautta` : formattedDebtFreeDate}</div>
              <div className="text-xs text-muted-foreground">{Math.floor(paymentSchedule.length / 12)} vuotta {paymentSchedule.length % 12} kuukautta</div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">Maksettava korkosumma</div>
              <div className="text-2xl font-bold">
                {paymentSchedule.length > 0 
                  ? formatCurrency(paymentSchedule.reduce((sum, month) => sum + month.interest, 0))
                  : formatCurrency(totalDebt * 0.2)} {/* Fallback estimate */}
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
                  dataKey="month" 
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
                  formatter={(value, name) => [formatCurrency(Number(value)), name]}
                  labelFormatter={(label) => `Kuukausi: ${label}`}
                />
                <Legend />
                
                {/* Reference line for today */}
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
                />
                
                {/* Primary strategy areas */}
                <Area 
                  type="monotone" 
                  dataKey="Jäljellä oleva velka" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.8}
                  yAxisId="left"
                />
                <Area 
                  type="monotone" 
                  dataKey="Pääoma" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.8}
                  yAxisId="right"
                />
                <Area 
                  type="monotone" 
                  dataKey="Korko" 
                  stackId="2"
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.8}
                  yAxisId="right"
                />
                
                {/* Comparison strategy areas if enabled */}
                {showComparison && comparisonStrategy && (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey={`Jäljellä oleva velka (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
                      stackId="3"
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.5}
                      strokeDasharray="5 5"
                      yAxisId="left"
                    />
                    <Area 
                      type="monotone" 
                      dataKey={`Pääoma (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
                      stackId="4"
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.5}
                      strokeDasharray="5 5"
                      yAxisId="right"
                    />
                    <Area 
                      type="monotone" 
                      dataKey={`Korko (${comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'})`}
                      stackId="4"
                      stroke="#eab308" 
                      fill="#eab308" 
                      fillOpacity={0.5}
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
              <p className="text-2xl font-bold">{paymentSchedule.length} kuukautta</p>
              <p className="text-xs text-muted-foreground">
                {Math.floor(paymentSchedule.length / 12)} vuotta {paymentSchedule.length % 12} kuukautta
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="text-sm font-medium mb-2">Korkoa maksetaan</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(paymentSchedule.reduce((sum, month) => sum + month.interest, 0))}
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
                      <span className="font-medium">{paymentSchedule.length} kuukautta</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Korkomaksut:</span>
                      <span className="font-medium">{formatCurrency(paymentSchedule.reduce((sum, month) => sum + month.interest, 0))}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Alkumaksu:</span>
                      <span className="font-medium">{formatCurrency(paymentSchedule[0]?.payment || 0)}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">{comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Maksuaika:</span>
                      <span className="font-medium">{comparisonSchedule.length} kuukautta</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Korkomaksut:</span>
                      <span className="font-medium">{formatCurrency(comparisonSchedule.reduce((sum, month) => sum + month.interest, 0))}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Alkumaksu:</span>
                      <span className="font-medium">{formatCurrency(comparisonSchedule[0]?.payment || 0)}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium">
                  {strategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'} vs {comparisonStrategy === 'annuity' ? 'Annuiteetti' : 'Tasalyhennys'}:
                </p>
                <p>
                  {paymentSchedule.length < comparisonSchedule.length 
                    ? `${Math.abs(paymentSchedule.length - comparisonSchedule.length)} kuukautta nopeampi maksuaika` 
                    : paymentSchedule.length > comparisonSchedule.length
                      ? `${Math.abs(paymentSchedule.length - comparisonSchedule.length)} kuukautta hitaampi maksuaika`
                      : "Sama maksuaika molemmilla strategioilla"
                  }
                </p>
                <p>
                  {paymentSchedule.reduce((sum, month) => sum + month.interest, 0) < 
                   comparisonSchedule.reduce((sum, month) => sum + month.interest, 0)
                    ? `Säästät ${formatCurrency(Math.abs(
                        comparisonSchedule.reduce((sum, month) => sum + month.interest, 0) - 
                        paymentSchedule.reduce((sum, month) => sum + month.interest, 0)
                      ))} korkomaksuissa` 
                    : `Maksat ${formatCurrency(Math.abs(
                        paymentSchedule.reduce((sum, month) => sum + month.interest, 0) - 
                        comparisonSchedule.reduce((sum, month) => sum + month.interest, 0)
                      ))} enemmän korkoja`
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
