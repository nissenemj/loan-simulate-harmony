
import { useState, useEffect } from 'react';
import { Debt } from '@/utils/calculator/types';
import { calculateConsolidationOptions } from '@/utils/calculator/debtCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DebtConsolidationCalculatorProps {
  debts: Debt[];
}

/**
 * Debt Consolidation Calculator component
 * Allows users to see potential consolidation options for their debts
 */
export function DebtConsolidationCalculator({ debts }: DebtConsolidationCalculatorProps) {
  const { t } = useTranslation();
  const [consolidationOptions, setConsolidationOptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate consolidation options when debts change
  useEffect(() => {
    if (debts.length === 0) {
      setConsolidationOptions([]);
      return;
    }
    
    try {
      // Define some common consolidation options
      const options = [
        { name: t('calculator.personalLoan'), interestRate: 10.99, termMonths: 60 },
        { name: t('calculator.balanceTransfer'), interestRate: 0, termMonths: 18 },
        { name: t('calculator.homeEquityLoan'), interestRate: 7.5, termMonths: 120 },
        { name: t('calculator.debtConsolidationLoan'), interestRate: 8.99, termMonths: 48 }
      ];
      
      const results = calculateConsolidationOptions(debts, options);
      setConsolidationOptions(results);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error calculating consolidation options');
      setConsolidationOptions([]);
    }
  }, [debts, t]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('calculator.debtConsolidation')}</CardTitle>
          <CardDescription>{t('calculator.consolidationDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('calculator.noDebtsAdded')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calculator.debtConsolidation')}</CardTitle>
        <CardDescription>{t('calculator.consolidationDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
          <p className="font-semibold">{t('calculator.consolidationDisclaimer')}</p>
          <p className="mt-1 text-sm">
            {t('calculator.consolidationDisclaimerText')}
          </p>
        </div>
        
        {consolidationOptions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('calculator.option')}</TableHead>
                  <TableHead className="text-right">{t('calculator.interestRate')}</TableHead>
                  <TableHead className="text-right">{t('calculator.term')}</TableHead>
                  <TableHead className="text-right">{t('calculator.monthlyPayment')}</TableHead>
                  <TableHead className="text-right">{t('calculator.totalInterest')}</TableHead>
                  <TableHead className="text-right">{t('calculator.payoffDate')}</TableHead>
                  <TableHead className="text-right">{t('calculator.potentialSavings')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidationOptions.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell className="text-right">{option.interestRate.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{option.termMonths} {t('calculator.months')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.monthlyPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.totalInterestPaid)}</TableCell>
                    <TableCell className="text-right">{formatDate(option.payoffDate)}</TableCell>
                    <TableCell className={`text-right ${option.interestSaved > 0 ? 'text-green-600 font-semibold' : 'text-red-600'}`}>
                      {option.interestSaved > 0 
                        ? `${formatCurrency(option.interestSaved)} ${t('calculator.saved')}`
                        : `${formatCurrency(Math.abs(option.interestSaved))} ${t('calculator.more')}`
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">{t('calculator.consolidationConsiderations')}</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('calculator.considerationFees')}</li>
            <li>{t('calculator.considerationCredit')}</li>
            <li>{t('calculator.considerationCollateral')}</li>
            <li>{t('calculator.considerationBehavior')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
