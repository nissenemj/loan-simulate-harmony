
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, DollarSign, Percent, Calendar, CreditCard as CreditCardIcon } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import { cn } from "@/lib/utils";

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
    <Card className="overflow-hidden shadow-md border-border">
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <AlertCircle size={16} />
          <p className="text-sm font-medium">{t("debtSummary.demoDataMessage")}</p>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          {t("debtSummary.title")}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <DebtMetricCard 
            title={t("debtSummary.totalMonthlyPayment")}
            value={totalMonthlyPayment}
            icon={<Calendar className="h-5 w-5 text-primary" />}
            note={totalLoanMonthlyFee > 0 ? t("debtSummary.includesFees") + ': ' + formatCurrency(totalLoanMonthlyFee) : undefined}
          />
          
          <DebtMetricCard 
            title={t("debtSummary.totalMonthlyInterest")}
            value={totalMonthlyInterest}
            icon={<Percent className="h-5 w-5 text-primary" />}
          />
          
          <DebtMetricCard 
            title={t("debtSummary.totalLifetimeInterest")}
            value={totalInterestEstimate}
            icon={<Calendar className="h-5 w-5 text-primary" />}
            isInfinite={totalInterestEstimate === Infinity}
            infiniteText={t("debtSummary.neverPaidOff")}
          />
          
          <DebtMetricCard 
            title={t("debtSummary.totalBalance")}
            value={totalBalance}
            icon={<CreditCardIcon className="h-5 w-5 text-primary" />}
          />
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm">
          <p>{t("debtSummary.summaryExplanation")}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface DebtMetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  note?: string;
  isInfinite?: boolean;
  infiniteText?: string;
  className?: string;
}

function DebtMetricCard({ 
  title, 
  value, 
  icon, 
  note, 
  isInfinite = false,
  infiniteText = "∞",
  className 
}: DebtMetricCardProps) {
  return (
    <div className={cn("space-y-2 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      
      <div className="text-2xl font-bold h-10 flex items-center">
        {isInfinite ? (
          <div className="text-destructive w-full flex items-center">
            {infiniteText}
          </div>
        ) : (
          <div className="w-full flex items-center">
            <AnimatedNumber
              value={typeof value === 'number' ? value : 0}
              formatter={formatCurrency}
            />
          </div>
        )}
      </div>
      
      {note && (
        <p className="text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
