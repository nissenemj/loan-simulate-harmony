
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  Loan, 
  calculateTotalMonthlyPayment, 
  generateRecommendations 
} from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { useLanguage } from "@/contexts/LanguageContext";

import LoanForm from "@/components/LoanForm";
import LoanTable from "@/components/LoanTable";
import LoanSummary from "@/components/LoanSummary";
import SavingsImpact from "@/components/SavingsImpact";
import CreditCardForm from "@/components/CreditCardForm";
import CreditCardTable from "@/components/CreditCardTable";
import CreditCardSummary from "@/components/CreditCardSummary";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const { t } = useLanguage();

  const handleAddLoan = (loan: Loan) => {
    setLoans((prev) => [...prev, loan]);
  };

  // Update this function to accept isActive parameter to match LoanTable prop
  const handleToggleLoanActive = (id: string, isActive?: boolean) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, isActive: isActive !== undefined ? isActive : !loan.isActive } : loan))
    );
  };

  const handleAddCreditCard = (card: CreditCard) => {
    setCreditCards((prev) => [...prev, card]);
  };

  const handleToggleCreditCardActive = (id: string, isActive: boolean) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isActive } : card))
    );
  };

  // Add a new function to handle loan payoff
  const handlePayoffLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, amount: 0, isActive: false } : loan))
    );
  };

  const activeLoans = loans.filter((loan) => loan.isActive);
  const { totalPayment, totalPrincipal, totalInterest } = calculateTotalMonthlyPayment(loans);
  const recommendations = generateRecommendations(loans);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">{t("app.title")}</h1>
            <p className="text-muted-foreground">
              {t("app.subtitle")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="loans">{t("tabs.loans")}</TabsTrigger>
          <TabsTrigger value="creditCards">{t("tabs.creditCards")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loans" className="space-y-8">
          <LoanForm onAddLoan={handleAddLoan} />
          
          <LoanTable loans={loans} onToggleLoan={handleToggleLoanActive} />
          
          {activeLoans.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <LoanSummary loans={activeLoans} />
                </div>
                <div>
                  <SavingsImpact loans={loans} onPayoffLoan={handlePayoffLoan} />
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="creditCards" className="space-y-8">
          <CreditCardForm onAddCreditCard={handleAddCreditCard} />
          
          <CreditCardTable 
            creditCards={creditCards} 
            onToggleActive={handleToggleCreditCardActive} 
          />
          
          <CreditCardSummary creditCards={creditCards} />
        </TabsContent>
      </Tabs>

      <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>{t("app.footer")}</p>
      </footer>
    </div>
  );
}
