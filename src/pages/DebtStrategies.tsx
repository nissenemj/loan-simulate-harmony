
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

const DebtStrategies = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const [debts, setDebts] = useState<Debt[]>(() => {
    // Convert loans and credit cards to Debt objects
    const loanDebts: Debt[] = loans
      .filter(loan => loan.isActive)
      .map(loan => ({
        id: loan.id,
        name: loan.name,
        balance: loan.amount,
        interestRate: loan.interestRate,
        minimumPayment: loan.minPayment || loan.amount * loan.interestRate / 100 / 12,
        type: 'loan'
      }));
    
    const creditCardDebts: Debt[] = creditCards
      .filter(card => card.isActive)
      .map(card => ({
        id: card.id,
        name: card.name,
        balance: card.balance,
        interestRate: card.apr,
        minimumPayment: Math.max(card.minPayment, card.balance * (card.minPaymentPercent / 100)),
        type: 'credit-card'
      }));
    
    return [...loanDebts, ...creditCardDebts];
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
    if (error.message && error.message.includes("maximum number of months")) {
      setCalculationError("Takaisinmaksu kestäisi liian kauan nykyisellä budjetilla. Kokeile suurempaa kuukausittaista budjettia.");
    } else {
      setCalculationError(error.message || "Virhe laskennassa. Tarkista syöttötiedot.");
    }
  };
  
  return (
    <ErrorProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Helmet>
          <title>Velkastrategiat | Velkavapaus</title>
        </Helmet>
        
        <div className="space-y-6">
          <BreadcrumbNav />
          <UnderConstructionBanner />
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Velkastrategiat</h1>
            <p className="text-muted-foreground mt-2">
              Vertaa eri takaisinmaksustrategioita ja löydä sinulle paras tapa päästä eroon veloista
            </p>
          </div>
          
          {(loans.length === 0 && creditCards.length === 0) ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Lisää ensin velkoja laskurissa aloittaaksesi takaisinmaksusuunnitelman.
              </AlertDescription>
            </Alert>
          ) : (
            <>
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
                        Laske ensin takaisinmaksusuunnitelma Laskuri-välilehdellä nähdäksesi aikajanar.
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
            </>
          )}
        </div>
      </div>
    </ErrorProvider>
  );
};

export default DebtStrategies;
