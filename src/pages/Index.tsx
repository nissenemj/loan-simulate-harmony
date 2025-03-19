
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  Loan, 
  calculateTotalMonthlyPayment, 
  generateRecommendations 
} from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { useTranslation } from "@/contexts/LanguageContext";

import LoanForm from "@/components/LoanForm";
import LoanTable from "@/components/LoanTable";
import LoanSummary from "@/components/LoanSummary";
import CreditCardForm from "@/components/CreditCardForm";
import CreditCardTable from "@/components/CreditCardTable";
import CreditCardSummary from "@/components/CreditCardSummary";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const { t } = useTranslation();

  const handleAddLoan = (loan: Loan) => {
    setLoans((prev) => [...prev, loan]);
  };

  const handleToggleLoanActive = (id: string, isActive: boolean) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, isActive } : loan))
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
          <LanguageSwitcher className="mt-4 md:mt-0" />
        </div>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="loans">{t("tabs.loans")}</TabsTrigger>
          <TabsTrigger value="creditCards">{t("tabs.creditCards")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loans" className="space-y-8">
          <LoanForm onAddLoan={handleAddLoan} />
          
          <LoanTable loans={loans} onToggleActive={handleToggleLoanActive} />
          
          {activeLoans.length > 0 && (
            <>
              <LoanSummary
                totalPayment={totalPayment}
                totalPrincipal={totalPrincipal}
                totalInterest={totalInterest}
                recommendations={recommendations}
              />
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
