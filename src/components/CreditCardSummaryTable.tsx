
import React from "react";
import { 
  CreditCard, 
  calculateCreditCard, 
  calculateMonthlyInterest,
  calculateTotalInterest,
  formatUtilizationRate
} from "@/utils/creditCardCalculations";
import { formatCurrency } from "@/utils/loanCalculations";
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
import { Button } from "@/components/ui/button";

interface CreditCardSummaryTableProps {
  creditCards: CreditCard[];
  isDemo?: boolean;
  onPayoffCreditCard?: (id: string) => void;
}

export default function CreditCardSummaryTable({ 
  creditCards,
  isDemo = false,
  onPayoffCreditCard 
}: CreditCardSummaryTableProps) {
  const activeCreditCards = creditCards.filter(card => card.isActive);
  
  if (activeCreditCards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Ei aktiivisia luottokortteja</h3>
        <p className="text-muted-foreground">
          Lisää luottokorttitietosi nähdäksesi yhteenvedon.
        </p>
      </Card>
    );
  }

  // Calculate totals
  const totalBalance = activeCreditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalMinPayment = activeCreditCards.reduce((sum, card) => sum + card.minPayment, 0);
  const totalMonthlyInterest = activeCreditCards.reduce((sum, card) => 
    sum + calculateMonthlyInterest(card), 0
  );

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Kortin nimi</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="text-right">Luottoraja</TableHead>
              <TableHead className="text-right">Korko</TableHead>
              <TableHead className="text-right">Vähimmäismaksu</TableHead>
              <TableHead className="text-right">Käyttöaste</TableHead>
              <TableHead className="text-right">Kuukausikorko</TableHead>
              {onPayoffCreditCard && <TableHead className="text-right">Toiminnot</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeCreditCards.map((card) => {
              const monthlyInterest = calculateMonthlyInterest(card);
              const utilizationRate = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
              
              return (
                <TableRow key={card.id}>
                  <TableCell className="font-medium text-left">{card.name}</TableCell>
                  <TableCell className="text-right">
                    <AnimatedNumber value={card.balance} formatter={formatCurrency} />
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(card.limit)}</TableCell>
                  <TableCell className="text-right">{card.interestRate.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    <AnimatedNumber value={card.minPayment} formatter={formatCurrency} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={utilizationRate > 80 ? "text-red-500" : utilizationRate > 50 ? "text-yellow-500" : "text-green-500"}>
                      {formatUtilizationRate(utilizationRate / 100)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <AnimatedNumber value={monthlyInterest} formatter={formatCurrency} />
                  </TableCell>
                  {onPayoffCreditCard && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPayoffCreditCard(card.id)}
                        disabled={card.balance === 0}
                      >
                        Merkitse maksetuksi
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-left">Yhteensä</TableCell>
              <TableCell className="text-right font-bold">
                <AnimatedNumber value={totalBalance} formatter={formatCurrency} />
              </TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right font-bold">
                <AnimatedNumber value={totalMinPayment} formatter={formatCurrency} />
              </TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right font-bold">
                <AnimatedNumber value={totalMonthlyInterest} formatter={formatCurrency} />
              </TableCell>
              {onPayoffCreditCard && <TableCell className="text-right">-</TableCell>}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Card>
  );
}
