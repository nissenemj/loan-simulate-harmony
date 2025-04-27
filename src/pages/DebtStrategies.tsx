
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Calculator, LineChart, Coins, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsletterSignup from '@/components/NewsletterSignup';
import { BackgroundBeams } from "@/components/ui/background-beams";
import BreadcrumbNav from '@/components/BreadcrumbNav';
import UnderConstructionBanner from '@/components/UnderConstructionBanner';
import { Navigate } from 'react-router-dom';

// Import debt-related components
import DebtVisualization from '@/components/calculator/DebtVisualization';
import DebtPayoffCalculator from '@/components/calculator/DebtPayoffCalculator';
import DebtPayoffTimeline from '@/components/calculator/DebtPayoffTimeline';
import DebtConsolidationCalculator from '@/components/calculator/DebtConsolidationCalculator';
import ExtraPaymentCalculator from '@/components/calculator/ExtraPaymentCalculator';

// Import types
import { Debt, PaymentPlan } from '@/utils/calculator/types';

const DebtStrategies = () => {
  // State management for debts and payment plans
  const [loans, setLoans] = useState<Debt[]>([]);
  const [creditCards, setCreditCards] = useState<Debt[]>([]);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  // Combined debts for calculations
  const debts = [...loans, ...creditCards];

  // Translation hook
  const { t } = useLanguage();
  
  // Handlers for calculator results
  const handleSaveResults = (plan: PaymentPlan) => {
    setPaymentPlan(plan);
    setCalculationError(null);
  };
  
  const handleCalculationError = (error: Error) => {
    setCalculationError(error.message);
    setPaymentPlan(null);
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
