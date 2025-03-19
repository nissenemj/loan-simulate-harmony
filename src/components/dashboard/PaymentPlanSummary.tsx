
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/loanCalculations';
import { useNavigate } from 'react-router-dom';

interface PaymentPlanSummaryProps {
  monthlyBudget: number;
  totalMinPayments: number;
  extraBudget: number;
  highestInterestDebt: {
    name: string;
    rate: number;
  };
}

const PaymentPlanSummary = ({ 
  monthlyBudget, 
  totalMinPayments, 
  extraBudget, 
  highestInterestDebt 
}: PaymentPlanSummaryProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PiggyBank className="mr-2 h-5 w-5 text-primary" />
          {t('dashboard.paymentPlanSummary')}
        </CardTitle>
        <CardDescription>{t('dashboard.paymentPlanDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.monthlyBudget')}</h4>
            <p className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.minimumPayments')}</h4>
            <p className="text-2xl font-bold">{formatCurrency(totalMinPayments)}</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{t('dashboard.extraBudget')}</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">{formatCurrency(extraBudget)}</p>
          </div>
        </div>
        
        {highestInterestDebt.name && (
          <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
            <h4 className="flex items-center text-primary font-medium">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('dashboard.prioritizedDebt')}
            </h4>
            <p className="mt-1">
              <span className="font-medium">{highestInterestDebt.name}</span> - {highestInterestDebt.rate.toFixed(2)}% {t('dashboard.interestRate')}
            </p>
            {extraBudget > 0 && (
              <p className="text-sm mt-2">
                {t('dashboard.allocatingExtra').replace('{{amount}}', formatCurrency(extraBudget))}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => navigate('/debt-summary')}>
          {t('dashboard.viewFullPlan')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentPlanSummary;
