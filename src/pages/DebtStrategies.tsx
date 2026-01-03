
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import {
  DebtPayoffCalculator,
  DebtPayoffTimeline,
  DebtConsolidationCalculator,
  ExtraPaymentCalculator,
  DebtVisualization
} from '@/components/calculator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, LineChart, TrendingDown, Coins } from 'lucide-react';
import UnderConstructionBanner from '@/components/UnderConstructionBanner';
import { ErrorProvider } from '@/contexts/ErrorContext';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import CrisisHelp from '@/components/CrisisHelp';

const DebtStrategies = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const [debts, setDebts] = useState<Debt[]>(() => {
    // Convert loans and credit cards to Debt objects with proper validation
    const loanDebts: Debt[] = loans
      .filter(loan => loan.isActive && loan.amount > 0)
      .map(loan => {
        // Calculate a reasonable minimum payment if not provided
        const calculatedMinPayment = loan.minPayment || Math.max(
          25, // Minimum €25
          loan.amount * (loan.interestRate / 100 / 12) + (loan.amount * 0.01) // Interest + 1% of principal
        );
        
        return {
          id: loan.id,
          name: loan.name,
          balance: loan.amount,
          interestRate: Math.max(0.1, loan.interestRate), // Ensure at least 0.1% interest
          minimumPayment: Math.max(10, calculatedMinPayment), // Ensure at least €10 minimum payment
          type: 'loan'
        };
      });
    
    const creditCardDebts: Debt[] = creditCards
      .filter(card => card.isActive && card.balance > 0)
      .map(card => {
        // Calculate minimum payment with fallback
        const calculatedMinPayment = Math.max(
          card.minPayment,
          card.balance * Math.max(0.02, card.minPaymentPercent / 100), // At least 2% of balance
          25 // Minimum €25
        );
        
        return {
          id: card.id,
          name: card.name,
          balance: card.balance,
          interestRate: Math.max(1, card.apr), // Ensure at least 1% APR for credit cards
          minimumPayment: calculatedMinPayment,
          type: 'credit-card'
        };
      });
    
    const allDebts = [...loanDebts, ...creditCardDebts];
    
    // Final validation - ensure all debts have valid values
    return allDebts.filter(debt => 
      debt.balance > 0 && 
      debt.interestRate > 0 && 
      debt.minimumPayment > 0 &&
      debt.name.trim().length > 0
    );
  });
  
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  // Handle saving payment plan
  const handleSaveResults = (plan: PaymentPlan) => {
    setCalculationError(null);
    setPaymentPlan(plan);
  };
  
  // Handle calculation errors
  const handleCalculationError = (error: any) => {
    console.error('Calculation error:', error);
    if (error.message && error.message.includes("maximum number of months")) {
      setCalculationError("Takaisinmaksu kestäisi liian kauan nykyisellä budjetilla. Kokeile suurempaa kuukausittaista budjettia.");
    } else if (error.message && error.message.includes("Available payment became negative")) {
      setCalculationError("Budjetti ei riitä kaikkien velkojen vähimmäismaksuihin. Tarkista velkasi ja lisää budjettia.");
    } else {
      setCalculationError(error.message || "Virhe laskennassa. Tarkista syöttötiedot.");
    }
  };
  
  // Debug logging
  console.log('Active debts for calculation:', debts);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  console.log('Total minimum payments:', totalMinPayments);
  
  return (
    <ErrorProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Helmet>
          <title>Velkastrategiat | Velkavapaus</title>
        </Helmet>
        
        <div className="space-y-6">
          <BreadcrumbNav />
          <UnderConstructionBanner />
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Velkastrategiat</h1>
            <p className="text-lg text-muted-foreground">
              Täällä näet, miten voit maksaa velkasi nopeammin.
            </p>

            {/* Strategioiden selitys selkokielellä */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <p className="font-medium">Kaksi tapaa maksaa velkoja:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-background rounded-lg p-3 border">
                  <p className="font-semibold text-primary">🏔️ Lumivyöry</p>
                  <p className="text-muted-foreground">
                    Maksa ensin velka, jolla on <strong>korkein korko</strong>.
                    <br />
                    <span className="text-green-600 dark:text-green-400">→ Säästät eniten rahaa</span>
                  </p>
                </div>
                <div className="bg-white dark:bg-background rounded-lg p-3 border">
                  <p className="font-semibold text-primary">❄️ Lumipallo</p>
                  <p className="text-muted-foreground">
                    Maksa ensin velka, jolla on <strong>pienin summa</strong>.
                    <br />
                    <span className="text-green-600 dark:text-green-400">→ Pikavoittoja ja motivaatiota</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {debts.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Lisää ensin velkoja laskurissa aloittaaksesi takaisinmaksusuunnitelman. 
                Varmista, että veloilla on positiiviset arvot saldolle, korolle ja vähimmäismaksulle.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Velkasi yhteenveto:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Velkoja yhteensä:</span>
                    <span className="ml-2 font-medium">{debts.length} kpl</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kokonaissaldo:</span>
                    <span className="ml-2 font-medium">
                      {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' })
                        .format(debts.reduce((sum, debt) => sum + debt.balance, 0))}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vähimmäismaksut yhteensä:</span>
                    <span className="ml-2 font-medium">
                      {new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' })
                        .format(totalMinPayments)}
                    </span>
                  </div>
                </div>
              </div>
              
              <DebtVisualization debts={debts} paymentPlan={paymentPlan} />
              
              {calculationError && (
                <Alert variant="destructive" className="my-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {calculationError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="calculator" className="w-full mt-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="calculator" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Laskuri
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    Aikajana
                  </TabsTrigger>
                  <TabsTrigger value="extraPayment" className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Lisämaksut
                  </TabsTrigger>
                  <TabsTrigger value="consolidation" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Yhdistäminen
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calculator">
                  <DebtPayoffCalculator 
                    initialDebts={debts}
                    onSaveResults={handleSaveResults}
                    onError={handleCalculationError}
                  />
                </TabsContent>
                
                <TabsContent value="timeline">
                  {paymentPlan ? (
                    <DebtPayoffTimeline 
                      debts={debts}
                      additionalPayment={paymentPlan.monthlyPayment - debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)}
                      strategy={paymentPlan.strategy}
                    />
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Laske ensin takaisinmaksusuunnitelma Laskuri-välilehdellä nähdäksesi aikajanan.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                
                <TabsContent value="extraPayment">
                  <ExtraPaymentCalculator debts={debts} />
                </TabsContent>
                
                <TabsContent value="consolidation">
                  <DebtConsolidationCalculator debts={debts} />
                </TabsContent>
              </Tabs>

              {/* Kriisiapu */}
              <div className="mt-12">
                <CrisisHelp variant="default" />
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorProvider>
  );
};

export default DebtStrategies;
