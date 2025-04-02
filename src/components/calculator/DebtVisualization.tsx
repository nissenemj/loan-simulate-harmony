
import React from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtBreakdownChart } from './DebtBreakdownChart'; 
import { PaymentBreakdownChart } from './PaymentBreakdownChart';
import { StrategyComparisonChart } from './StrategyComparisonChart';

interface DebtVisualizationProps {
  debts: Debt[];
  paymentPlan?: PaymentPlan;
}

/**
 * Debt Visualization component
 * Provides different visualization options for debt data
 */
export function DebtVisualization({ debts, paymentPlan }: DebtVisualizationProps) {
  const { t } = useTranslation();
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('visualization.debtBreakdown')}</CardTitle>
          <CardDescription>{t('visualization.breakdownDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{t('visualization.noDebtsToVisualize')}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <DebtBreakdownChart debts={debts} paymentPlan={paymentPlan} />
      
      {paymentPlan && (
        <PaymentBreakdownChart paymentPlan={paymentPlan} />
      )}
      
      <StrategyComparisonChart debts={debts} />
    </div>
  );
}
