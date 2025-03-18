
import React, { useState, useEffect } from 'react';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import LoanSummary from '@/components/LoanSummary';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
    toast({
      title: t('toast.loanAdded'),
      description: t('toast.loanAddedDesc').replace('{name}', loan.name),
    });
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
        title: loan.isActive ? t('toast.loanDeactivated') : t('toast.loanActivated'),
        description: t('toast.loanToggleDesc')
          .replace('{name}', loan.name)
          .replace('{state}', loan.isActive ? t('toast.removedFrom') : t('toast.addedTo')),
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-12 px-4 sm:px-6 text-center mb-8 bg-white/50 backdrop-blur-subtle border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <LanguageSwitcher />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-2">
            {t('app.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('app.subtitle')}
          </p>
        </div>
      </header>
      
      <main className="pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="animate-slide-up">
            <LoanForm onAddLoan={handleAddLoan} />
          </div>
          
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
      
      <footer className="py-6 px-4 sm:px-6 border-t border-border bg-white/50 backdrop-blur-subtle">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>{t('app.footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
