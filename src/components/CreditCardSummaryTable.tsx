
import React from "react";
import { 
  CreditCard, 
  calculateCreditCard, 
  calculateMonthlyInterest,
  calculateTotalInterest,
  formatUtilizationRate
} from "@/utils/creditCardCalculations";
import { formatCurrency } from "@/utils/loanCalculations";
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

interface CreditCardSummaryTableProps {
  creditCards: CreditCard[];
  isDemo?: boolean;
}

export default function CreditCardSummaryTable({ creditCards, isDemo = false }: CreditCardSummaryTableProps) {
  const { t } = useLanguage();

  // Calculate totals
  let totalMinPayment = 0;
  let totalMonthlyInterest = 0;
  let totalInterestEstimate = 0;

  // Process credit card data
  const cardData = creditCards.map(card => {
    const calculation = calculateCreditCard(card);
    
    totalMinPayment += calculation.effectivePayment;
    totalMonthlyInterest += calculation.monthlyInterest;
    totalInterestEstimate += calculation.totalInterest;
    
    return {
      card,
      calculation
    };
  });

  return (
    <Card className="overflow-hidden">
      {isDemo && (
        <div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <AlertCircle size={16} />
          <p className="text-sm font-medium">{t("debtSummary.demoDataMessage")}</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("debtSummary.cardName")}</TableHead>
              <TableHead>{t("debtSummary.monthlyPayment")}</TableHead>
              <TableHead>{t("debtSummary.monthlyInterest")}</TableHead>
              <TableHead>{t("debtSummary.totalInterestEstimate")}</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {cardData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {t("debtSummary.noCardsMessage")}
                </TableCell>
              </TableRow>
            ) : (
              cardData.map(({ card, calculation }) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.name}</TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.effectivePayment}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.monthlyInterest}
                      formatter={formatCurrency}
                    />
                  </TableCell>
                  <TableCell>
                    {calculation.totalInterest === Infinity ? (
                      <span className="text-destructive font-medium">
                        {t("debtSummary.neverPaidOff")}
                      </span>
                    ) : (
                      <AnimatedNumber
                        value={calculation.totalInterest}
                        formatter={formatCurrency}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          
          {cardData.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">{t("debtSummary.totalCards")}</TableCell>
                <TableCell className="font-bold">
                  <AnimatedNumber
                    value={totalMinPayment}
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
                  {totalInterestEstimate === Infinity ? (
                    <span className="text-destructive font-medium">
                      {t("debtSummary.neverPaidOff")}
                    </span>
                  ) : (
                    <AnimatedNumber
                      value={totalInterestEstimate}
                      formatter={formatCurrency}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </Card>
  );
}
