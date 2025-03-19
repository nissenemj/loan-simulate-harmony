
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingDown, DollarSign } from 'lucide-react';
import { Loan, calculateLoan, formatCurrency } from '@/utils/loanCalculations';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedNumber from './AnimatedNumber';
import { cn } from '@/lib/utils';

interface SavingsImpactProps {
  loans: Loan[];
  onPayoffLoan: (id: string) => void;
}

const SavingsImpact: React.FC<SavingsImpactProps> = ({ loans, onPayoffLoan }) => {
  const { t } = useLanguage();
  const activeLoans = loans.filter(loan => loan.isActive);
  
  if (activeLoans.length === 0) {
    return null;
  }

  // Calculate potential savings for each loan
  const loansWithSavings = activeLoans.map(loan => {
    const result = calculateLoan(loan);
    
    return {
      ...loan,
      totalInterest: result.totalInterest,
      remainingInterest: result.totalInterest - (result.interest * (loan.termYears * 12 - 1))
    };
  }).sort((a, b) => b.remainingInterest - a.remainingInterest);

  // Get the loan with the highest potential interest savings
  const topSavingsLoan = loansWithSavings[0];
  
  const handlePayoffClick = (id: string) => {
    onPayoffLoan(id);
    toast(t('toast.loanPaidOff') + ': ' + loans.find(loan => loan.id === id)?.name);
  };

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-none shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-violet-200 p-2 rounded-full">
            <PiggyBank className="h-5 w-5 text-violet-700" />
          </div>
          <h3 className="text-lg font-medium text-violet-900">{t('savings.title')}</h3>
        </div>
        
        <div className="space-y-4">
          {loansWithSavings.slice(0, 3).map((loan) => (
            <div 
              key={loan.id} 
              className={cn(
                "p-4 rounded-lg flex justify-between items-center",
                loan.id === topSavingsLoan.id ? "bg-gradient-to-r from-violet-200/60 to-purple-200/60" : "bg-white/60"
              )}
            >
              <div className="space-y-1">
                <div className="font-medium flex items-center gap-2">
                  {loan.id === topSavingsLoan.id && (
                    <TrendingDown size={16} className="text-green-600" />
                  )}
                  {loan.name}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('savings.payingOffNow')}
                </p>
                <p className="text-lg font-semibold text-green-600 flex items-center gap-1">
                  <DollarSign size={16} />
                  <AnimatedNumber 
                    value={loan.remainingInterest} 
                    formatter={(val) => formatCurrency(val)}
                  />
                </p>
              </div>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800"
                onClick={() => handlePayoffClick(loan.id)}
              >
                {t('savings.payOff')}
              </Button>
            </div>
          ))}
          
          <p className="text-sm text-center text-muted-foreground pt-2">
            {t('savings.description')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsImpact;
