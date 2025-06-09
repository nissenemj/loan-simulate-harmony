
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';
import { Debt } from '@/utils/calculator/types';

interface DemoDebt {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

const defaultDebts: DemoDebt[] = [
  { name: "Luottokortti", balance: 5000, rate: 18.5, minPayment: 150 },
  { name: "Autolaina", balance: 15000, rate: 4.2, minPayment: 280 },
  { name: "Opintolaina", balance: 12000, rate: 1.5, minPayment: 200 }
];

export function InteractiveStrategyDemo() {
  const [debts, setDebts] = useState<DemoDebt[]>(defaultDebts);
  const [extraPayment, setExtraPayment] = useState([300]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(amount);

  const calculations = useMemo(() => {
    try {
      const debtObjects: Debt[] = debts.map((debt, index) => ({
        id: `debt-${index}`,
        name: debt.name,
        balance: debt.balance,
        interestRate: debt.rate,
        minimumPayment: debt.minPayment,
        type: 'loan'
      }));

      const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
      const totalPayment = totalMinPayment + extraPayment[0];

      const avalanchePlan = calculatePaymentPlan(debtObjects, totalPayment, 'avalanche');
      const snowballPlan = calculatePaymentPlan(debtObjects, totalPayment, 'snowball');

      return {
        avalanche: avalanchePlan,
        snowball: snowballPlan,
        savings: {
          months: snowballPlan.totalMonths - avalanchePlan.totalMonths,
          interest: snowballPlan.totalInterestPaid - avalanchePlan.totalInterestPaid
        }
      };
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [debts, extraPayment]);

  const updateDebt = (index: number, field: keyof DemoDebt, value: number) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  const resetToDefault = () => {
    setDebts(defaultDebts);
    setExtraPayment([300]);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Interaktiivinen strategiasimulaattori
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Palauta oletus
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debt Inputs */}
        <div>
          <h3 className="font-semibold mb-4">Muokkaa velkoja nähdäksesi vaikutuksen:</h3>
          <div className="space-y-4">
            {debts.map((debt, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor={`debt-${index}-name`} className="text-sm font-medium">
                    {debt.name}
                  </Label>
                </div>
                <div>
                  <Label htmlFor={`debt-${index}-balance`} className="text-xs text-muted-foreground">
                    Saldo (€)
                  </Label>
                  <Input
                    id={`debt-${index}-balance`}
                    type="number"
                    value={debt.balance}
                    onChange={(e) => updateDebt(index, 'balance', Number(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`debt-${index}-rate`} className="text-xs text-muted-foreground">
                    Korko (%)
                  </Label>
                  <Input
                    id={`debt-${index}-rate`}
                    type="number"
                    step="0.1"
                    value={debt.rate}
                    onChange={(e) => updateDebt(index, 'rate', Number(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`debt-${index}-payment`} className="text-xs text-muted-foreground">
                    Vähimmäismaksu (€)
                  </Label>
                  <Input
                    id={`debt-${index}-payment`}
                    type="number"
                    value={debt.minPayment}
                    onChange={(e) => updateDebt(index, 'minPayment', Number(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Payment Slider */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Lisämaksu kuukaudessa: {formatCurrency(extraPayment[0])}</Label>
          <Slider
            value={extraPayment}
            onValueChange={setExtraPayment}
            max={1000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>€0</span>
            <span>€1000</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Velkoja yhteensä</span>
            <p className="font-semibold">{formatCurrency(totalDebt)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Vähimmäismaksut</span>
            <p className="font-semibold">{formatCurrency(totalMinPayment)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Lisämaksu</span>
            <p className="font-semibold text-primary">{formatCurrency(extraPayment[0])}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Yhteensä kuukaudessa</span>
            <p className="font-semibold">{formatCurrency(totalMinPayment + extraPayment[0])}</p>
          </div>
        </div>

        {/* Results Comparison */}
        {calculations && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 pb-3">
                <CardTitle className="text-lg text-blue-800">Lumivyörystrategia</CardTitle>
                <p className="text-sm text-blue-600">Korkein korko ensin</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Takaisinmaksuaika:</span>
                  <Badge variant="secondary">{calculations.avalanche.totalMonths} kuukautta</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Korot yhteensä:</span>
                  <span className="font-semibold">{formatCurrency(calculations.avalanche.totalInterestPaid)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maksetaan yhteensä:</span>
                  <span className="font-semibold">{formatCurrency(calculations.avalanche.totalPaid)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50 pb-3">
                <CardTitle className="text-lg text-green-800">Lumipallostrategia</CardTitle>
                <p className="text-sm text-green-600">Pienin velka ensin</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Takaisinmaksuaika:</span>
                  <Badge variant="secondary">{calculations.snowball.totalMonths} kuukautta</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Korot yhteensä:</span>
                  <span className="font-semibold">{formatCurrency(calculations.snowball.totalInterestPaid)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maksetaan yhteensä:</span>
                  <span className="font-semibold">{formatCurrency(calculations.snowball.totalPaid)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Savings Summary */}
        {calculations && calculations.savings.interest > 0 && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Lumivyöryn edut:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Säästetyt korot:</span>
                <p className="font-semibold text-primary">{formatCurrency(calculations.savings.interest)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Säästetyt kuukaudet:</span>
                <p className="font-semibold text-primary">{calculations.savings.months} kuukautta</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
