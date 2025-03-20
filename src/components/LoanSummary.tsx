
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loan, calculateTotalMonthlyPayment, formatCurrency, generateRecommendations } from '@/utils/loanCalculations';
import AnimatedNumber from './AnimatedNumber';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoanSummaryProps {
  loans: Loan[];
}

const LoanSummary: React.FC<LoanSummaryProps> = ({ loans }) => {
  const { t } = useLanguage();
  const activeLoans = loans.filter(loan => loan.isActive);
  
  if (activeLoans.length === 0) {
    return null;
  }
  
  const { totalPayment, totalPrincipal, totalInterest } = calculateTotalMonthlyPayment(loans);
  const { highestInterestRateLoans, highestTotalInterestLoans, topPriorityLoans } = generateRecommendations(loans);
  
  return (
    <div className="space-y-6 mt-6">
      <Card className="velkavapaus-card shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t('debtSummary.totalMonthlyPayment')}</h3>
              <p className="text-2xl font-semibold">
                <AnimatedNumber 
                  value={totalPayment} 
                  formatter={(val) => formatCurrency(val)}
                />
              </p>
            </div>
            
            <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t('loan.table.monthlyPayment')}</h3>
              <p className="text-2xl font-semibold">
                <AnimatedNumber 
                  value={totalPrincipal} 
                  formatter={(val) => formatCurrency(val)}
                />
              </p>
            </div>
            
            <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t('debtSummary.totalMonthlyInterest')}</h3>
              <p className="text-2xl font-semibold text-primary">
                <AnimatedNumber 
                  value={totalInterest} 
                  formatter={(val) => formatCurrency(val)}
                />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {(highestInterestRateLoans.length > 0 || highestTotalInterestLoans.length > 0) && (
        <Card className={cn(
          "velkavapaus-card shadow-md overflow-hidden",
          "border-l-4 border-l-primary animate-slide-up"
        )}>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-primary" />
              <span>{t('recommendations.title')}</span>
            </h3>
            
            <div className="space-y-4">
              {topPriorityLoans.length > 0 && (
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <h4 className="font-medium flex items-center gap-2 text-destructive mb-2">
                    <AlertCircle size={16} />
                    <span>{t('recommendations.topPriority')}</span>
                  </h4>
                  <p className="text-sm">
                    {topPriorityLoans.map(loan => (
                      <span key={loan.id} className="font-medium">{loan.name}</span>
                    )).reduce((prev, curr, i) => {
                      return i === 0 ? curr : <>{prev}, {curr}</>;
                    }, <></>)}
                    {" "}
                    {topPriorityLoans.length === 1 
                      ? t('recommendations.topPriorityText')
                      : t('recommendations.topPriorityTextPlural')}
                  </p>
                </div>
              )}
              
              {highestTotalInterestLoans.length > 0 && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-2">{t('recommendations.highTotalInterest')}</h4>
                  <p className="text-sm">
                    {highestTotalInterestLoans.map(loan => {
                      const result = calculateTotalMonthlyPayment([loan]);
                      return (
                        <span key={loan.id}>
                          <span className="font-medium">{loan.name}</span>
                          {" "}
                          ({formatCurrency(result.totalInterest * 12 * loan.termYears)})
                        </span>
                      );
                    }).reduce((prev, curr, i) => {
                      return i === 0 ? curr : <>{prev}, {curr}</>;
                    }, <></>)}
                    {" "}
                    {highestTotalInterestLoans.length === 1 
                      ? t('recommendations.highTotalInterestText')
                      : t('recommendations.highTotalInterestTextPlural')}
                  </p>
                </div>
              )}
              
              {highestInterestRateLoans.length > 0 && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-2">{t('recommendations.highInterest')}</h4>
                  <p className="text-sm">
                    {highestInterestRateLoans.map(loan => (
                      <span key={loan.id}>
                        <span className="font-medium">{loan.name}</span>
                        {" "}
                        ({(loan.interestRate).toFixed(2)}%)
                      </span>
                    )).reduce((prev, curr, i) => {
                      return i === 0 ? curr : <>{prev}, {curr}</>;
                    }, <></>)}
                    {" "}
                    {highestInterestRateLoans.length === 1 
                      ? t('recommendations.highInterestText')
                      : t('recommendations.highInterestTextPlural')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoanSummary;
