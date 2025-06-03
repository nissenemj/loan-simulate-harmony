
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { Debt, PaymentPlan, PaymentStrategy } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { PrioritizationMethod } from '@/utils/repayment';
import { 
  AlertCircle, Calculator, Trash2, PlusCircle, CreditCard, 
  BanknoteIcon, PercentIcon, CalendarIcon
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import BudgetInput from '../BudgetInput';
import { useToast } from '@/hooks/use-toast';
import ProgressIndicator from './ProgressIndicator';
import ExampleDataButton from './ExampleDataButton';
import EnhancedStrategySelector from './EnhancedStrategySelector';
import ResultsInterpretationGuide from './ResultsInterpretationGuide';

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
  const [strategy, setStrategy] = useState<PrioritizationMethod>('avalanche');
  const [isCalculating, setIsCalculating] = useState(false);
  const [payoffPlan, setPayoffPlan] = useState<PaymentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const totalDebt = useMemo(() => debts.reduce((sum, debt) => sum + debt.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((sum, debt) => sum + debt.minimumPayment, 0), [debts]);

  // Helper function to format numbers with max one decimal place
  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  // Helper function to format currency with max one decimal place
  const formatCurrency = (num: number) => {
    const formatted = num % 1 === 0 ? num.toString() : num.toFixed(1);
    return `€${parseFloat(formatted).toLocaleString('fi-FI')}`;
  };

  // Helper function to format input values to one decimal place when needed
  const formatInputValue = (value: number) => {
    return value % 1 === 0 ? value : parseFloat(value.toFixed(1));
  };

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
        // Format numeric values to one decimal place if needed
        if (typeof value === 'number' && (field === 'balance' || field === 'interestRate' || field === 'minimumPayment')) {
          value = formatInputValue(value);
        }
        return { ...debt, [field]: value };
      }
      return debt;
    }));
  }, [debts]);

  const handleFillExample = useCallback((exampleDebts: Debt[]) => {
    setDebts(exampleDebts);
    setCurrentStep(2);
    toast({
      title: t('guidance.exampleData.exampleNote'),
      description: t('guidance.exampleData.clearAndEnterOwn'),
    });
  }, [t, toast]);

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
    setCurrentStep(3);
    
    try {
      const paymentStrategy: PaymentStrategy = strategy as PaymentStrategy;
      const plan = await calculatePaymentPlan(debts, monthlyBudget, paymentStrategy);
      
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
    setCurrentStep(3);
    setTimeout(() => handleCalculate(), 0);
  }, [handleCalculate]);

  const handleStrategyChange = useCallback((newStrategy: PaymentStrategy) => {
    setStrategy(newStrategy as PrioritizationMethod);
  }, []);

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={currentStep} />
      
      <Card>
        <CardHeader>
          <CardTitle>{t('debtStrategies.calculatorIntro')}</CardTitle>
          <CardDescription>{t('repayment.enterBudgetPrompt')}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('debtStrategies.yourDebtsSection')}</h3>
              
              {debts.length === 0 && (
                <ExampleDataButton onFillExample={handleFillExample} />
              )}
              
              {debts.length > 0 ? (
                <div className="space-y-4">
                  {debts.map((debt, index) => (
                    <div key={debt.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                      <div>
                        <Label htmlFor={`debt-name-${index}`} className="flex items-center gap-1">
                          {t('loan.name')}
                          <HelpTooltip content={t('guidance.fieldTooltips.debtName')} />
                        </Label>
                        <Input
                          id={`debt-name-${index}`}
                          value={debt.name}
                          onChange={(e) => handleUpdateDebt(debt.id, 'name', e.target.value)}
                          placeholder={`${t('repayment.debtName')} ${index + 1}`}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-balance-${index}`} className="flex items-center gap-1">
                          {t('loan.balance')}
                          <HelpTooltip content={t('guidance.fieldTooltips.balance')} />
                        </Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
                          <Input
                            id={`debt-balance-${index}`}
                            type="number"
                            value={debt.balance}
                            onChange={(e) => handleUpdateDebt(debt.id, 'balance', Number(e.target.value) || 0)}
                            className="pl-8"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-interest-${index}`} className="flex items-center gap-1">
                          {t('loan.interestRate')}
                          <HelpTooltip content={t('guidance.fieldTooltips.interestRate')} />
                        </Label>
                        <div className="relative">
                          <Input
                            id={`debt-interest-${index}`}
                            type="number"
                            value={debt.interestRate}
                            onChange={(e) => handleUpdateDebt(debt.id, 'interestRate', Number(e.target.value) || 0)}
                            className="pr-8"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`debt-payment-${index}`} className="flex items-center gap-1">
                          {t('repayment.minPayment')}
                          <HelpTooltip content={t('guidance.fieldTooltips.minimumPayment')} />
                        </Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
                          <Input
                            id={`debt-payment-${index}`}
                            type="number"
                            value={debt.minimumPayment}
                            onChange={(e) => handleUpdateDebt(debt.id, 'minimumPayment', Number(e.target.value) || 0)}
                            className="pl-8"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-end">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveDebt(debt.id)}
                          className="h-10 w-10"
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
              
              <Button variant="outline" onClick={handleAddDebt} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('debtStrategies.addDebtButton')}
              </Button>
            </div>
            
            {debts.length > 0 && (
              <>
                <EnhancedStrategySelector
                  selectedStrategy={strategy as PaymentStrategy}
                  onStrategyChange={handleStrategyChange}
                />
                
                <div>
                  <BudgetInput 
                    onCalculate={handleBudgetChange} 
                    defaultBudget={monthlyBudget}
                    method={strategy}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCalculate} 
                    disabled={isCalculating}
                    className="w-full md:w-auto"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    {isCalculating ? t('common.calculating') : t('debtStrategies.calculateButton')}
                  </Button>
                </div>
              </>
            )}
            
            {payoffPlan && (
              <>
                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="text-lg font-medium mb-4">{t('debtStrategies.summaryTitle')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <BanknoteIcon className="h-4 w-4 mr-2" />
                        {t('debtStrategies.totalDebt')}
                      </span>
                      <span className="text-2xl font-bold mt-1">{formatCurrency(totalDebt)}</span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {t('debtStrategies.timeToPayoff')}
                      </span>
                      <span className="text-2xl font-bold mt-1">{formatNumber(payoffPlan.totalMonths)} {t('form.months')}</span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <PercentIcon className="h-4 w-4 mr-2" />
                        {t('debtStrategies.interestPaid')}
                      </span>
                      <span className="text-2xl font-bold mt-1">{formatCurrency(payoffPlan.totalInterestPaid)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('debtStrategies.minPayment')}</span>
                      <p className="font-medium">{formatCurrency(totalMinPayment)}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">{t('debtStrategies.additionalPayment')}</span>
                      <p className="font-medium">{formatCurrency(monthlyBudget - totalMinPayment)}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">{t('debtStrategies.totalMonthly')}</span>
                      <p className="font-medium">{formatCurrency(monthlyBudget)}</p>
                    </div>
                  </div>
                </div>
                
                <ResultsInterpretationGuide paymentPlan={payoffPlan} />
              </>
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
