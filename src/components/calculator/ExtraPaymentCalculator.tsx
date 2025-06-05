
import React from 'react';
import { useState, useEffect } from 'react';
import { Debt, ExtraPaymentImpact } from '@/utils/calculator/types';
import { calculateExtraPaymentImpact } from '@/utils/calculator/debtCalculator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lightbulb, Clock, Coins, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExtraPaymentCalculatorProps {
  debts: Debt[];
}

/**
 * Extra Payment Impact Calculator component
 * Allows users to see the impact of making an extra payment on a specific debt
 */
const ExtraPaymentCalculator = ({ debts }: ExtraPaymentCalculatorProps) => {
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
      setError(err.message || 'Virhe laskennassa');
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
  
  // Prepare chart data
  const chartData = impact ? [
    {
      name: 'Ilman ylimääräistä maksua',
      interestPaid: impact.originalTotalInterest,
      fill: '#8B5CF6'
    },
    {
      name: 'Ylimääräisellä maksulla',
      interestPaid: impact.newTotalInterest,
      fill: '#22C55E'
    }
  ] : [];
  
  // Custom tooltip formatter for the bar chart
  const customBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ylimääräisen maksun vaikutus</CardTitle>
          <CardDescription>Katso miten ylimääräinen maksu vaikuttaa velkoihisi</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Lisää ensin velkoja nähdäksesi ylimääräisen maksun vaikutuksen</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Ylimääräisen maksun vaikutus
        </CardTitle>
        <CardDescription>Katso miten ylimääräinen maksu vaikuttaa velkoihisi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="debtSelect">Valitse velka</Label>
            <Select
              value={selectedDebtId}
              onValueChange={setSelectedDebtId}
            >
              <SelectTrigger id="debtSelect">
                <SelectValue placeholder="Valitse velka" />
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
            <Label htmlFor="extraPayment">Ylimääräinen maksu (€)</Label>
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
          <div className="mt-6">
            <h4 className="font-semibold text-lg mb-4">Vaikutukset</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <Clock className="h-8 w-8 mr-3 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Säästetyt kuukaudet</p>
                      <p className="text-2xl font-bold">
                        {impact.monthsSaved} kuukautta
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <Coins className="h-8 w-8 mr-3 mt-1 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Säästetyt korot</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(impact.interestSaved)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 sm:col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <Calendar className="h-8 w-8 mr-3 mt-1 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Uusi maksettu päivä</p>
                      <p className="text-xl font-bold">
                        {formatDate(impact.newPayoffDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[250px] md:h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={customBarTooltip} />
                  <Legend />
                  <Bar dataKey="interestPaid" name="Kokonaiskorot" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-4 rounded flex items-start">
              <Lightbulb className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Vinkki ylimääräisistä maksuista</p>
                <p className="mt-1">
                  Pienetkin ylimääräiset maksut voivat säästää merkittävästi aikaa ja rahaa velkojen takaisinmaksussa.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtraPaymentCalculator;
