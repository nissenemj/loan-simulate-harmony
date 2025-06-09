
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Debt, PaymentPlan, PaymentStrategy } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { PrioritizationMethod } from '@/utils/repayment';
import { 
  AlertCircle, Calculator, Trash2, PlusCircle, CreditCard, 
  BanknoteIcon, PercentIcon, CalendarIcon, Euro
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import BudgetInput from '../BudgetInput';
import { useToast } from '@/hooks/use-toast';
import ProgressIndicator from './ProgressIndicator';
import ExampleDataButton from './ExampleDataButton';
import EnhancedStrategySelector from './EnhancedStrategySelector';
import ResultsInterpretationGuide from './ResultsInterpretationGuide';
import { EnhancedGuidedTour } from '../onboarding/EnhancedGuidedTour';
import ExtraPaymentImpact from './ExtraPaymentImpact';
import GlossaryTooltip from '@/components/ui/glossary-tooltip';
import { EnhancedFormField } from '@/components/ui/enhanced-form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MobileOptimizedInput } from '@/components/ui/mobile-optimized-input';

interface DebtPayoffCalculatorProps {
  initialDebts: Debt[];
  onSaveResults: (plan: PaymentPlan) => void;
  onError: (error: Error) => void;
}

// Enhanced validation functions with better error messages
const createRequiredValidator = (fieldName: string = "kenttä") => {
  return (value: string) => {
    const isValid = value.trim().length > 0;
    return { 
      isValid, 
      message: isValid ? undefined : `${fieldName} on pakollinen` 
    };
  };
};

const createPositiveNumberValidator = (fieldName: string = "Arvo", minValue: number = 0) => {
  return (value: string) => {
    const num = Number(value);
    const isValid = !isNaN(num) && num > minValue;
    return { 
      isValid, 
      message: isValid ? undefined : `${fieldName} täytyy olla suurempi kuin ${minValue}€` 
    };
  };
};

const createInterestRateValidator = () => {
  return (value: string) => {
    const num = Number(value);
    const isValid = !isNaN(num) && num >= 0 && num <= 100;
    return { 
      isValid, 
      message: isValid ? undefined : "Korko täytyy olla 0-100% välillä" 
    };
  };
};

const DebtPayoffCalculator: React.FC<DebtPayoffCalculatorProps> = ({ 
  initialDebts, 
  onSaveResults, 
  onError 
}) => {
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
  const [showTour, setShowTour] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const totalDebt = useMemo(() => debts.reduce((sum, debt) => sum + debt.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((sum, debt) => sum + debt.minimumPayment, 0), [debts]);

  const formatCurrency = (num: number) => {
    return `€${num.toLocaleString('fi-FI')}`;
  };

  const formatInputValue = (value: number) => {
    return value % 1 === 0 ? value : parseFloat(value.toFixed(1));
  };

  // Real-time validation
  const validateDebt = useCallback((debt: Debt, index: number) => {
    const errors: {[key: string]: string} = {};
    const prefix = `debt-${index}`;

    if (!debt.name.trim()) {
      errors[`${prefix}-name`] = "Velan nimi on pakollinen";
    }

    if (debt.balance <= 0) {
      errors[`${prefix}-balance`] = "Saldo täytyy olla suurempi kuin 0€";
    }

    if (debt.interestRate < 0 || debt.interestRate > 100) {
      errors[`${prefix}-interest`] = "Korko täytyy olla 0-100% välillä";
    }

    if (debt.minimumPayment <= 0) {
      errors[`${prefix}-payment`] = "Vähimmäismaksu täytyy olla suurempi kuin 0€";
    }

    if (debt.minimumPayment > debt.balance) {
      errors[`${prefix}-payment`] = "Vähimmäismaksu ei voi olla suurempi kuin saldo";
    }

    return errors;
  }, []);

  // Auto-advance to next field on completion
  const handleInputComplete = useCallback((currentField: string, value: string) => {
    if (value && currentField.includes('name')) {
      // Focus next field after name input
      setTimeout(() => {
        const nextField = document.querySelector(`input[id*="balance"]`) as HTMLInputElement;
        nextField?.focus();
      }, 100);
    }
  }, []);

  const handleAddDebt = useCallback(() => {
    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name: `Velka ${debts.length + 1}`,
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: 'loan'
    };
    setDebts([...debts, newDebt]);
    setCurrentStep(1);
  }, [debts]);

  const handleRemoveDebt = useCallback((id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
    // Clear validation errors for removed debt
    const newErrors = { ...validationErrors };
    Object.keys(newErrors).forEach(key => {
      if (key.includes(id)) {
        delete newErrors[key];
      }
    });
    setValidationErrors(newErrors);
  }, [debts, validationErrors]);

  const handleUpdateDebt = useCallback((id: string, field: keyof Debt, value: any) => {
    const updatedDebts = debts.map(debt => {
      if (debt.id === id) {
        if (typeof value === 'number' && (field === 'balance' || field === 'interestRate' || field === 'minimumPayment')) {
          value = formatInputValue(value);
        }
        const updatedDebt = { ...debt, [field]: value };
        
        // Real-time validation
        const debtIndex = debts.findIndex(d => d.id === id);
        const errors = validateDebt(updatedDebt, debtIndex);
        
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          // Clear old errors for this debt
          Object.keys(newErrors).forEach(key => {
            if (key.startsWith(`debt-${debtIndex}-`)) {
              delete newErrors[key];
            }
          });
          // Add new errors
          return { ...newErrors, ...errors };
        });
        
        return updatedDebt;
      }
      return debt;
    });
    
    setDebts(updatedDebts);
  }, [debts, validateDebt]);

  const handleFillExample = useCallback((exampleDebts: Debt[]) => {
    setDebts(exampleDebts);
    setCurrentStep(2);
    setValidationErrors({}); // Clear validation errors
    toast({
      title: "Esimerkkitiedot lisätty",
      description: "Voit nyt muokata tietoja tai jatkaa laskentaan",
    });
  }, [toast]);

  const handleCalculate = useCallback(async () => {
    setError(null);
    
    if (debts.length === 0) {
      toast({
        title: "Ei velkoja",
        description: "Lisää vähintään yksi velka laskeaksesi takaisinmaksusuunnitelman",
        variant: 'destructive',
      });
      return;
    }

    // Validate all debts
    const allErrors: {[key: string]: string} = {};
    debts.forEach((debt, index) => {
      const errors = validateDebt(debt, index);
      Object.assign(allErrors, errors);
    });

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      toast({
        title: "Virheelliset tiedot",
        description: "Korjaa virheet ennen laskentaa",
        variant: 'destructive',
      });
      return;
    }

    if (monthlyBudget < totalMinPayment) {
      toast({
        title: "Riittämätön budjetti",
        description: `Kuukausittainen budjetti (${formatCurrency(monthlyBudget)}) on pienempi kuin vähimmäismaksujen summa (${formatCurrency(totalMinPayment)})`,
        variant: 'destructive',
      });
      return;
    }

    setIsCalculating(true);
    setCurrentStep(3);
    
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentStrategy: PaymentStrategy = strategy as PaymentStrategy;
      const plan = await calculatePaymentPlan(debts, monthlyBudget, paymentStrategy);
      
      setPayoffPlan(plan);
      onSaveResults(plan);
      
      toast({
        title: "Suunnitelma valmis!",
        description: `Velkavapaus ${plan.totalMonths} kuukaudessa`,
      });
    } catch (error) {
      console.error('Virhe laskennassa:', error);
      setError((error as Error).message);
      onError(error as Error);
      
      toast({
        title: "Laskentavirhe",
        description: "Yritä uudelleen tai tarkista syöttötiedot",
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  }, [debts, monthlyBudget, strategy, onSaveResults, onError, toast, totalMinPayment, validateDebt]);

  const handleBudgetChange = useCallback((budget: number, method: PrioritizationMethod) => {
    setMonthlyBudget(budget);
    setStrategy(method);
    setCurrentStep(3);
    setTimeout(() => handleCalculate(), 0);
  }, [handleCalculate]);

  const handleStrategyChange = useCallback((newStrategy: PaymentStrategy) => {
    setStrategy(newStrategy as PrioritizationMethod);
  }, []);

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
  }, []);

  return (
    <div className="space-y-6">
      <EnhancedGuidedTour onComplete={handleTourComplete} forceShow={showTour} />
      
      <ProgressIndicator currentStep={currentStep} />
      
      {isCalculating && (
        <Card>
          <CardContent className="py-12">
            <LoadingSpinner 
              variant="calculator" 
              size="lg" 
              text="Lasketaan optimaalista takaisinmaksusuunnitelmaa..." 
            />
          </CardContent>
        </Card>
      )}
      
      {!isCalculating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Velkalaskuri
            </CardTitle>
            <CardDescription>
              Syötä velkasi ja kuukausittainen budjettisi laskeaksesi optimaalisen takaisinmaksusuunnitelman
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Sinun velkasi</h3>
                  {debts.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Yhteensä: {formatCurrency(totalDebt)}
                    </div>
                  )}
                </div>
                
                {debts.length === 0 && (
                  <ExampleDataButton onFillExample={handleFillExample} />
                )}
                
                {debts.length > 0 ? (
                  <div className="space-y-4">
                    {debts.map((debt, index) => (
                      <div key={debt.id} className="grid grid-cols-1 gap-4 p-4 border rounded-md bg-card md:grid-cols-5">
                        <MobileOptimizedInput
                          id={`debt-name-${index}`}
                          label="Velan nimi"
                          value={debt.name}
                          onChange={(e) => {
                            handleUpdateDebt(debt.id, 'name', e.target.value);
                            handleInputComplete(`debt-name-${index}`, e.target.value);
                          }}
                          placeholder="Esim. Luottokortti, Autolaina"
                          helpText="Anna velalle tunnistettava nimi"
                          error={validationErrors[`debt-${index}-name`]}
                        />
                        
                        <MobileOptimizedInput
                          id={`debt-balance-${index}`}
                          label="Nykyinen saldo (€)"
                          type="number"
                          value={debt.balance}
                          onChange={(e) => handleUpdateDebt(debt.id, 'balance', Number(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          helpText="Velan nykyinen jäljellä oleva määrä"
                          error={validationErrors[`debt-${index}-balance`]}
                          icon={<Euro className="h-4 w-4" />}
                        />
                        
                        <MobileOptimizedInput
                          id={`debt-interest-${index}`}
                          label="Vuosikorko (%)"
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) => handleUpdateDebt(debt.id, 'interestRate', Number(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.1"
                          helpText="Velan todellinen vuosikorko (APR)"
                          error={validationErrors[`debt-${index}-interest`]}
                          icon={<PercentIcon className="h-4 w-4" />}
                        />
                        
                        <MobileOptimizedInput
                          id={`debt-payment-${index}`}
                          label="Vähimmäismaksu (€)"
                          type="number"
                          value={debt.minimumPayment}
                          onChange={(e) => handleUpdateDebt(debt.id, 'minimumPayment', Number(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          helpText="Lainanantajan vaatima kuukausittainen vähimmäismaksu"
                          error={validationErrors[`debt-${index}-payment`]}
                          icon={<Euro className="h-4 w-4" />}
                        />
                        
                        <div className="flex items-end justify-end">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRemoveDebt(debt.id)}
                            className="h-12 w-12 md:h-10 md:w-10"
                            title="Poista velka"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Velkoja:</span>
                          <p className="font-medium">{debts.length} kpl</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kokonaissaldo:</span>
                          <p className="font-medium">{formatCurrency(totalDebt)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vähimmäismaksut:</span>
                          <p className="font-medium">{formatCurrency(totalMinPayment)}/kk</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Keskikorko:</span>
                          <p className="font-medium">
                            {totalDebt > 0 ? 
                              ((debts.reduce((sum, debt) => sum + (debt.balance * debt.interestRate), 0) / totalDebt).toFixed(1)) + '%'
                              : '0%'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Lisää velkasi aloittaaksesi takaisinmaksusuunnitelman laskemisen. 
                      Voit käyttää esimerkkitietoja tai syöttää omat tietosi.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button variant="outline" onClick={handleAddDebt} className="w-full h-12 md:h-10">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Lisää velka
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
                  
                  {monthlyBudget > totalMinPayment && (
                    <ExtraPaymentImpact
                      extraAmount={monthlyBudget - totalMinPayment}
                      timeSaved={payoffPlan ? Math.round(payoffPlan.totalMonths * 0.1) : 0}
                      interestSaved={payoffPlan ? Math.round(payoffPlan.totalInterestPaid * 0.1) : 0}
                    />
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCalculate} 
                      disabled={isCalculating || Object.keys(validationErrors).length > 0}
                      className="w-full md:w-auto h-12 md:h-10"
                      size="lg"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      {isCalculating ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Lasketaan...
                        </>
                      ) : (
                        'Laske takaisinmaksusuunnitelma'
                      )}
                    </Button>
                  </div>
                </>
              )}
              
              {payoffPlan && !isCalculating && (
                <>
                  <div className="border rounded-md p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Takaisinmaksusuunnitelma
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col p-4 bg-card rounded-lg border">
                        <span className="text-sm text-muted-foreground flex items-center mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Aika velattomuuteen
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {payoffPlan.totalMonths} kuukautta
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {Math.floor(payoffPlan.totalMonths / 12)} vuotta {payoffPlan.totalMonths % 12} kuukautta
                        </span>
                      </div>
                      
                      <div className="flex flex-col p-4 bg-card rounded-lg border">
                        <span className="text-sm text-muted-foreground flex items-center mb-2">
                          <PercentIcon className="h-4 w-4 mr-2" />
                          Maksetut korot yhteensä
                        </span>
                        <span className="text-2xl font-bold text-destructive">
                          {formatCurrency(payoffPlan.totalInterestPaid)}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {((payoffPlan.totalInterestPaid / totalDebt) * 100).toFixed(1)}% alkuperäisestä
                        </span>
                      </div>
                      
                      <div className="flex flex-col p-4 bg-card rounded-lg border">
                        <span className="text-sm text-muted-foreground flex items-center mb-2">
                          <BanknoteIcon className="h-4 w-4 mr-2" />
                          Maksetaan yhteensä
                        </span>
                        <span className="text-2xl font-bold">
                          {formatCurrency(payoffPlan.totalPaid)}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          Pääoma + korot
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">Vähimmäismaksut</span>
                        <p className="font-medium">{formatCurrency(totalMinPayment)}/kk</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Lisämaksu</span>
                        <p className="font-medium text-primary">{formatCurrency(monthlyBudget - totalMinPayment)}/kk</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-muted-foreground">Velkavapaus</span>
                        <p className="font-medium">{payoffPlan.payoffDate}</p>
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
      )}
    </div>
  );
};

export default DebtPayoffCalculator;
