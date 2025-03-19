
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Loan, calculateLoan, formatCurrency, generateRecommendations, calculateTotalMonthlyPayment } from "@/utils/loanCalculations";
import { CreditCard, calculateCreditCard, formatPayoffTime } from "@/utils/creditCardCalculations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard as CreditCardIcon, Wallet, AlertTriangle, CalculatorIcon } from "lucide-react";
import LoanSummaryTable from "@/components/LoanSummaryTable";
import CreditCardSummaryTable from "@/components/CreditCardSummaryTable";
import TotalDebtSummary from "@/components/TotalDebtSummary";
import SavingsImpact from "@/components/SavingsImpact";
import BudgetInput from "@/components/BudgetInput";
import RepaymentPlanVisualization from "@/components/RepaymentPlanVisualization";
import { combineDebts, generateRepaymentPlan, PrioritizationMethod } from "@/utils/repayment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DebtSummaryProps {
  loans: Loan[];
  creditCards: CreditCard[];
  onPayoffLoan: (id: string) => void;
  onPayoffCreditCard: (id: string) => void;
}

export default function DebtSummary({ loans, creditCards, onPayoffLoan, onPayoffCreditCard }: DebtSummaryProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<number>(500);
  const [method, setMethod] = useState<PrioritizationMethod>('avalanche');
  const [repaymentPlan, setRepaymentPlan] = useState<ReturnType<typeof generateRepaymentPlan> | null>(null);
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  const activeLoans = loans.filter(loan => loan.isActive);
  const activeCards = creditCards.filter(card => card.isActive);

  // Get sample data if no actual data exists
  const loansToDisplay = activeLoans.length > 0 ? activeLoans : getSampleLoans();
  const cardsToDisplay = activeCards.length > 0 ? activeCards : getSampleCreditCards();
  
  // Calculate recommendations - get the actual arrays from the return value
  const recommendationsObj = generateRecommendations(loansToDisplay);
  // Convert recommendations object to array for rendering
  const recommendations = [
    ...(recommendationsObj.topPriorityLoans.length > 0 
      ? [{ type: 'topPriority', loans: recommendationsObj.topPriorityLoans.map(loan => loan.id) }] 
      : []),
    ...(recommendationsObj.highestInterestRateLoans.length > 0 
      ? [{ type: 'highInterest', loans: recommendationsObj.highestInterestRateLoans.map(loan => loan.id) }] 
      : []),
    ...(recommendationsObj.highestTotalInterestLoans.length > 0 
      ? [{ type: 'highTotalInterest', loans: recommendationsObj.highestTotalInterestLoans.map(loan => loan.id) }] 
      : [])
  ];
  
  const hasActiveDebts = activeLoans.length > 0 || activeCards.length > 0;
  const isDemo = activeLoans.length === 0 && activeCards.length === 0;
  
  // Calculate total payments
  const { totalPayment: totalLoanPayment, totalInterest: totalLoanInterest } = calculateTotalMonthlyPayment(loansToDisplay);
  
  // Calculate credit card totals
  let totalCardPayment = 0;
  let totalCardInterest = 0;
  
  cardsToDisplay.forEach(card => {
    const calc = calculateCreditCard(card);
    totalCardPayment += calc.effectivePayment;
    totalCardInterest += calc.monthlyInterest;
  });
  
  // Combined totals
  const totalMonthlyPayment = totalLoanPayment + totalCardPayment;
  const totalMonthlyInterest = totalLoanInterest + totalCardInterest;

  // Calculate repayment plan
  const calculateRepaymentPlan = (budgetAmount: number, prioritizationMethod: PrioritizationMethod) => {
    setBudget(budgetAmount);
    setMethod(prioritizationMethod);
    
    const combinedDebts = combineDebts(loansToDisplay, cardsToDisplay);
    const plan = generateRepaymentPlan(combinedDebts, budgetAmount, prioritizationMethod);
    
    setRepaymentPlan(plan);
    setActiveTab("repayment-plan");
  };

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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("debtSummary.pageTitle")}</h1>
            <p className="text-muted-foreground">{t("debtSummary.pageDescription")}</p>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        {hasActiveDebts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg p-5 shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t("debtSummary.totalMonthlyPayment")}</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyPayment)}</div>
            </div>
            
            <div className="bg-card rounded-lg p-5 shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t("debtSummary.totalMonthlyInterest")}</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyInterest)}</div>
            </div>
            
            <div className="bg-card rounded-lg p-5 shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t("creditCard.summary.totalBalance")}</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(cardsToDisplay.reduce((sum, card) => sum + card.balance, 0))}
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-5 shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t("creditCard.summary.totalLimit")}</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(cardsToDisplay.reduce((sum, card) => sum + card.limit, 0))}
              </div>
            </div>
          </div>
        )}
        
        {/* Recommendations section (if loans exist) */}
        {activeLoans.length > 0 && recommendations.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-sm border mb-8">
            <h2 className="text-xl font-bold mb-4">{t("recommendations.title")}</h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-background rounded-md p-4 border">
                  <h3 className="font-semibold mb-1">{t(`recommendations.${rec.type}`)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {rec.loans.length > 1 
                      ? t(`recommendations.${rec.type}TextPlural`) 
                      : t(`recommendations.${rec.type}Text`)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rec.loans.map(loanId => {
                      const loan = loansToDisplay.find(l => l.id === loanId);
                      return loan ? (
                        <span key={loanId} className="inline-block bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
                          {loan.name} ({formatCurrency(loan.amount)})
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">{t("repayment.summaryTab")}</TabsTrigger>
          <TabsTrigger value="repayment-plan">{t("repayment.planTab")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-8">
          {/* Loans and Savings Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <section aria-labelledby="loans-heading">
                <h2 id="loans-heading" className="text-2xl font-bold mb-4">{t("debtSummary.loansSection")}</h2>
                <LoanSummaryTable loans={loansToDisplay} isDemo={activeLoans.length === 0} />
              </section>
            </div>
            <div>
              <SavingsImpact loans={loansToDisplay} onPayoffLoan={onPayoffLoan} />
            </div>
          </div>

          <section aria-labelledby="credit-cards-heading">
            <h2 id="credit-cards-heading" className="text-2xl font-bold mb-4">{t("debtSummary.creditCardsSection")}</h2>
            <CreditCardSummaryTable 
              creditCards={cardsToDisplay} 
              isDemo={activeCards.length === 0}
              onPayoffCreditCard={onPayoffCreditCard}
            />
          </section>

          <section aria-labelledby="total-summary-heading">
            <h2 id="total-summary-heading" className="text-2xl font-bold mb-4">{t("debtSummary.totalSummarySection")}</h2>
            <TotalDebtSummary loans={loansToDisplay} creditCards={cardsToDisplay} isDemo={isDemo} />
          </section>
        </TabsContent>
        
        <TabsContent value="repayment-plan" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <BudgetInput 
                onCalculate={calculateRepaymentPlan} 
                defaultBudget={budget} 
                method={method}
              />
            </div>
            <div className="md:col-span-3">
              {repaymentPlan ? (
                <RepaymentPlanVisualization plan={repaymentPlan} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-muted rounded-lg border">
                  <CalculatorIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("repayment.noPlanYet")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("repayment.enterBudgetPrompt")}
                  </p>
                  <Button onClick={() => calculateRepaymentPlan(budget, method)}>
                    <CalculatorIcon className="mr-2 h-4 w-4" />
                    {t("repayment.calculateNow")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
