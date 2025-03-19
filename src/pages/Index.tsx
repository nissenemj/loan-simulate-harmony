
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
import AffiliateSection from "@/components/affiliate/AffiliateSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Index() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>("creditCards", []);
  const [loanToEdit, setLoanToEdit] = useState<Loan | null>(null);
  const { t } = useLanguage();

  const handleAddLoan = (loan: Loan) => {
    setLoans((prev) => [...prev, loan]);
    toast(t("toast.loanAdded"));
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan))
    );
    setLoanToEdit(null);
    toast(t("toast.loanUpdated"));
  };

  const handleEditLoan = (loan: Loan) => {
    setLoanToEdit(loan);
  };

  const handleCancelEdit = () => {
    setLoanToEdit(null);
  };

  const handleToggleLoanActive = (id: string, isActive?: boolean) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, isActive: isActive !== undefined ? isActive : !loan.isActive } : loan))
    );
  };

  const handleAddCreditCard = (card: CreditCard) => {
    setCreditCards((prev) => [...prev, card]);
    toast(t("toast.cardAdded"));
  };

  const handleToggleCreditCardActive = (id: string, isActive: boolean) => {
    setCreditCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isActive } : card))
    );
  };

  const handlePayoffLoan = (id: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, amount: 0, isActive: false } : loan))
    );
    toast(t("toast.loanPaidOff"));
  };

  const activeLoans = loans.filter((loan) => loan.isActive);
  const { totalPayment, totalPrincipal, totalInterest } = calculateTotalMonthlyPayment(loans);
  const recommendations = generateRecommendations(loans);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("tabs.loans")}</h1>
        <LanguageSwitcher />
      </div>
      
      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="loans">{t("tabs.loans")}</TabsTrigger>
          <TabsTrigger value="creditCards">{t("tabs.creditCards")}</TabsTrigger>
          {/* Affiliate tab hidden until we have content 
          <TabsTrigger value="affiliate">{t("tabs.affiliate")}</TabsTrigger>
          */}
        </TabsList>
        
        <TabsContent value="loans" className="space-y-8">
          <LoanForm 
            onAddLoan={handleAddLoan} 
            onUpdateLoan={handleUpdateLoan}
            loanToEdit={loanToEdit}
            onCancelEdit={handleCancelEdit}
          />
          
          <LoanTable 
            loans={loans} 
            onToggleLoan={handleToggleLoanActive} 
            onEditLoan={handleEditLoan}
          />
          
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

        {/* Affiliate tab content hidden until we have content 
        <TabsContent value="affiliate" className="space-y-4">
          <AffiliateSection />
        </TabsContent>
        */}
      </Tabs>

      <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>{t("app.footer")}</p>
      </footer>
    </div>
  );
}
