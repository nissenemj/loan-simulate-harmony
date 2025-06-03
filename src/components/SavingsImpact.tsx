
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingDown, DollarSign } from 'lucide-react';
import { Loan, calculateLoan, formatCurrency } from '@/utils/loanCalculations';
import { toast } from 'sonner';
import AnimatedNumber from './AnimatedNumber';
import { cn } from '@/lib/utils';

interface SavingsImpactProps {
  loans: Loan[];
  onPayoffLoan: (id: string) => void;
}

const SavingsImpact: React.FC<SavingsImpactProps> = ({ loans, onPayoffLoan }) => {
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
    const loanName = loans.find(loan => loan.id === id)?.name;
    toast('Laina merkitty maksetuksi: ' + loanName);
  };

  return (
    <Card className="velkavapaus-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Säästömahdollisuudet</h3>
        </div>
        
        <div className="space-y-4">
          {loansWithSavings.slice(0, 3).map((loan) => (
            <div 
              key={loan.id} 
              className={cn(
                "p-4 rounded-lg flex justify-between items-center",
                loan.id === topSavingsLoan.id 
                  ? "bg-gradient-to-r from-primary/5 to-primary/10" 
                  : "bg-white/60"
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
                  Maksamalla pois nyt säästät
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
                Maksa pois
              </Button>
            </div>
          ))}
          
          <p className="text-sm text-center text-muted-foreground pt-2">
            Näet kuinka paljon säästät korkokuluissa maksamalla lainan pois heti
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsImpact;
