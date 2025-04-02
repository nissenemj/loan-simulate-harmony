
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { 
  DebtPayoffCalculator,
  DebtPayoffTimeline,
  DebtConsolidationCalculator,
  ExtraPaymentCalculator
} from '@/components/calculator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const DebtStrategies = () => {
  const { t } = useTranslation();
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
  
  // Handle saving payment plan
  const handleSaveResults = (plan: PaymentPlan) => {
    setPaymentPlan(plan);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Helmet>
        <title>{t('debtStrategies.pageTitle')} | {t('app.name')}</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('debtStrategies.pageTitle')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('debtStrategies.pageDescription')}
          </p>
        </div>
        
        {(loans.length === 0 && creditCards.length === 0) ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('debtStrategies.noDebtAlert')}
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="calculator">{t('calculator.debtPayoffCalculator')}</TabsTrigger>
              <TabsTrigger value="timeline">{t('calculator.debtPayoffTimeline')}</TabsTrigger>
              <TabsTrigger value="extraPayment">{t('calculator.extraPaymentImpact')}</TabsTrigger>
              <TabsTrigger value="consolidation">{t('calculator.debtConsolidation')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <DebtPayoffCalculator 
                initialDebts={debts}
                onSaveResults={handleSaveResults}
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
                    {t('debtStrategies.calculateFirst')}
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
        )}
      </div>
    </div>
  );
};

export default DebtStrategies;
