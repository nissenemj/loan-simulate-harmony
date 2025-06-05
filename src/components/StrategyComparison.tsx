import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/loanCalculations';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';

interface StrategyComparisonProps {
  loans: Loan[];
  creditCards: CreditCard[];
  additionalBudget: number;
}

const StrategyComparison: React.FC<StrategyComparisonProps> = ({ loans, creditCards, additionalBudget }) => {
  const totalDebt = useMemo(() => {
    let total = 0;
    loans.forEach(loan => total += loan.amount);
    creditCards.forEach(card => total += card.balance);
    return total;
  }, [loans, creditCards]);

  const highestInterestRate = useMemo(() => {
    let rate = 0;
    loans.forEach(loan => {
      if (loan.interestRate > rate) {
        rate = loan.interestRate;
      }
    });
    creditCards.forEach(card => {
      if (card.apr > rate) {
        rate = card.apr;
      }
    });
    return rate;
  }, [loans, creditCards]);

  const monthlyPayments = useMemo(() => {
    let payment = 0;
    loans.forEach(loan => {
      // Assuming a simple monthly payment calculation for loans
      payment += (loan.amount * (loan.interestRate / 100 / 12)) / (1 - Math.pow(1 + (loan.interestRate / 100 / 12), -loan.termYears * 12));
    });
    creditCards.forEach(card => {
      // Assuming minimum payment for credit cards
      payment += card.minPayment;
    });
    return payment;
  }, [loans, creditCards]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vertailu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Velan määrä yhteensä</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalDebt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Korkein korko</p>
            <p className="text-2xl font-semibold">{highestInterestRate}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Kuukausittaiset lyhennykset</p>
            <p className="text-2xl font-semibold">{formatCurrency(monthlyPayments)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lisäbudjetti</p>
            <p className="text-2xl font-semibold">{formatCurrency(additionalBudget)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyComparison;
