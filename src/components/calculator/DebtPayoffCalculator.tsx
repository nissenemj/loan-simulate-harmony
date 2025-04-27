
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Debt, PaymentPlan, PaymentStrategy } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { useCalculationCache } from '@/hooks/useCalculationCache';
import { saveRepaymentStrategy } from '@/utils/repayment';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DebtPayoffCalculatorProps {
  initialDebts: Debt[];
  onSaveResults?: (plan: PaymentPlan) => void;
  onError?: (error: Error) => void;
  initialStrategy?: PaymentStrategy;
  initialMonthlyPayment?: number;
}

const DebtPayoffCalculator = ({ 
  initialDebts, 
  onSaveResults, 
  onError,
  initialStrategy,
  initialMonthlyPayment 
}: DebtPayoffCalculatorProps) => {
  const { t } = useLanguage();
  
  // State for calculation parameters
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(
    initialMonthlyPayment || 
    Math.max(500, initialDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0) * 1.2)
  );
  const [strategy, setStrategy] = useState<PaymentStrategy>(initialStrategy || 'avalanche');
  const [customOrder, setCustomOrder] = useState<string[]>([]);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  // Strategy saving state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  
  // Cache for calculations
  const { getCachedResult, setCachedResult, generateCacheKey } = useCalculationCache<PaymentPlan>();
  
  // Recalculate when debts change
  useEffect(() => {
    setDebts(initialDebts);
    const minPayment = initialDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    if (!initialMonthlyPayment && (!monthlyPayment || monthlyPayment < minPayment)) {
      setMonthlyPayment(Math.max(500, minPayment * 1.2));
    }
  }, [initialDebts]);
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Calculate payment plan
  const calculatePayments = () => {
    // Check if we have any debts
    if (debts.length === 0) {
      setCalculationError(t('calculator.noDebtsError'));
      onError?.(new Error(t('calculator.noDebtsError')));
      return;
    }
    
    // Check if monthly payment is sufficient
    const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    if (monthlyPayment < minimumPaymentSum) {
      const error = t('calculator.insufficientPaymentError', {
        payment: formatCurrency(monthlyPayment),
        minimum: formatCurrency(minimumPaymentSum)
      });
      setCalculationError(error);
      onError?.(new Error(error));
      return;
    }
    
    try {
      // Check cache first
      const cacheKey = generateCacheKey(debts, monthlyPayment, strategy);
      const cachedPlan = getCachedResult(cacheKey);
      
      if (cachedPlan) {
        setPaymentPlan(cachedPlan);
        setCalculationError(null);
        onSaveResults?.(cachedPlan);
        return;
      }
      
      // Calculate new plan
      const plan = calculatePaymentPlan(
        debts,
        monthlyPayment,
        strategy,
        strategy === 'custom' ? customOrder : undefined
      );
      
      // Update state and cache
      setPaymentPlan(plan);
      setCalculationError(null);
      setCachedResult(cacheKey, plan);
      onSaveResults?.(plan);
    } catch (error) {
      console.error('Error calculating payment plan:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setCalculationError(errorMessage);
      onError?.(new Error(errorMessage));
    }
  };
  
  // Save strategy
  const handleSaveStrategy = () => {
    if (!paymentPlan || !strategyName.trim()) return;
    
    try {
      // Convert payment plan to repayment plan format
      const repaymentPlan = {
        timeline: paymentPlan.monthlyPlans.map(month => ({
          month: month.month,
          debts: month.payments.map(payment => {
            const debt = debts.find(d => d.id === payment.debtId);
            return {
              id: payment.debtId,
              name: debt?.name || payment.debtId,
              remainingBalance: payment.remainingBalance,
              payment: payment.amount,
              interestPaid: payment.interestPaid
            };
          }),
          totalRemaining: month.totalRemainingBalance,
          totalPaid: month.totalPaid,
          totalInterestPaid: month.totalInterestPaid,
          strategy: strategy
        })),
        isViable: true,
        monthlyAllocation: debts.map(debt => ({
          id: debt.id,
          name: debt.name,
          type: debt.type as any || 'loan',
          minPayment: debt.minimumPayment,
          extraPayment: 0,
          totalPayment: debt.minimumPayment
        })),
        totalMonths: paymentPlan.totalMonths,
        totalInterestPaid: paymentPlan.totalInterestPaid,
      };
      
      // Save the strategy
      saveRepaymentStrategy(
        strategyName.trim(),
        strategy === 'avalanche' ? 'avalanche' : strategy === 'snowball' ? 'snowball' : 'equal',
        monthlyPayment,
        repaymentPlan
      );
      
      // Close dialog and show success
      setShowSaveDialog(false);
      setStrategyName('');
      toast.success(t('calculator.strategySaved', { name: strategyName.trim() }));
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast.error(t('calculator.strategySaveError'));
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('calculator.debtPayoffCalculator')}</CardTitle>
        <CardDescription>{t('calculator.calculatorDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly payment input */}
        <div>
          <Label htmlFor="monthlyPayment" className="block mb-2">
            {t('calculator.monthlyPayment')}
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="monthlyPayment"
              type="number"
              min={0}
              step="10"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || 0)}
              className="max-w-xs"
            />
            <span className="text-sm text-muted-foreground">
              {t('calculator.minimumRequired')}: {formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))}
            </span>
          </div>
        </div>
        
        {/* Strategy selection */}
        <div>
          <Label htmlFor="strategy" className="block mb-2">
            {t('calculator.repaymentStrategy')}
          </Label>
          <RadioGroup
            value={strategy}
            onValueChange={(value) => setStrategy(value as PaymentStrategy)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="avalanche" id="avalanche" />
              <Label htmlFor="avalanche" className="font-normal">
                {t('calculator.avalancheStrategy')}
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculator.avalancheDescription')}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="snowball" id="snowball" />
              <Label htmlFor="snowball" className="font-normal">
                {t('calculator.snowballStrategy')}
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculator.snowballDescription')}
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {calculationError && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>{calculationError}</AlertDescription>
          </Alert>
        )}
        
        {paymentPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-medium text-sm">{t('calculator.totalMonths')}</h3>
              <p className="text-2xl font-bold">
                {paymentPlan.totalMonths}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-medium text-sm">{t('calculator.payoffDate')}</h3>
              <p className="text-2xl font-bold">
                {new Date(paymentPlan.payoffDate).toLocaleDateString('fi-FI')}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h3 className="font-medium text-sm">{t('calculator.totalInterestPaid')}</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(paymentPlan.totalInterestPaid)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculatePayments}>
          {t('calculator.calculatePaymentPlan')}
        </Button>
        
        {paymentPlan && (
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('calculator.saveStrategy')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('calculator.saveStrategyTitle')}</DialogTitle>
                <DialogDescription>
                  {t('calculator.saveStrategyDescription')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Label htmlFor="strategyName" className="block mb-2">
                  {t('calculator.strategyName')}
                </Label>
                <Input
                  id="strategyName"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder={t('calculator.strategyNamePlaceholder')}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSaveStrategy} disabled={!strategyName.trim()}>
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default DebtPayoffCalculator;
