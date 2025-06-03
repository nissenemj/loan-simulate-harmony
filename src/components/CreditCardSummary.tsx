
import { CreditCard, calculateCreditCardSummary, formatUtilizationRate } from "@/utils/creditCardCalculations";
import { formatCurrency } from "@/utils/loanCalculations";
import AnimatedNumber from "@/components/AnimatedNumber";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreditCardSummaryProps {
  creditCards: CreditCard[];
}

export default function CreditCardSummary({ creditCards }: CreditCardSummaryProps) {
  const activeCreditCards = creditCards.filter(card => card.isActive);
  
  if (activeCreditCards.length === 0) {
    return null;
  }
  
  const summary = calculateCreditCardSummary(activeCreditCards);
  
  // Define summary items
  const summaryItems = [
    {
      label: "Saldo yhteensä",
      value: summary.totalBalance,
      formatter: formatCurrency,
    },
    {
      label: "Vähimmäismaksu yhteensä",
      value: summary.totalMinPayment,
      formatter: formatCurrency,
    },
    {
      label: "Kuukausikorko yhteensä",
      value: summary.totalMonthlyInterest,
      formatter: formatCurrency,
    },
    {
      label: "Luottoraja yhteensä",
      value: summary.totalLimit,
      formatter: formatCurrency,
    },
    {
      label: "Käyttöaste yhteensä",
      value: summary.totalUtilization,
      formatter: formatUtilizationRate,
    },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-left">Luottokorttiyhteenveto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryItems.map((item) => (
            <div key={item.label} className="bg-muted p-4 rounded-lg text-left">
              <div className="text-sm font-medium text-muted-foreground mb-1">{item.label}</div>
              <div className="text-2xl font-bold">
                <AnimatedNumber
                  value={item.value}
                  formatter={item.formatter}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
