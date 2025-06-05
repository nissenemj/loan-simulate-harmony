import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { LoanTable } from '@/components/LoanTable';
import LoanForm from '@/components/LoanForm';
import CreditCardForm from '@/components/CreditCardForm';
import CreditCardTable from '@/components/CreditCardTable';
import TotalDebtSummary from '@/components/TotalDebtSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/use-local-storage';

const IndexPage: React.FC = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>('loans', []);
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>('creditCards', []);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const demoParam = searchParams.get('demo');
    setIsDemo(demoParam === 'true');
  }, [searchParams]);

  const addLoan = (loan: Loan) => {
    setLoans(prevLoans => [...prevLoans, loan]);
  };

  const deleteLoan = (id: string) => {
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== id));
  };

  const toggleLoanActive = (id: string, isActive: boolean) => {
    setLoans(prevLoans =>
      prevLoans.map(loan =>
        loan.id === id ? { ...loan, isActive: isActive } : loan
      )
    );
  };

  const editLoan = (updatedLoan: Loan) => {
    setLoans(prevLoans =>
      prevLoans.map(loan =>
        loan.id === updatedLoan.id ? updatedLoan : loan
      )
    );
    navigate('.');
  };

  const addCreditCard = (card: CreditCard) => {
    setCreditCards(prevCards => [...prevCards, card]);
  };

  const toggleCreditCardActive = (id: string, isActive: boolean) => {
    setCreditCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isActive: isActive } : card
      )
    );
  };

  // Calculate total debt balance
  const totalDebtBalance =
    loans.reduce((sum, loan) => sum + loan.amount, 0) +
    creditCards.reduce((sum, card) => sum + card.balance, 0);

  const handleToggleLoan = useCallback((id: string, isActive: boolean) => {
    toggleLoanActive(id, isActive);
  }, [toggleLoanActive]);

  const handleDeleteLoan = useCallback((id: string) => {
    deleteLoan(id);
  }, [deleteLoan]);

  const handleEditLoan = useCallback((loan: Loan) => {
    editLoan(loan);
  }, [editLoan]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <TotalDebtSummary
        loans={loans}
        creditCards={creditCards}
        isDemo={isDemo}
        totalDebtBalance={totalDebtBalance}
      />

      <Tabs defaultValue="loans" className="w-full">
        <TabsList>
          <TabsTrigger value="loans">Lainat</TabsTrigger>
          <TabsTrigger value="credit-cards">Luottokortit</TabsTrigger>
        </TabsList>
        <TabsContent value="loans" className="space-y-4">
          <LoanForm onAddLoan={addLoan} />
          
            <LoanTable
              loans={loans}
              onToggleActive={handleToggleLoan}
              onDeleteLoan={handleDeleteLoan}
              onEditLoan={handleEditLoan}
            />
          
        </TabsContent>
        <TabsContent value="credit-cards" className="space-y-4">
          <CreditCardForm onAddCreditCard={addCreditCard} />
          
            <CreditCardTable
              creditCards={creditCards}
              onToggleActive={toggleCreditCardActive}
            />
          
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndexPage;
