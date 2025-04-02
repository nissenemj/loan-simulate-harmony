
import React from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DebtBreakdownChart } from '@/components/calculator/DebtBreakdownChart'; 
import { PaymentBreakdownChart } from '@/components/calculator/PaymentBreakdownChart';
import { StrategyComparisonChart } from '@/components/calculator/StrategyComparisonChart';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <DebtBreakdownChart debts={debts} paymentPlan={paymentPlan} />
      </div>
      
      {paymentPlan && (
        <div className="w-full">
          <PaymentBreakdownChart paymentPlan={paymentPlan} />
        </div>
      )}
      
      <div className="w-full">
        <StrategyComparisonChart debts={debts} />
      </div>
    </div>
  );
}
