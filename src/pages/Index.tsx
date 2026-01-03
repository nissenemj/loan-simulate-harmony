
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { Debt } from '@/utils/calculator/types';
import { CreditCard } from '@/utils/creditCardCalculations';
import LoanTable from '@/components/LoanTable';
import LoanForm from '@/components/LoanForm';
import CreditCardForm from '@/components/CreditCardForm';
import CreditCardTable from '@/components/CreditCardTable';
import TotalDebtSummary from '@/components/TotalDebtSummary';
import CrisisHelp from '@/components/CrisisHelp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { PlusCircle, Lock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useDebts } from '@/hooks/use-debts';

const IndexPage: React.FC = () => {
  /* REPLACE useLocalStorage with useDebts */
  // Use the custom hook for data fetching and syncing
  const { debts, setDebts } = useDebts();

  // Adapter to convert Debt (Supabase) to Loan (UI/Calculation)
  // TODO: Update Supabase schema to store all Loan fields (termYears, repaymentType, etc.)
  const loans: Loan[] = React.useMemo(() => debts.map(d => ({
    id: d.id,
    name: d.name,
    amount: d.balance,
    currentBalance: d.balance,
    interestRate: d.interestRate,
    // Use minimumPayment as minPayment, default to 0 if missing
    minPayment: d.minimumPayment,
    // Defaults for fields not yet in DB
    termYears: 10,
    repaymentType: 'annuity',
    isActive: true,
    monthlyFee: 0
  })), [debts]);

  // Wrapper to convert Loan[] back to Debt[] for saving
  const setLoans = (newLoans: Loan[] | ((prev: Loan[]) => Loan[])) => {
    let updatedLoans: Loan[];
    if (typeof newLoans === 'function') {
      updatedLoans = newLoans(loans);
    } else {
      updatedLoans = newLoans;
    }

    const newDebts: Debt[] = updatedLoans.map(l => ({
      id: l.id,
      name: l.name,
      balance: l.amount, // Using amount as balance
      interestRate: l.interestRate,
      minimumPayment: l.minPayment || 0,
      type: 'loan'
    }));

    setDebts(newDebts);
  };

  // NOTE: Credit Cards not yet migrated to useDebts, using LocalStorage for now
  const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>('creditCards', []);
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const demoParam = searchParams.get('demo');
    setIsDemo(demoParam === 'true');
  }, [searchParams]);

  const addLoan = (loan: Loan) => {
    setLoans([...loans, loan]);
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const toggleLoanActive = (id: string, isActive: boolean) => {
    setLoans(
      loans.map(loan =>
        loan.id === id ? { ...loan, isActive: isActive } : loan
      )
    );
  };

  const editLoan = (updatedLoan: Loan) => {
    setLoans(
      loans.map(loan =>
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
      {/* Sivun otsikko ja ohjeistus */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Velkalaskuri</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Lisää velkasi tiedot alle. Laskuri näyttää, kuinka kauan maksaminen kestää
          ja kuinka paljon maksat korkoja.
        </p>
        {/* Tietosuojailmoitus */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 max-w-md mx-auto">
          <Lock className="h-4 w-4" />
          <span>Tietojasi ei lähetetä mihinkään. Kaikki pysyy selaimessasi.</span>
        </div>
      </div>

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

      {/* Kriisiapu */}
      <div className="mt-12">
        <CrisisHelp variant="compact" />
      </div>
    </div>
  );
};

export default IndexPage;
