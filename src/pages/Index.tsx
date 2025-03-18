
import React, { useState, useEffect } from 'react';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import LoanSummary from '@/components/LoanSummary';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [highestTotalInterestId, setHighestTotalInterestId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Find the loan with the highest total interest
    if (loans.length > 0) {
      const activeLoans = loans.filter(loan => loan.isActive);
      
      if (activeLoans.length > 0) {
        let maxInterestId: string | undefined = undefined;
        let maxInterestValue = -1;
        
        activeLoans.forEach(loan => {
          const result = calculateLoan(loan);
          if (result.totalInterest > maxInterestValue) {
            maxInterestValue = result.totalInterest;
            maxInterestId = loan.id;
          }
        });
        
        setHighestTotalInterestId(maxInterestId);
      } else {
        setHighestTotalInterestId(undefined);
      }
    }
  }, [loans]);
  
  const handleAddLoan = (loan: Loan) => {
    setLoans(prevLoans => [...prevLoans, loan]);
  };
  
  const handleToggleLoan = (id: string) => {
    setLoans(prevLoans => 
      prevLoans.map(loan => 
        loan.id === id 
          ? { ...loan, isActive: !loan.isActive } 
          : loan
      )
    );
    
    // Find the toggled loan
    const loan = loans.find(l => l.id === id);
    if (loan) {
      toast({
        title: loan.isActive ? "Loan Deactivated" : "Loan Activated",
        description: `${loan.name} has been ${loan.isActive ? 'removed from' : 'added to'} active loans`,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="py-12 px-4 sm:px-6 text-center mb-8 bg-white/50 backdrop-blur-subtle border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-2">
            Loan Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan, compare and optimize your loan strategy with precision and clarity
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Loan Form */}
          <div className="animate-slide-up">
            <LoanForm onAddLoan={handleAddLoan} />
          </div>
          
          {/* Loan Table */}
          <div 
            className={loans.length > 0 ? "animate-slide-up" : ""}
            style={{ animationDelay: "100ms" }}
          >
            <LoanTable 
              loans={loans} 
              onToggleLoan={handleToggleLoan} 
              highestTotalInterestId={highestTotalInterestId}
            />
          </div>
          
          {/* Loan Summary */}
          {loans.length > 0 && (
            <div 
              className="animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <LoanSummary loans={loans} />
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 border-t border-border bg-white/50 backdrop-blur-subtle">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>Loan Simulator • Simple, precise financial planning</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
