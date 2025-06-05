import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Info, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LoanCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  yearlyBreakdown: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}

const calculateLoanDetails = (loanAmount: number, interestRate: number, loanTerm: number): LoanCalculation => {
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const yearlyBreakdown = [];

  for (let year = 1; year <= loanTerm; year++) {
    let principalPaid = 0;
    let interestPaid = 0;

    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;

      interestPaid += interestPayment;
      principalPaid += principalPayment;
      remainingBalance -= principalPayment;
    }

    totalInterest += interestPaid;
    yearlyBreakdown.push({
      year,
      principalPaid,
      interestPaid,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalPayment: monthlyPayment * numberOfPayments,
    yearlyBreakdown,
  };
};

const LoanTerms: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  // Calculate loan details when inputs change
  useEffect(() => {
    if (loanAmount > 0 && interestRate >= 0 && loanTerm > 0) {
      const result = calculateLoanDetails(loanAmount, interestRate, loanTerm);
      setCalculation(result);
    }
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency
  const const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Prepare chart data for payment breakdown
  const chartData = calculation?.yearlyBreakdown.slice(0, Math.min(10, calculation.yearlyBreakdown.length)).map(year => ({
    year: `Vuosi ${year.year}`,
    principal: year.principalPaid,
    interest: year.interestPaid,
    balance: year.remainingBalance
  })) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Lainaehdot | Velkavapaus.fi</title>
        <meta name="description" content="Laske ja vertaile eri lainaehtoja löytääksesi sinulle sopivimman vaihtoehdon" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Lainaehtojen vertailu</h1>
          <p className="text-muted-foreground">
            Laske ja vertaile eri lainaehtoja löytääksesi sinulle sopivimman vaihtoehdon
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Lainatiedot
                </CardTitle>
                <CardDescription>Syötä lainan perustiedot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Lainasumma (€)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    min="1000"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Korko (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Laina-aika (vuotta)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    min="1"
                    max="30"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Las lainan kuukausierän, kokonaiskustannukset ja maksusuunnitelman
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Laskelman yhteenveto</CardTitle>
                <CardDescription>Lainan perustiedot ja kokonaiskustannukset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Kuukausierä</div>
                    <div className="text-2xl font-bold">{calculation ? formatCurrency(calculation.monthlyPayment) : '-'}</div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Korot yhteensä</div>
                    <div className="text-2xl font-bold">{calculation ? formatCurrency(calculation.totalInterest) : '-'}</div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Kokonaismaksu</div>
                    <div className="text-2xl font-bold">{calculation ? formatCurrency(calculation.totalPayment) : '-'}</div>
                  </div>
                </div>

                <Tabs defaultValue="chart" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="chart">Kaavio</TabsTrigger>
                    <TabsTrigger value="breakdown">Erittely</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="year" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis tickFormatter={(value) => formatCurrency(value).split(',')[0]} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Bar dataKey="principal" name="Pääoma" fill="#4CAF50" stackId="a" />
                          <Bar dataKey="interest" name="Korko" fill="#FF8042" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="breakdown">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Vuosi</th>
                            <th className="text-right py-2">Pääoman maksu</th>
                            <th className="text-right py-2">Korkomaksu</th>
                            <th className="text-right py-2">Jäljellä oleva</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculation?.yearlyBreakdown.slice(0, 20).map(year => (
                            <tr key={year.year} className="border-b">
                              <td className="py-2">Vuosi {year.year}</td>
                              <td className="text-right py-2">{formatCurrency(year.principalPaid)}</td>
                              <td className="text-right py-2">{formatCurrency(year.interestPaid)}</td>
                              <td className="text-right py-2">{formatCurrency(year.remainingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vertaile eri laina-aikoja
                </CardTitle>
                <CardDescription>Näe eri laina-aikojen vaikutus maksusuunnitelmaan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Laina-aika</th>
                        <th className="text-right py-2">Kuukausierä</th>
                        <th className="text-right py-2">Korot yhteensä</th>
                        <th className="text-right py-2">Kokonaismaksu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[10, 15, 20, 25, 30].map(years => {
                        const calc = calculateLoanDetails(loanAmount, interestRate, years);
                        return (
                          <tr 
                            key={years} 
                            className={`border-b ${years === loanTerm ? 'bg-muted/30' : ''}`}
                          >
                            <td className="py-2">{years} vuotta</td>
                            <td className="text-right py-2">{formatCurrency(calc.monthlyPayment)}</td>
                            <td className="text-right py-2">{formatCurrency(calc.totalInterest)}</td>
                            <td className="text-right py-2">{formatCurrency(calc.totalPayment)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanTerms;
