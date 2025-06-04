
import { useState } from "react";
import { toast } from "sonner";
import { 
  CreditCard, 
  calculateCreditCard, 
  formatPayoffTime 
} from "@/utils/creditCardCalculations";
import { formatCurrency, formatPercentage } from "@/utils/loanCalculations";
import { Check, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import AnimatedNumber from "@/components/AnimatedNumber";

interface CreditCardTableProps {
  creditCards: CreditCard[];
  onToggleActive: (id: string, isActive: boolean) => void;
}

const formatUtilizationRate = (rate: number): string => {
  return (rate * 100).toFixed(1) + '%';
};

export default function CreditCardTable({ creditCards, onToggleActive }: CreditCardTableProps) {
  const handleToggleActive = (id: string, isActive: boolean) => {
    onToggleActive(id, isActive);
    
    const card = creditCards.find(card => card.id === id);
    if (card) {
      toast(isActive ? 
        "Kortti aktivoitu: " + card.name : 
        "Kortti poistettu käytöstä: " + card.name
      );
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Kortin nimi</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Vuosikorko</TableHead>
            <TableHead>Vähimmäismaksu</TableHead>
            <TableHead>Kuukausikorko</TableHead>
            <TableHead>Maksuaika</TableHead>
            <TableHead>Käyttöaste</TableHead>
            <TableHead className="text-right">Aktiivinen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditCards.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Ei lisättyjä luottokortteja
              </TableCell>
            </TableRow>
          ) : (
            creditCards.map((card) => {
              const calculation = calculateCreditCard(card);
              return (
                <TableRow 
                  key={card.id} 
                  className={!card.isActive ? "opacity-60" : ""}
                >
                  <TableCell className="font-medium">{card.name}</TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={card.balance}
                      formatter={(v) => formatCurrency(v)}
                    />
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={card.apr}
                      formatter={(v) => formatPercentage(v)}
                    />
                  </TableCell>
                  <TableCell>
                    {card.fullPayment ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        <Check className="w-3 h-3 mr-1" />
                        Täysi maksu
                      </span>
                    ) : (
                      <AnimatedNumber
                        value={Math.max(card.minPayment, card.balance * (card.minPaymentPercent / 100))}
                        formatter={(v) => formatCurrency(v)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <AnimatedNumber
                      value={calculation.monthlyInterest}
                      formatter={(v) => formatCurrency(v)}
                    />
                  </TableCell>
                  <TableCell>
                    {card.fullPayment ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        1 kuukausi
                      </span>
                    ) : calculation.payoffMonths === null ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                        <X className="w-3 h-3 mr-1" />
                        Ei koskaan maksettu pois
                      </span>
                    ) : (
                      formatPayoffTime(calculation.payoffMonths)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className={`absolute top-0 left-0 h-2.5 rounded-full ${
                          calculation.utilizationRate < 0.3 ? 'bg-green-500' :
                          calculation.utilizationRate < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(calculation.utilizationRate * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-right">
                      {formatUtilizationRate(calculation.utilizationRate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={card.isActive}
                      onCheckedChange={(checked) => handleToggleActive(card.id, checked)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
