
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Loan, calculateLoan, formatCurrency } from "@/utils/loanCalculations";
import { CreditCard, calculateCreditCard, formatPayoffTime } from "@/utils/creditCardCalculations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoanSummaryTable from "@/components/LoanSummaryTable";
import CreditCardSummaryTable from "@/components/CreditCardSummaryTable";
import TotalDebtSummary from "@/components/TotalDebtSummary";

interface DebtSummaryProps {
  loans: Loan[];
  creditCards: CreditCard[];
}

export default function DebtSummary({ loans, creditCards }: DebtSummaryProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const activeLoans = loans.filter(loan => loan.isActive);
  const activeCards = creditCards.filter(card => card.isActive);

  // Get sample data if no actual data exists
  const loansToDisplay = activeLoans.length > 0 ? activeLoans : getSampleLoans();
  const cardsToDisplay = activeCards.length > 0 ? activeCards : getSampleCreditCards();

  return (
    <div className="container px-4 py-8 mx-auto">
      <Helmet>
        <title>{t("debtSummary.pageTitle")} | {t("app.title")}</title>
        <meta name="description" content={t("debtSummary.metaDescription")} />
      </Helmet>

      <div className="mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("debtSummary.backButton")}
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("debtSummary.pageTitle")}</h1>
        <p className="text-muted-foreground">{t("debtSummary.pageDescription")}</p>
      </div>

      <div className="space-y-8">
        <section aria-labelledby="loans-heading">
          <h2 id="loans-heading" className="text-2xl font-bold mb-4">{t("debtSummary.loansSection")}</h2>
          <LoanSummaryTable loans={loansToDisplay} isDemo={activeLoans.length === 0} />
        </section>

        <section aria-labelledby="credit-cards-heading">
          <h2 id="credit-cards-heading" className="text-2xl font-bold mb-4">{t("debtSummary.creditCardsSection")}</h2>
          <CreditCardSummaryTable creditCards={cardsToDisplay} isDemo={activeCards.length === 0} />
        </section>

        <section aria-labelledby="total-summary-heading">
          <h2 id="total-summary-heading" className="text-2xl font-bold mb-4">{t("debtSummary.totalSummarySection")}</h2>
          <TotalDebtSummary loans={loansToDisplay} creditCards={cardsToDisplay} isDemo={activeLoans.length === 0 && activeCards.length === 0} />
        </section>
      </div>
    </div>
  );
}

// Sample data functions
function getSampleLoans(): Loan[] {
  return [
    {
      id: "sample-loan-1",
      name: "Sample Mortgage",
      amount: 200000,
      interestRate: 3.5,
      termYears: 25,
      repaymentType: "annuity",
      interestType: "fixed",
      isActive: true
    },
    {
      id: "sample-loan-2",
      name: "Sample Car Loan",
      amount: 15000,
      interestRate: 4.2,
      termYears: 5,
      repaymentType: "annuity",
      interestType: "fixed",
      isActive: true
    }
  ];
}

function getSampleCreditCards(): CreditCard[] {
  return [
    {
      id: "sample-card-1",
      name: "Sample Visa",
      balance: 2000,
      limit: 5000,
      apr: 19.9,
      minPayment: 50,
      minPaymentPercent: 2.5,
      fullPayment: false,
      isActive: true
    },
    {
      id: "sample-card-2",
      name: "Sample Mastercard",
      balance: 1500,
      limit: 3000,
      apr: 21.5,
      minPayment: 35,
      minPaymentPercent: 2.5,
      fullPayment: false,
      isActive: true
    }
  ];
}
