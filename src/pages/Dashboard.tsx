
import React from 'react';
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

const Dashboard = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCardType[]>("creditCards", []);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const activeLoans = loans.filter(loan => loan.isActive);
  const activeCards = creditCards.filter(card => card.isActive);
  
  const totalDebt = 
    activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
    activeCards.reduce((sum, card) => sum + card.balance, 0);
  
  const now = new Date();
  const debtFreeDate = new Date(now.setFullYear(now.getFullYear() + 3));
  const formattedDebtFreeDate = debtFreeDate.toLocaleDateString('fi-FI');
  
  const monthlyBudget = 1500;
  
  const totalMinPayments = 
    activeLoans.reduce((sum, loan) => {
      return sum + (loan.amount * loan.interestRate / 100 / 12) + (loan.amount / (loan.termYears * 12));
    }, 0) + 
    activeCards.reduce((sum, card) => {
      return sum + Math.max(card.minPayment, card.balance * card.minPaymentPercent / 100);
    }, 0);
  
  const extraBudget = Math.max(0, monthlyBudget - totalMinPayments);
  
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
