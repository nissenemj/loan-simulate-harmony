
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrencyFormatter } from '@/utils/formatting';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Calendar, Coins, TrendingDown, Clock, ArrowDownToLine } from 'lucide-react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { cn } from '@/lib/utils';

interface RealTimeResultsProps {
  debts: Debt[];
  paymentPlan: PaymentPlan | null;
  isCalculating: boolean;
  className?: string;
}

/**
 * Component to display real-time calculation results with visual feedback
 */
const RealTimeResults: React.FC<RealTimeResultsProps> = ({
  debts,
  paymentPlan,
  isCalculating,
  className
}) => {
  const currencyFormatter = useCurrencyFormatter();
  
  // Calculate total minimum payment
  const totalMinPayment = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  }, [debts]);
  
  // Calculate debt-free date
  const debtFreeDate = useMemo(() => {
    if (!paymentPlan) return null;
    
    const today = new Date();
    const monthsToPayoff = paymentPlan.totalMonths;
    const payoffDate = new Date(today);
    payoffDate.setMonth(today.getMonth() + monthsToPayoff);
    
    return payoffDate;
  }, [paymentPlan]);
  
  // Format the debt-free date based on the current language
  const formattedDebtFreeDate = useMemo(() => {
    if (!debtFreeDate) return '';
    
    return format(debtFreeDate, 'MMMM yyyy', { locale: fi });
  }, [debtFreeDate]);
  
  // Calculate time saved compared to minimum payments
  const timeSaved = useMemo(() => {
    if (!paymentPlan || !totalMinPayment) return null;
    
    // This is a simplified calculation - in a real app, you would compare
    // with an actual minimum payment plan calculation
    const estimatedMinMonths = Math.round(
      debts.reduce((sum, debt) => {
        // Simple estimation for minimum payment timeline
        const balance = debt.balance;
        const rate = debt.interestRate / 100 / 12;
        const payment = debt.minimumPayment;
        
        // Simplified calculation - in reality would need to account for compounding
        if (rate === 0) return sum + balance / payment;
        
        // Estimate months using simplified formula
        const months = -Math.log(1 - (balance * rate) / payment) / Math.log(1 + rate);
        return sum + (isNaN(months) ? 0 : months);
      }, 0)
    );
    
    return Math.max(0, estimatedMinMonths - paymentPlan.totalMonths);
  }, [paymentPlan, debts, totalMinPayment]);
  
  // Calculate interest saved compared to minimum payments
  const interestSaved = useMemo(() => {
    if (!paymentPlan || !totalMinPayment) return null;
    
    // This is a simplified calculation - in a real app, you would compare
    // with an actual minimum payment plan calculation
    const estimatedMinInterest = debts.reduce((sum, debt) => {
      const balance = debt.balance;
      const rate = debt.interestRate / 100 / 12;
      const payment = debt.minimumPayment;
      
      // Simple estimation for minimum payment interest
      if (rate === 0) return sum;
      
      // Estimate months using simplified formula
      const months = -Math.log(1 - (balance * rate) / payment) / Math.log(1 + rate);
      
      // Estimate total interest
      const totalPayments = payment * months;
      const interest = totalPayments - balance;
      
      return sum + (isNaN(interest) ? 0 : interest);
    }, 0);
    
    return Math.max(0, estimatedMinInterest - paymentPlan.totalInterestPaid);
  }, [paymentPlan, debts, totalMinPayment]);
  
  if (!paymentPlan && !isCalculating) {
    return null;
  }
  
  return (
    <Card className={cn("bg-card/50 border border-border/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Tulokset
          {isCalculating && (
            <div className="ml-2 h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Debt-free date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Velkavapaus päivä
                <HelpTooltip content="Päivä jolloin kaikki velkasi on maksettu" className="ml-1" />
              </h3>
            </div>
            <div className="text-2xl font-bold">
              {isCalculating ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : formattedDebtFreeDate}
            </div>
            <p className="text-sm text-muted-foreground">
              {isCalculating ? (
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
              ) : (
                paymentPlan && (
                  <>
                    {paymentPlan.strategy === 'avalanche' ? (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        Lumivyöry strategia
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ArrowDownToLine className="h-4 w-4" />
                        Lumipallo strategia
                      </span>
                    )}
                  </>
                )
              )}
            </p>
          </div>
          
          {/* Total interest paid */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Kokonaiskorot
                <HelpTooltip content="Kuinka paljon maksat korkoja yhteensä" className="ml-1" />
              </h3>
            </div>
            <div className="text-2xl font-bold">
              {isCalculating ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : paymentPlan && currencyFormatter.format(paymentPlan.totalInterestPaid)}
            </div>
            <p className="text-sm text-muted-foreground">
              {isCalculating ? (
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
              ) : (
                paymentPlan && (
                  <>
                    {paymentPlan.totalMonths} kuukaudessa
                  </>
                )
              )}
            </p>
          </div>
          
          {/* Time saved */}
          {timeSaved && timeSaved > 0 && (
            <div className="space-y-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-medium">
                  Säästetty aika
                </h3>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {timeSaved} kuukautta
              </div>
              <p className="text-sm">
                Verrattuna vähimmäismaksuihin
              </p>
            </div>
          )}
          
          {/* Interest saved */}
          {interestSaved && interestSaved > 0 && (
            <div className="space-y-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-medium">
                  Säästetyt korot
                </h3>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {currencyFormatter.format(interestSaved)}
              </div>
              <p className="text-sm">
                Verrattuna vähimmäismaksuihin
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeResults;
