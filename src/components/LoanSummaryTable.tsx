
import React from "react";
import { Loan, calculateLoan, formatCurrency } from "@/utils/loanCalculations";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";

interface LoanSummaryTableProps {
  loans: Loan[];
  isDemo?: boolean;
}

export default function LoanSummaryTable({ loans, isDemo = false }: LoanSummaryTableProps) {
  const { t } = useLanguage();

  // Calculate totals
  let totalMonthlyPayment = 0;
  let totalMonthlyInterest = 0;
  let totalInterestEstimate = 0;
  let totalAmountToBePaid = 0;

  // Process loan data
  const loanData = loans.map(loan => {
    const calculation = calculateLoan(loan);
    
    totalMonthlyPayment += calculation.monthlyPayment;
    totalMonthlyInterest += calculation.firstMonthInterest; // Use firstMonthInterest for monthly interest
    totalInterestEstimate += calculation.totalInterest;
    totalAmountToBePaid += calculation.totalAmountPaid;
    
    return {
      loan,
      calculation
    };
  });

  return (
    <Card className="overflow-hidden">
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-300" role="alert" aria-live="polite">
          <AlertCircle size={16} aria-hidden="true" />
          <p className="text-sm font-medium">{t("debtSummary.demoDataMessage")}</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <caption className="sr-only">{t("debtSummary.tableSummary")}</caption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("debtSummary.loanName")}</TableHead>
              <TableHead>{t("debtSummary.monthlyPayment")}</TableHead>
              <TableHead>{t("debtSummary.monthlyInterest")}</TableHead>
              <TableHead>{t("debtSummary.totalInterestEstimate")}</TableHead>
              <TableHead>{t("debtSummary.totalAmountPaid")}</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loanData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {t("debtSummary.noLoansMessage")}
                </TableCell>
              </TableRow>
            ) : (
              loanData.map(({ loan, calculation }) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.name}</TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.monthlyPayment}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.firstMonthInterest}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.totalInterest}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.totalAmountPaid}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          
          {loanData.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">{t("debtSummary.totalLoans")}</TableCell>
                <TableCell className="font-bold">
                  <AnimatedNumber
                    value={totalMonthlyPayment}
                    formatter={formatCurrency}
                  />
                </TableCell>
                <TableCell className="font-bold">
                  <AnimatedNumber
                    value={totalMonthlyInterest}
                    formatter={formatCurrency}
                  />
                </TableCell>
                <TableCell className="font-bold">
                  <AnimatedNumber
                    value={totalInterestEstimate}
                    formatter={formatCurrency}
                  />
                </TableCell>
                <TableCell className="font-bold">
                  <AnimatedNumber
                    value={totalAmountToBePaid}
                    formatter={formatCurrency}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </Card>
  );
}
