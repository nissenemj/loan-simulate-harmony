
import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard as CreditCardType } from '@/utils/creditCardCalculations';

// Newly created components
import DebtSummaryCard from '@/components/dashboard/DebtSummaryCard';
import PaymentPlanSummary from '@/components/dashboard/PaymentPlanSummary';
import DebtBreakdownTabs from '@/components/dashboard/DebtBreakdownTabs';
import FinancialTips from '@/components/dashboard/FinancialTips';
import DebtFreeTimeline from '@/components/dashboard/DebtFreeTimeline';
import LoanSummary from '@/components/LoanSummary';
import { DebtItem } from '@/utils/repayment/types';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';

const Dashboard = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCardType[]>("creditCards", []);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Make sure we're only using active loans and credit cards
  const activeLoans = loans.filter(loan => loan.isActive);
  const activeCards = creditCards.filter(card => card.isActive);
  
  // Calculate the total debt
  const totalDebt = 
    activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
    activeCards.reduce((sum, card) => sum + card.balance, 0);
  
  // Monthly budget for debt repayment (should ideally come from user settings)
  const monthlyBudget = 1500;
  
  // Convert loans and credit cards to debt items for repayment calculations
  const convertToDebtItems = (loans: Loan[], cards: CreditCardType[]): DebtItem[] => {
    const debtItems: DebtItem[] = [];
    
    // Convert loans to debt items
    loans.forEach(loan => {
      debtItems.push({
        id: loan.id,
        name: loan.name,
        balance: loan.amount,
        interestRate: loan.interestRate,
        minPayment: loan.minPayment || (loan.amount / (loan.termYears * 12)),
        type: 'loan',
        isActive: loan.isActive
      });
    });
    
    // Convert credit cards to debt items
    cards.forEach(card => {
      const percentPayment = card.balance * (card.minPaymentPercent / 100);
      const minPayment = Math.max(card.minPayment, percentPayment);
      
      debtItems.push({
        id: card.id,
        name: card.name,
        balance: card.balance,
        interestRate: card.apr,
        minPayment: minPayment,
        type: 'credit-card',
        isActive: card.isActive
      });
    });
    
    return debtItems;
  };
  
  const debtItems = convertToDebtItems(activeLoans, activeCards);
  
  // Generate a repayment plan with the default monthly budget
  const repaymentPlan = generateRepaymentPlan(debtItems, monthlyBudget, 'avalanche', false);
  
  // Calculate the estimated debt-free date
  const getDebtFreeDate = () => {
    // If we have a valid repayment plan, use its timeline
    if (repaymentPlan.isViable && repaymentPlan.timeline && repaymentPlan.timeline.length > 0) {
      const totalMonths = repaymentPlan.totalMonths;
      const now = new Date();
      const debtFreeDate = new Date(now);
      debtFreeDate.setMonth(now.getMonth() + totalMonths);
      return debtFreeDate.toLocaleDateString('fi-FI');
    }
    
    // Fallback calculation if the repayment plan isn't viable
    const now = new Date();
    const debtFreeDate = new Date(now.setFullYear(now.getFullYear() + 3));
    return debtFreeDate.toLocaleDateString('fi-FI');
  };
  
  const formattedDebtFreeDate = getDebtFreeDate();
  
  // Calculate total minimum payments
  const totalMinPayments = debtItems.reduce((sum, debt) => sum + debt.minPayment, 0);
  
  // Calculate extra budget available
  const extraBudget = Math.max(0, monthlyBudget - totalMinPayments);
  
  // Find debt with highest interest rate
  let highestInterestDebt = { name: "", rate: 0 };
  
  activeLoans.forEach(loan => {
    if (loan.interestRate > highestInterestDebt.rate) {
      highestInterestDebt = { name: loan.name, rate: loan.interestRate };
    }
  });
  
  activeCards.forEach(card => {
    if (card.apr > highestInterestDebt.rate) {
      highestInterestDebt = { name: card.name, rate: card.apr };
    }
  });

  // Calculate total amount to pay
  const calculateTotalAmountToPay = () => {
    if (repaymentPlan.isViable) {
      // Use the total from the repayment plan: principal + interest
      return totalDebt + repaymentPlan.totalInterestPaid;
    }
    
    // Fallback calculation if repayment plan isn't viable
    const loanTotal = activeLoans.reduce((sum, loan) => {
      const interest = loan.amount * (loan.interestRate / 100) * loan.termYears;
      return sum + loan.amount + interest;
    }, 0);
    
    const cardTotal = activeCards.reduce((sum, card) => {
      const interest = card.balance * (card.apr / 100) * 2;
      return sum + card.balance + interest;
    }, 0);
    
    return loanTotal + cardTotal;
  };
  
  const totalAmountToPay = calculateTotalAmountToPay();
  
  // Debug logs
  console.log('Dashboard loaded with:', { 
    activeLoans: activeLoans.length, 
    activeCards: activeCards.length,
    totalDebt,
    totalMinPayments,
    totalAmountToPay,
    repaymentMonths: repaymentPlan.totalMonths
  });
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
      <Helmet>
        <title>{t('dashboard.title')} | Loan Simulator</title>
      </Helmet>
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}, {user?.email?.split('@')[0] || t('dashboard.user')}</h1>
            <p className="text-muted-foreground">{t('dashboard.welcomeSubtitle')}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/debt-summary')}>
              {t('dashboard.viewDebtSummary')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DebtSummaryCard 
          totalDebt={totalDebt}
          debtFreeDate={formattedDebtFreeDate}
          totalMinPayments={totalMinPayments}
          totalAmountToPay={totalAmountToPay}
        />
        
        <PaymentPlanSummary
          monthlyBudget={monthlyBudget}
          totalMinPayments={totalMinPayments}
          extraBudget={extraBudget}
          highestInterestDebt={highestInterestDebt}
        />
        
        <DebtBreakdownTabs 
          activeLoans={activeLoans}
          activeCards={activeCards}
        />
        
        {activeLoans.length > 0 && (
          <LoanSummary loans={activeLoans} />
        )}
        
        <FinancialTips />
        
        <DebtFreeTimeline 
          totalDebt={totalDebt}
          formattedDebtFreeDate={formattedDebtFreeDate}
          activeCards={activeCards}
          activeLoans={activeLoans}
          monthlyBudget={monthlyBudget}
        />
      </div>
    </div>
  );
};

export default Dashboard;
