
import React from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DebtBreakdownChart } from '@/components/calculator/DebtBreakdownChart'; 
import { PaymentBreakdownChart } from '@/components/calculator/PaymentBreakdownChart';
import { StrategyComparisonChart } from '@/components/calculator/StrategyComparisonChart';
import { Info } from 'lucide-react';

interface DebtVisualizationProps {
  debts: Debt[];
  paymentPlan?: PaymentPlan | null;
}

/**
 * Debt Visualization component
 * Provides different visualization options for debt data
 */
const DebtVisualization = ({ debts, paymentPlan }: DebtVisualizationProps) => {
  
  // Check if we have valid debts to display
  const hasValidDebts = debts && debts.length > 0 && debts.some(debt => debt.balance > 0);
  
  if (!hasValidDebts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Velkojen erittely</CardTitle>
          <CardDescription>Kuinka velkasi jakautuvat</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>Ei velkoja visualisoitavaksi</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <DebtBreakdownChart debts={debts} paymentPlan={paymentPlan || undefined} />
      </div>
      
      {paymentPlan && paymentPlan.monthlyPlans && paymentPlan.monthlyPlans.length > 0 ? (
        <div className="w-full">
          <PaymentBreakdownChart paymentPlan={paymentPlan} />
        </div>
      ) : null}
      
      <div className="w-full">
        <StrategyComparisonChart debts={debts} />
      </div>
    </div>
  );
};

export default DebtVisualization;
