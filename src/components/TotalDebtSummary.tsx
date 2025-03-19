
import React from "react";
import { Loan, calculateLoan, formatCurrency } from "@/utils/loanCalculations";
import { 
  CreditCard, 
  calculateCreditCard 
} from "@/utils/creditCardCalculations";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";

interface TotalDebtSummaryProps {
  loans: Loan[];
  creditCards: CreditCard[];
  isDemo?: boolean;
  totalDebtBalance?: number;
}

export default function TotalDebtSummary({ loans, creditCards, isDemo = false, totalDebtBalance }: TotalDebtSummaryProps) {
  const { t } = useLanguage();

  // Calculate loan totals
  let totalLoanMonthlyPayment = 0;
  let totalLoanMonthlyInterest = 0;
  let totalLoanInterestEstimate = 0;
  let totalLoanMonthlyFee = 0;

  loans.forEach(loan => {
    const calculation = calculateLoan(loan);
    totalLoanMonthlyPayment += calculation.monthlyPayment;
    totalLoanMonthlyInterest += calculation.interest;
    totalLoanInterestEstimate += calculation.totalInterest;
    
    // Add monthly fee if present
    if (loan.monthlyFee) {
      totalLoanMonthlyFee += loan.monthlyFee;
    }
  });

  // Calculate credit card totals
  let totalCardMonthlyPayment = 0;
  let totalCardMonthlyInterest = 0;
  let totalCardInterestEstimate = 0;
  let hasInfiniteInterest = false;

  creditCards.forEach(card => {
    const calculation = calculateCreditCard(card);
    totalCardMonthlyPayment += calculation.effectivePayment;
    totalCardMonthlyInterest += calculation.monthlyInterest;
    
    if (calculation.totalInterest === Infinity) {
      hasInfiniteInterest = true;
    } else {
      totalCardInterestEstimate += calculation.totalInterest;
    }
  });

  // Calculate total sums
  const totalMonthlyPayment = totalLoanMonthlyPayment + totalCardMonthlyPayment;
  const totalMonthlyInterest = totalLoanMonthlyInterest + totalCardMonthlyInterest;
  const totalInterestEstimate = hasInfiniteInterest ? Infinity : totalLoanInterestEstimate + totalCardInterestEstimate;
  
  // For total balance, either use the provided value or calculate
  const totalBalance = totalDebtBalance ?? loans.reduce((sum, loan) => sum + loan.amount, 0) + 
    creditCards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <Card className="overflow-hidden">
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <AlertCircle size={16} />
          <p className="text-sm font-medium">{t("debtSummary.demoDataMessage")}</p>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t("debtSummary.totalMonthlyPayment")}</h3>
            <div className="text-3xl font-bold">
              <AnimatedNumber
                value={totalMonthlyPayment}
                formatter={formatCurrency}
              />
            </div>
            {totalLoanMonthlyFee > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("debtSummary.includesFees")}: {formatCurrency(totalLoanMonthlyFee)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t("debtSummary.totalMonthlyInterest")}</h3>
            <div className="text-3xl font-bold">
              <AnimatedNumber
                value={totalMonthlyInterest}
                formatter={formatCurrency}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t("debtSummary.totalLifetimeInterest")}</h3>
            <div className="text-3xl font-bold">
              {totalInterestEstimate === Infinity ? (
                <span className="text-destructive">
                  {t("debtSummary.neverPaidOff")}
                </span>
              ) : (
                <AnimatedNumber
                  value={totalInterestEstimate}
                  formatter={formatCurrency}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t("debtSummary.totalBalance")}</h3>
            <div className="text-3xl font-bold">
              <AnimatedNumber
                value={totalBalance}
                formatter={formatCurrency}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-muted-foreground text-sm">
          <p>{t("debtSummary.summaryExplanation")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
