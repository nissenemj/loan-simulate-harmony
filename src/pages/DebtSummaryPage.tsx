
import React from "react";
import { Helmet } from "react-helmet-async";
import DebtSummary from "./DebtSummary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DebtSummaryPage() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const { t } = useLanguage();

  const handlePayoffLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, amount: 0, isActive: false } : loan))
    );
    
    const loanName = loans.find(loan => loan.id === id)?.name || '';
    toast(t('toast.loanPaidOff', { name: loanName }));
  };

  const handlePayoffCreditCard = (id: string) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, balance: 0, isActive: false } : card))
    );
    
    const cardName = creditCards.find(card => card.id === id)?.name || '';
    toast(t('toast.cardPaidOff', { name: cardName }));
  };

  return (
    <>
      <Helmet>
        <title>{t('debtSummary.pageTitle')} | {t('app.name')}</title>
        <meta name="description" content={t('debtSummary.metaDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <div className="container max-w-4xl mx-auto py-4 md:py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('debtSummary.pageTitle')}</h1>
        <DebtSummary 
          loans={loans} 
          creditCards={creditCards} 
          onPayoffLoan={handlePayoffLoan}
          onPayoffCreditCard={handlePayoffCreditCard}
        />
      </div>
    </>
  );
}
