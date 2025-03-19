
import React from "react";
import DebtSummary from "./DebtSummary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DebtSummaryPage() {
  // Get loans and credit cards from local storage
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const { t } = useLanguage();

  const handlePayoffLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, amount: 0, isActive: false } : loan))
    );
    
    const loanName = loans.find(loan => loan.id === id)?.name || '';
    toast.success(t('toast.loanPaidOff') + ': ' + loanName);
  };

  const handlePayoffCreditCard = (id: string) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, balance: 0, isActive: false } : card))
    );
    
    const cardName = creditCards.find(card => card.id === id)?.name || '';
    toast.success(t('toast.cardPaidOff') + ': ' + cardName);
  };

  return (
    <DebtSummary 
      loans={loans} 
      creditCards={creditCards} 
      onPayoffLoan={handlePayoffLoan}
      onPayoffCreditCard={handlePayoffCreditCard}
    />
  );
}
