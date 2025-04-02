
import { useState, useEffect } from 'react';
import { Debt, ExtraPaymentImpact } from '@/utils/calculator/types';
import { calculateExtraPaymentImpact } from '@/utils/calculator/debtCalculator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExtraPaymentCalculatorProps {
  debts: Debt[];
}

/**
 * Extra Payment Impact Calculator component
 * Allows users to see the impact of making an extra payment on a specific debt
 */
export function ExtraPaymentCalculator({ debts }: ExtraPaymentCalculatorProps) {
  const { t } = useTranslation();
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [extraPaymentAmount, setExtraPaymentAmount] = useState<number>(0);
  const [impact, setImpact] = useState<ExtraPaymentImpact | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reset when debts change
  useEffect(() => {
    if (debts.length > 0 && !selectedDebtId) {
      setSelectedDebtId(debts[0].id);
    } else if (debts.length === 0) {
      setSelectedDebtId('');
      setImpact(null);
    }
  }, [debts, selectedDebtId]);
  
  // Calculate impact when inputs change
  useEffect(() => {
    if (!selectedDebtId || extraPaymentAmount <= 0 || debts.length === 0) {
      setImpact(null);
      return;
    }
    
    try {
      const result = calculateExtraPaymentImpact(
        debts,
        extraPaymentAmount,
        selectedDebtId,
        'avalanche' // Default to avalanche strategy
      );
      
      setImpact(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error calculating extra payment impact');
      setImpact(null);
    }
  }, [debts, selectedDebtId, extraPaymentAmount]);
  
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
          <CardTitle>{t('calculator.extraPaymentImpact')}</CardTitle>
          <CardDescription>{t('calculator.extraPaymentDescription')}</CardDescription>
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
        <CardTitle>{t('calculator.extraPaymentImpact')}</CardTitle>
        <CardDescription>{t('calculator.extraPaymentDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="debtSelect">{t('calculator.selectDebt')}</Label>
            <Select
              value={selectedDebtId}
              onValueChange={setSelectedDebtId}
            >
              <SelectTrigger id="debtSelect">
                <SelectValue placeholder={t('calculator.selectDebtPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {debts.map((debt) => (
                  <SelectItem key={debt.id} value={debt.id}>
                    {debt.name} ({formatCurrency(debt.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extraPayment">{t('calculator.extraPaymentAmount')}</Label>
            <Input
              id="extraPayment"
              type="number"
              min="0"
              step="10"
              value={extraPaymentAmount || ''}
              onChange={(e) => setExtraPaymentAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </div>
        
        {impact && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg">{t('calculator.impactResults')}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('calculator.monthsSaved')}</div>
                <div className="text-2xl font-bold">
                  {impact.monthsSaved} {t('calculator.months')}
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('calculator.interestSaved')}</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(impact.interestSaved)}
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">{t('calculator.newPayoffDate')}</div>
                <div className="text-2xl font-bold">
                  {formatDate(impact.newPayoffDate)}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              <p className="font-semibold">{t('calculator.extraPaymentTip')}</p>
              <p className="mt-1">
                {t('calculator.extraPaymentTipDescription')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
