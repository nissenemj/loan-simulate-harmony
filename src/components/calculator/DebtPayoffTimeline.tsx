import { useState, useEffect } from 'react';
import { Debt, MonthlyPaymentPlan, PaymentStrategy } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface DebtPayoffTimelineProps {
  debts: Debt[];
  additionalPayment?: number;
  strategy?: PaymentStrategy;
}

/**
 * Debt Payoff Timeline component
 * Visualizes the month-by-month debt payoff journey
 */
export function DebtPayoffTimeline({ 
  debts, 
  additionalPayment = 0,
  strategy = 'avalanche'
}: DebtPayoffTimelineProps) {
  const { t } = useTranslation();
  const [paymentPlan, setPaymentPlan] = useState<MonthlyPaymentPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Calculate payment plan when inputs change
  useEffect(() => {
    if (debts.length === 0) {
      setPaymentPlan(null);
      return;
    }
    
    try {
      // Calculate minimum payment sum
      const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
      
      // Calculate total monthly payment
      const totalMonthlyPayment = minimumPaymentSum + additionalPayment;
      
      // Calculate payment plan
      const plan = calculatePaymentPlan(debts, totalMonthlyPayment, strategy);
      
      setPaymentPlan(plan.monthlyPlans);
      setCurrentMonth(0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error calculating payment plan');
      setPaymentPlan(null);
    }
  }, [debts, additionalPayment, strategy]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  // Get filtered payment plan based on view mode
  const getFilteredPlan = () => {
    if (!paymentPlan) return [];
    
    if (viewMode === 'monthly') {
      return paymentPlan;
    } else if (viewMode === 'quarterly') {
      return paymentPlan.filter((_, index) => index % 3 === 0);
    } else if (viewMode === 'yearly') {
      return paymentPlan.filter((_, index) => index % 12 === 0);
    }
    
    return paymentPlan;
  };
  
  const filteredPlan = getFilteredPlan();
  const totalMonths = filteredPlan.length;
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(Math.max(0, currentMonth - 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(Math.min(totalMonths - 1, currentMonth + 1));
  };
  
  // Navigate to first month
  const goToFirstMonth = () => {
    setCurrentMonth(0);
  };
  
  // Navigate to last month
  const goToLastMonth = () => {
    setCurrentMonth(totalMonths - 1);
  };
  
  // Jump forward multiple months
  const jumpForward = () => {
    const jumpAmount = viewMode === 'monthly' ? 12 : viewMode === 'quarterly' ? 4 : 2;
    setCurrentMonth(Math.min(totalMonths - 1, currentMonth + jumpAmount));
  };
  
  // Jump backward multiple months
  const jumpBackward = () => {
    const jumpAmount = viewMode === 'monthly' ? 12 : viewMode === 'quarterly' ? 4 : 2;
    setCurrentMonth(Math.max(0, currentMonth - jumpAmount));
  };
  
  // Get current month data
  const currentMonthData = filteredPlan[currentMonth];
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('calculator.debtPayoffTimeline')}</CardTitle>
          <CardDescription>{t('calculator.timelineDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('calculator.noDebtsAdded')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calculator.debtPayoffTimeline')}</CardTitle>
        <CardDescription>{t('calculator.timelineDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {paymentPlan && (
          <>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList className="grid grid-cols-3 w-[300px] mx-auto">
                <TabsTrigger value="monthly">{t('calculator.monthly')}</TabsTrigger>
                <TabsTrigger value="quarterly">{t('calculator.quarterly')}</TabsTrigger>
                <TabsTrigger value="yearly">{t('calculator.yearly')}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={goToFirstMonth}
                      disabled={currentMonth === 0}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={jumpBackward}
                      disabled={currentMonth === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <ChevronLeft className="h-4 w-4 -ml-2" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      variant="outline"
                      onClick={goToPreviousMonth}
                      disabled={currentMonth === 0}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>{t('pagination.previous')}</span>
                    </Button>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <div className="text-center px-4">
                      <div className="text-lg font-semibold">
                        {currentMonthData && formatDate(currentMonthData.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('calculator.month')} {currentMonth + 1} {t('calculator.of')} {totalMonths}
                      </div>
                    </div>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <Button 
                      variant="outline"
                      onClick={goToNextMonth}
                      disabled={currentMonth === totalMonths - 1}
                      className="gap-1"
                    >
                      <span>{t('pagination.next')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={jumpForward}
                      disabled={currentMonth === totalMonths - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <ChevronRight className="h-4 w-4 -ml-2" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={goToLastMonth}
                      disabled={currentMonth === totalMonths - 1}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            
            {currentMonthData && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">{t('calculator.totalPaid')}</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(currentMonthData.totalPaid)}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">{t('calculator.interestPaid')}</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(currentMonthData.totalInterestPaid)}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">{t('calculator.principalPaid')}</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(currentMonthData.totalPrincipalPaid)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">{t('calculator.remainingBalances')}</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('calculator.debtName')}</TableHead>
                          <TableHead className="text-right">{t('calculator.payment')}</TableHead>
                          <TableHead className="text-right">{t('calculator.interestPaid')}</TableHead>
                          <TableHead className="text-right">{t('calculator.principalPaid')}</TableHead>
                          <TableHead className="text-right">{t('calculator.remainingBalance')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentMonthData.payments.map((payment) => {
                          const debt = debts.find(d => d.id === payment.debtId);
                          return (
                            <TableRow key={payment.debtId}>
                              <TableCell>{debt?.name || payment.debtId}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payment.interestPaid)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(payment.principalPaid)}</TableCell>
                              <TableCell className="text-right">
                                {payment.remainingBalance === 0 
                                  ? <span className="text-green-600 font-semibold">{t('calculator.paidOff')}</span>
                                  : formatCurrency(payment.remainingBalance)
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-medium">{t('calculator.total')}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(currentMonthData.totalPaid)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(currentMonthData.totalInterestPaid)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(currentMonthData.totalPrincipalPaid)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(currentMonthData.totalRemainingBalance)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {currentMonthData.debtsCompleted.length > 0 && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
                    <p className="font-semibold">
                      {t('calculator.debtsPaidOff')}
                    </p>
                    <ul className="mt-1 list-disc pl-5">
                      {currentMonthData.debtsCompleted.map((debtId) => {
                        const debt = debts.find(d => d.id === debtId);
                        return (
                          <li key={debtId}>
                            {debt?.name || debtId}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {currentMonth === totalMonths - 1 && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
                    <p className="font-semibold">
                      {t('calculator.congratulations')}
                    </p>
                    <p className="mt-1">
                      {t('calculator.debtFreeMessage')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
