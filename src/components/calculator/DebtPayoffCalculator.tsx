
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { PaymentStrategy } from '@/utils/repayment/types';  // Updated import
import { AlertCircle, Calculator, Trash2, PlusCircle, Banknote, Calendar, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BudgetInput from '../BudgetInput';

interface DebtPayoffCalculatorProps {
  initialDebts: Debt[];
  onSaveResults: (plan: PaymentPlan) => void;
  onError: (error: Error) => void;
}

const DebtPayoffCalculator: React.FC<DebtPayoffCalculatorProps> = ({ initialDebts, onSaveResults, onError }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(
    Math.max(1000, Math.ceil(initialDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0) * 1.2))
  );
  const [strategy, setStrategy] = useState<PaymentStrategy>('avalanche');  // Updated type
  const [isCalculating, setIsCalculating] = useState(false);
  const [payoffPlan, setPayoffPlan] = useState<PaymentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalDebt = useMemo(() => debts.reduce((sum, debt) => sum + debt.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((sum, debt) => sum + debt.minimumPayment, 0), [debts]);

  const handleAddDebt = useCallback(() => {
    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name: `${t('repayment.debtName')} ${debts.length + 1}`,
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'loan'
    };
    setDebts([...debts, newDebt]);
  }, [debts, t]);

  const handleRemoveDebt = useCallback((id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  }, [debts]);

  const handleUpdateDebt = useCallback((id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => {
      if (debt.id === id) {
        return { ...debt, [field]: value };
      }
      return debt;
    }));
  }, [debts]);

  const handleCalculate = useCallback(async () => {
    setError(null);
    
    if (debts.length === 0) {
      toast({
        title: t('errors.noDebtsTitle'),
        description: t('debtStrategies.addYourDebts'),
        variant: 'destructive',
      });
      return;
    }

    const invalidDebts = debts.filter(
      debt => debt.balance <= 0 || debt.interestRate < 0 || debt.minimumPayment <= 0
    );
    
    if (invalidDebts.length > 0) {
      toast({
        title: t('errors.invalidDataTitle'),
        description: t('errors.invalidDebtData'),
        variant: 'destructive',
      });
      return;
    }

    if (monthlyBudget < totalMinPayment) {
      toast({
        title: t('errors.insufficientBudgetTitle'),
        description: t('debtStrategies.insufficientPayment'),
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      // Cast the strategy to the correct type as expected by calculatePaymentPlan
      const plan = await calculatePaymentPlan(debts, monthlyBudget, strategy);
      
      setPayoffPlan(plan);
      onSaveResults(plan);
      
      toast({
        title: t('repayment.planSummary'),
        description: t('repayment.planDescription'),
      });
    } catch (error) {
      console.error('Error calculating payment plan:', error);
      setError((error as Error).message);
      onError(error as Error);
      
      toast({
        title: t('debtStrategies.errorInCalculation'),
        description: t('debtStrategies.tryAgainHigherPayment'),
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  }, [debts, monthlyBudget, strategy, onSaveResults, onError, toast, t, totalMinPayment]);

  const handleBudgetChange = useCallback((budget: number, method: PrioritizationMethod) => {
    setMonthlyBudget(budget);
    setStrategy(method);
    setTimeout(() => handleCalculate(), 0);
  }, [handleCalculate]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('debtStrategies.calculatorIntro')}</CardTitle>
          <CardDescription>{t('repayment.enterBudgetPrompt')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('debtStrategies.yourDebtsSection')}</h3>
              
              {debts.length > 0 ? (
                <div className="space-y-4">
                  {debts.map((debt, index) => (
                    <div key={debt.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-md">
                      <div>
                        <Label htmlFor={`debt-name-${index}`}>{t('loan.name')}</Label>
                        <Input
                          id={`debt-name-${index}`}
                          value={debt.name}
                          onChange={(e) => handleUpdateDebt(debt.id, 'name', e.target.value)}
                          placeholder={`${t('repayment.debtName')} ${index + 1}`}
                          className="h-12 md:h-11"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-balance-${index}`}>{t('loan.balance')}</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
                          <Input
                            id={`debt-balance-${index}`}
                            type="number"
                            value={debt.balance}
                            onChange={(e) => handleUpdateDebt(debt.id, 'balance', Number(e.target.value) || 0)}
                            className="pl-8 h-12 md:h-11"
                            placeholder="0"
                            min="0"
                            step="100"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-interest-${index}`}>{t('loan.interestRate')}</Label>
                        <div className="relative">
                          <Input
                            id={`debt-interest-${index}`}
                            type="number"
                            value={debt.interestRate}
                            onChange={(e) => handleUpdateDebt(debt.id, 'interestRate', Number(e.target.value) || 0)}
                            className="pr-8 h-12 md:h-11"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-payment-${index}`}>{t('repayment.minPayment')}</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
                          <Input
                            id={`debt-payment-${index}`}
                            type="number"
                            value={debt.minimumPayment}
                            onChange={(e) => handleUpdateDebt(debt.id, 'minimumPayment', Number(e.target.value) || 0)}
                            className="pl-8 h-12 md:h-11"
                            placeholder="0"
                            min="0"
                            step="10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-end">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveDebt(debt.id)}
                          className="h-12 w-12 md:h-11 md:w-11"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t('debtStrategies.addYourDebts')}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button variant="outline" onClick={handleAddDebt} className="w-full h-12 md:h-11">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('debtStrategies.addDebtButton')}
              </Button>
            </div>
            
            <div>
              <BudgetInput 
                onCalculate={handleBudgetChange} 
                defaultBudget={monthlyBudget}
                method={strategy}
              />
            </div>
            
            {debts.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleCalculate} 
                  disabled={isCalculating}
                  className="w-full md:w-auto h-12 md:h-11"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {isCalculating ? t('common.calculating') : t('debtStrategies.calculateButton')}
                </Button>
              </div>
            )}
            
            {payoffPlan && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h3 className="text-lg font-medium mb-4">{t('debtStrategies.summaryTitle')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col p-4 bg-card rounded-md border">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Banknote className="h-4 w-4 mr-2" />
                      {t('debtStrategies.totalDebt')}
                    </span>
                    <span className="text-2xl font-bold mt-1">€{totalDebt.toLocaleString('fi-FI')}</span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-card rounded-md border">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('debtStrategies.timeToPayoff')}
                    </span>
                    <span className="text-2xl font-bold mt-1">{payoffPlan.totalMonths} {t('form.months')}</span>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-card rounded-md border">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Percent className="h-4 w-4 mr-2" />
                      {t('debtStrategies.interestPaid')}
                    </span>
                    <span className="text-2xl font-bold mt-1">€{payoffPlan.totalInterestPaid.toLocaleString('fi-FI')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <span className="text-sm text-muted-foreground">{t('debtStrategies.minPayment')}</span>
                    <p className="font-medium">€{totalMinPayment.toLocaleString('fi-FI')}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">{t('debtStrategies.additionalPayment')}</span>
                    <p className="font-medium">€{(monthlyBudget - totalMinPayment).toLocaleString('fi-FI')}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">{t('debtStrategies.totalMonthly')}</span>
                    <p className="font-medium">€{monthlyBudget.toLocaleString('fi-FI')}</p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtPayoffCalculator;
