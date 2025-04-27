
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Calculator, LineChart, Coins, TrendingDown, Bookmark, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsletterSignup from '@/components/NewsletterSignup';
import { BackgroundBeams } from "@/components/ui/background-beams";
import BreadcrumbNav from '@/components/BreadcrumbNav';
import UnderConstructionBanner from '@/components/UnderConstructionBanner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { convertLoanToDebtItem, convertCreditCardToDebtItem, DebtItem } from '@/utils/repayment';
import { toast } from 'sonner';
import { 
  getRepaymentStrategies, 
  getActiveStrategy, 
  SavedRepaymentStrategy, 
  setActiveStrategyId 
} from '@/utils/repayment';
import { useCalculationCache } from '@/hooks/useCalculationCache';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import debt-related components
import DebtVisualization from '@/components/calculator/DebtVisualization';
import DebtPayoffCalculator from '@/components/calculator/DebtPayoffCalculator';
import { DebtPayoffTimeline } from '@/components/calculator/DebtPayoffTimeline';
import DebtConsolidationCalculator from '@/components/calculator/DebtConsolidationCalculator';
import ExtraPaymentCalculator from '@/components/calculator/ExtraPaymentCalculator';

// Import types
import { Debt, PaymentPlan } from '@/utils/calculator/types';

const DebtStrategies = () => {
  // Load stored loans and credit cards from local storage
  const [storedLoans, setStoredLoans] = useLocalStorage<Loan[]>("loans", []);
  const [storedCreditCards, setStoredCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  
  // State management for debts and payment plans
  const [loans, setLoans] = useState<Debt[]>([]);
  const [creditCards, setCreditCards] = useState<Debt[]>([]);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  // State for saved strategies
  const [savedStrategies, setSavedStrategies] = useState<SavedRepaymentStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<SavedRepaymentStrategy | null>(null);
  
  // Cache for calculations
  const { getCachedResult, setCachedResult, generateCacheKey } = useCalculationCache<PaymentPlan>();
  
  // Effect to convert stored loans and credit cards to debt items
  useEffect(() => {
    // Filter for active loans and credit cards
    const activeLoans = storedLoans.filter(loan => loan.isActive);
    const activeCards = storedCreditCards.filter(card => card.isActive);

    // Convert loans to debt items
    const loanDebts: Debt[] = activeLoans.map(loan => ({
      id: loan.id,
      name: loan.name,
      balance: loan.amount,
      interestRate: loan.interestRate,
      minimumPayment: loan.minPayment || calculateMinPayment(loan),
      type: 'loan'
    }));

    // Convert credit cards to debt items
    const cardDebts: Debt[] = activeCards.map(card => ({
      id: card.id,
      name: card.name,
      balance: card.balance,
      interestRate: card.apr,
      minimumPayment: Math.max(card.minPayment, card.balance * (card.minPaymentPercent / 100)),
      type: 'credit-card'
    }));

    setLoans(loanDebts);
    setCreditCards(cardDebts);
    
    console.log('Loaded debts:', { loanDebts, cardDebts });
  }, [storedLoans, storedCreditCards]);
  
  // Load saved strategies on mount
  useEffect(() => {
    try {
      const strategies = getRepaymentStrategies();
      setSavedStrategies(strategies);

      const active = getActiveStrategy();
      if (active) {
        setActiveStrategy(active);
        
        // If active strategy has payment data, load it
        if (active.timeline && active.timeline.length > 0) {
          // Create a payment plan from the saved strategy
          const simulatedPaymentPlan: PaymentPlan = {
            monthlyPlans: active.timeline.map(month => ({
              month: month.month,
              date: new Date(new Date().setMonth(new Date().getMonth() + month.month)).toISOString().split('T')[0],
              payments: month.debts.map(debt => ({
                debtId: debt.id,
                amount: debt.payment,
                interestPaid: debt.interestPaid,
                principalPaid: debt.payment - debt.interestPaid,
                remainingBalance: debt.remainingBalance
              })),
              totalPaid: month.totalPaid,
              totalInterestPaid: month.totalInterestPaid,
              totalPrincipalPaid: month.totalPaid - month.totalInterestPaid,
              totalRemainingBalance: month.totalRemaining,
              debtsCompleted: []
            })),
            totalMonths: active.totalMonths || 0,
            totalInterestPaid: active.totalInterestPaid || 0,
            totalPaid: active.timeline.reduce((sum, month) => sum + month.totalPaid, 0),
            payoffDate: new Date(new Date().setMonth(new Date().getMonth() + (active.totalMonths || 0))).toISOString().split('T')[0],
            strategy: active.method === 'avalanche' ? 'avalanche' : active.method === 'snowball' ? 'snowball' : 'custom',
            monthlyPayment: active.monthlyBudget
          };
          
          setPaymentPlan(simulatedPaymentPlan);
          toast.info(t("debtStrategies.loadedActiveStrategy", { name: active.name }));
        }
      }
    } catch (error) {
      console.error("Error loading strategies:", error);
    }
  }, []);

  // Helper function to calculate minimum payment for loans
  const calculateMinPayment = (loan: Loan): number => {
    // Simple calculation for loan minimum payment if not provided
    return (loan.amount * loan.interestRate / 100 / 12) + (loan.amount / (loan.termYears * 12));
  };
  
  // Combined debts for calculations
  const debts = [...loans, ...creditCards];

  // Translation hook
  const { t } = useLanguage();
  
  // Handlers for calculator results
  const handleSaveResults = (plan: PaymentPlan) => {
    setPaymentPlan(plan);
    setCalculationError(null);
    
    // Cache the result
    const cacheKey = generateCacheKey(debts, plan.monthlyPayment, plan.strategy);
    setCachedResult(cacheKey, plan);
  };
  
  const handleCalculationError = (error: Error) => {
    setCalculationError(error.message);
    setPaymentPlan(null);
  };
  
  // Set active strategy
  const selectStrategy = (strategy: SavedRepaymentStrategy | null) => {
    if (strategy) {
      setActiveStrategy(strategy);
      setActiveStrategyId(strategy.id);
      
      // If active strategy has payment data, load it
      if (strategy.timeline && strategy.timeline.length > 0) {
        // Create a payment plan from the saved strategy
        const simulatedPaymentPlan: PaymentPlan = {
          monthlyPlans: strategy.timeline.map(month => ({
            month: month.month,
            date: new Date(new Date().setMonth(new Date().getMonth() + month.month)).toISOString().split('T')[0],
            payments: month.debts.map(debt => ({
              debtId: debt.id,
              amount: debt.payment,
              interestPaid: debt.interestPaid,
              principalPaid: debt.payment - debt.interestPaid,
              remainingBalance: debt.remainingBalance
            })),
            totalPaid: month.totalPaid,
            totalInterestPaid: month.totalInterestPaid,
            totalPrincipalPaid: month.totalPaid - month.totalInterestPaid,
            totalRemainingBalance: month.totalRemaining,
            debtsCompleted: []
          })),
          totalMonths: strategy.totalMonths || 0,
          totalInterestPaid: strategy.totalInterestPaid || 0,
          totalPaid: strategy.timeline.reduce((sum, month) => sum + month.totalPaid, 0),
          payoffDate: new Date(new Date().setMonth(new Date().getMonth() + (strategy.totalMonths || 0))).toISOString().split('T')[0],
          strategy: strategy.method === 'avalanche' ? 'avalanche' : strategy.method === 'snowball' ? 'snowball' : 'custom',
          monthlyPayment: strategy.monthlyBudget
        };
        
        setPaymentPlan(simulatedPaymentPlan);
      }
      
      toast.success(t("dashboard.strategySelected", { name: strategy.name }));
    } else {
      setActiveStrategy(null);
      setActiveStrategyId(null);
      toast.info(t("dashboard.strategyCleared"));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Helmet>
          <title>{t('debtStrategies.pageTitle')} | {t('app.title')}</title>
        </Helmet>
        
        <div className="space-y-6">
          <BreadcrumbNav />
          <UnderConstructionBanner />
          
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('debtStrategies.pageTitle')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('debtStrategies.pageDescription')}
              </p>
            </div>
            
            {savedStrategies.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    {activeStrategy
                      ? activeStrategy.name
                      : t("dashboard.selectStrategy")}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {t("dashboard.savedStrategies")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {savedStrategies.map((strategy) => (
                    <DropdownMenuItem
                      key={strategy.id}
                      onClick={() => selectStrategy(strategy)}
                      className={
                        activeStrategy?.id === strategy.id ? "bg-accent" : ""
                      }
                    >
                      {strategy.name} ({t(`dashboard.${strategy.method}Strategy`)})
                    </DropdownMenuItem>
                  ))}
                  {activeStrategy && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => selectStrategy(null)}>
                        {t("dashboard.clearStrategy")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {(loans.length === 0 && creditCards.length === 0) ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('debtStrategies.noDebtAlert')}
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
                    {t('debtStrategies.calculatorTab')}
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    {t('debtStrategies.timelineTab')}
                  </TabsTrigger>
                  <TabsTrigger value="extraPayment" className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    {t('debtStrategies.extraPaymentTab')}
                  </TabsTrigger>
                  <TabsTrigger value="consolidation" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    {t('debtStrategies.consolidationTab')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calculator">
                  <DebtPayoffCalculator 
                    initialDebts={debts}
                    onSaveResults={handleSaveResults}
                    onError={handleCalculationError}
                    initialStrategy={activeStrategy?.method === 'avalanche' ? 'avalanche' : 
                                    activeStrategy?.method === 'snowball' ? 'snowball' : undefined}
                    initialMonthlyPayment={activeStrategy?.monthlyBudget}
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
            </>
          )}
        </div>
      </div>
      
      <div className="relative h-[500px] w-full mt-16 rounded-lg overflow-hidden">
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
          <NewsletterSignup className="w-full max-w-xl relative z-10 bg-background/80 backdrop-blur-sm" />
        </div>
        <BackgroundBeams />
      </div>
    </div>
  );
};

export default DebtStrategies;
