
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
  BanknoteIcon, PercentIcon, CalendarIcon
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import BudgetInput from '../BudgetInput';
import { useToast } from '@/hooks/use-toast';
import ProgressIndicator from './ProgressIndicator';
import ExampleDataButton from './ExampleDataButton';
import EnhancedStrategySelector from './EnhancedStrategySelector';
import ResultsInterpretationGuide from './ResultsInterpretationGuide';
import GuidedTour from '../onboarding/GuidedTour';
import ExtraPaymentImpact from './ExtraPaymentImpact';
import GlossaryTooltip from '@/components/ui/glossary-tooltip';
import { EnhancedFormField } from '@/components/ui/enhanced-form-field';

interface DebtPayoffCalculatorProps {
  initialDebts: Debt[];
  onSaveResults: (plan: PaymentPlan) => void;
  onError: (error: Error) => void;
}

// Validointifunktiot
const createRequiredValidator = (errorMessage: string = "Tämä kenttä on pakollinen") => {
  return (value: string) => {
    const isValid = value.trim().length > 0;
    return { isValid, message: isValid ? undefined : errorMessage };
  };
};

const createPositiveNumberValidator = (errorMessage: string = "Syötä positiivinen luku") => {
  return (value: string) => {
    const num = Number(value);
    const isValid = !isNaN(num) && num > 0;
    return { isValid, message: isValid ? undefined : errorMessage };
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

  const totalDebt = useMemo(() => debts.reduce((sum, debt) => sum + debt.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((sum, debt) => sum + debt.minimumPayment, 0), [debts]);

  const formatCurrency = (num: number) => {
    return `€${num.toLocaleString('fi-FI')}`;
  };

  const formatInputValue = (value: number) => {
    return value % 1 === 0 ? value : parseFloat(value.toFixed(1));
  };

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
  }, [debts]);

  const handleRemoveDebt = useCallback((id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  }, [debts]);

  const handleUpdateDebt = useCallback((id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => {
      if (debt.id === id) {
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

    const invalidDebts = debts.filter(
      debt => debt.balance <= 0 || debt.interestRate < 0 || debt.minimumPayment <= 0
    );
    
    if (invalidDebts.length > 0) {
      toast({
        title: "Virheelliset tiedot",
        description: "Tarkista, että kaikissa veloissa on positiiviset arvot",
        variant: 'destructive',
      });
      return;
    }

    if (monthlyBudget < totalMinPayment) {
      toast({
        title: "Riittämätön budjetti",
        description: "Kuukausittainen budjetti on pienempi kuin vähimmäismaksujen summa",
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
        title: "Suunnitelma valmis",
        description: "Takaisinmaksusuunnitelma on laskettu onnistuneesti",
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
  }, [debts, monthlyBudget, strategy, onSaveResults, onError, toast, totalMinPayment]);

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
      <GuidedTour onComplete={handleTourComplete} forceShow={showTour} />
      
      <ProgressIndicator currentStep={currentStep} />
      
      <Card>
        <CardHeader>
          <CardTitle>Velkalaskuri</CardTitle>
          <CardDescription>Syötä velkasi ja kuukausittainen budjettisi laskeaksesi takaisinmaksusuunnitelman</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sinun velkasi</h3>
              
              {debts.length === 0 && (
                <ExampleDataButton onFillExample={handleFillExample} />
              )}
              
              {debts.length > 0 ? (
                <div className="space-y-4">
                  {debts.map((debt, index) => (
                    <div key={debt.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                      <EnhancedFormField
                        id={`debt-name-${index}`}
                        label="Velan nimi"
                        value={debt.name}
                        onChange={(e) => handleUpdateDebt(debt.id, 'name', e.target.value)}
                        placeholder={`Velka ${index + 1}`}
                        helpText="Anna velalle tunnistettava nimi, kuten 'Visa-kortti' tai 'Autolaina'"
                        validation={createRequiredValidator("Velan nimi on pakollinen")}
                      />
                      
                      <EnhancedFormField
                        id={`debt-balance-${index}`}
                        label="Saldo"
                        type="number"
                        value={debt.balance}
                        onChange={(e) => handleUpdateDebt(debt.id, 'balance', Number(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        helpText="Syötä nykyinen velkasumma, ei alkuperäinen lainasumma"
                        validation={createPositiveNumberValidator("Saldo täytyy olla positiivinen")}
                      />
                      
                      <EnhancedFormField
                        id={`debt-interest-${index}`}
                        label="Korkoprosentti (%)"
                        type="number"
                        value={debt.interestRate}
                        onChange={(e) => handleUpdateDebt(debt.id, 'interestRate', Number(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        helpText="Tämä on todellinen vuosikorko - tarkista tiliotteistasi"
                        validation={createPositiveNumberValidator("Korko täytyy olla positiivinen")}
                      />
                      
                      <EnhancedFormField
                        id={`debt-payment-${index}`}
                        label="Vähimmäismaksu (€)"
                        type="number"
                        value={debt.minimumPayment}
                        onChange={(e) => handleUpdateDebt(debt.id, 'minimumPayment', Number(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.1"
                        helpText="Lainanantajan vaatima vähimmäiskuukausimaksu"
                        validation={createPositiveNumberValidator("Vähimmäismaksu täytyy olla positiivinen")}
                      />
                      
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
                    Lisää velkasi aloittaaksesi takaisinmaksusuunnitelman laskemisen
                  </AlertDescription>
                </Alert>
              )}
              
              <Button variant="outline" onClick={handleAddDebt} className="w-full">
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
                    disabled={isCalculating}
                    className="w-full md:w-auto"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    {isCalculating ? 'Lasketaan...' : 'Laske suunnitelma'}
                  </Button>
                </div>
              </>
            )}
            
            {payoffPlan && (
              <>
                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="text-lg font-medium mb-4">Yhteenveto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <BanknoteIcon className="h-4 w-4 mr-2" />
                        Kokonaisvelka
                      </span>
                      <span className="text-2xl font-bold mt-1">{formatCurrency(totalDebt)}</span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Aika velattomuuteen
                      </span>
                      <span className="text-2xl font-bold mt-1">{payoffPlan.totalMonths} kuukautta</span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-card rounded-md border">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <PercentIcon className="h-4 w-4 mr-2" />
                        Maksetut korot
                      </span>
                      <span className="text-2xl font-bold mt-1">{formatCurrency(payoffPlan.totalInterestPaid)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Vähimmäismaksut</span>
                      <p className="font-medium">{formatCurrency(totalMinPayment)}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Lisämaksu</span>
                      <p className="font-medium">{formatCurrency(monthlyBudget - totalMinPayment)}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Kuukausittain yhteensä</span>
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
