
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface DebtItem {
  id: string;
  name: string;
  type: 'loan' | 'credit-card';
  balance: number;
  originalAmount?: number;
  interestRate: number;
  minimumPayment: number;
  monthlyPayment?: number;
}

const DebtSummary: React.FC = () => {
  const { user } = useAuth();
  const [loans] = useLocalStorage<Loan[]>('loans', []);
  const [creditCards] = useLocalStorage<CreditCard[]>('creditCards', []);
  const [debts, setDebts] = useState<DebtItem[]>([]);

  // Combine loans and credit cards into a unified debt list
  useEffect(() => {
    const combinedDebts: DebtItem[] = [
      ...loans.map(loan => ({
        id: loan.id,
        name: loan.name || 'Nimetön laina',
        type: 'loan' as const,
        balance: loan.amount,
        originalAmount: loan.amount, // Use current amount as original
        interestRate: loan.interestRate,
        minimumPayment: loan.minPayment || loan.amount * 0.02, // 2% default if no minPayment
        monthlyPayment: loan.minPayment || loan.amount * 0.02
      })),
      ...creditCards.map(card => ({
        id: card.id,
        name: card.name || 'Nimetön luottokortti',
        type: 'credit-card' as const,
        balance: card.balance,
        originalAmount: card.balance, // Use current balance as original
        interestRate: card.apr,
        minimumPayment: card.minPayment
      }))
    ];
    setDebts(combinedDebts);
  }, [loans, creditCards]);

  // Calculate summary statistics
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length 
    : 0;
  const highestInterestRate = debts.length > 0 
    ? Math.max(...debts.map(debt => debt.interestRate)) 
    : 0;

  // Categorize debts by interest rate
  const highInterestDebts = debts.filter(debt => debt.interestRate > 15);
  const mediumInterestDebts = debts.filter(debt => debt.interestRate >= 5 && debt.interestRate <= 15);
  const lowInterestDebts = debts.filter(debt => debt.interestRate < 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculate debt-to-income ratio (placeholder - would need user income)
  const monthlyIncome = 3000; // This would come from user input
  const debtToIncomeRatio = totalMinimumPayments / monthlyIncome * 100;

  // Export debt summary
  const exportSummary = () => {
    const summaryData = {
      exportDate: new Date().toISOString(),
      userEmail: user?.email,
      totalDebts: debts.length,
      totalBalance,
      totalMinimumPayments,
      averageInterestRate,
      debts: debts.map(debt => ({
        name: debt.name,
        type: debt.type,
        balance: debt.balance,
        interestRate: debt.interestRate,
        minimumPayment: debt.minimumPayment
      }))
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velkatiiviste_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (debts.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Helmet>
          <title>Velkatiiviste | Velkavapaus.fi</title>
          <meta name="description" content="Katsaus velkatilanteesi ja analyysi velkojesi tilasta" />
        </Helmet>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Velkatiiviste</h1>
            <p className="text-muted-foreground">
              Katsaus velkatilanteesi ja analyysi velkojesi tilasta
            </p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Ei velkoja lisättynä</h3>
              <p className="text-muted-foreground mb-4">
                Lisää ensin lainoja tai luottokortteja nähdäksesi velkatiivistesi
              </p>
              <Button asChild>
                <a href="/calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  Siirry velkalaskuriin
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Velkatiiviste | Velkavapaus.fi</title>
        <meta name="description" content="Katsaus velkatilanteesi ja analyysi velkojesi tilasta" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Velkatiiviste</h1>
            <p className="text-muted-foreground">
              Katsaus velkatilanteesi ja analyysi velkojesi tilasta
            </p>
          </div>
          <Button onClick={exportSummary} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Vie tiiviste
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kokonaisvelka</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">
                {debts.length} velkaa yhteensä
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kuukausimaksut</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalMinimumPayments)}</div>
              <p className="text-xs text-muted-foreground">
                Vähimmäismaksut yhteensä
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Keskikorko</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageInterestRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Korkein: {highestInterestRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Velka-tulosuhde</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{debtToIncomeRatio.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Kuukausittaisista tuloista
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debt Analysis */}
        {debtToIncomeRatio > 40 && (
          <Alert className="mb-6">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Huomio:</strong> Velka-tulosuhteesi on korkea ({debtToIncomeRatio.toFixed(1)}%). 
              Suositeltava taso on alle 40%. Harkitse velkojen yhdistämistä tai ylimääräisiä maksuja.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Yleiskatsaus</TabsTrigger>
            <TabsTrigger value="analysis">Analyysi</TabsTrigger>
            <TabsTrigger value="details">Yksityiskohdat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debt Breakdown by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Velat tyypeittäin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Lainat</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {loans.length} kpl
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Luottokortit</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(creditCards.reduce((sum, card) => sum + card.balance, 0))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {creditCards.length} kpl
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interest Rate Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Korot kategoriassa</CardTitle>
                  <CardDescription>Velkojen jakautuminen korkotason mukaan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Korkea korko (&gt;15%)</span>
                      <span className="text-red-600 font-medium">{highInterestDebts.length} velkaa</span>
                    </div>
                    <Progress 
                      value={(highInterestDebts.length / debts.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Keskikorko (5-15%)</span>
                      <span className="text-yellow-600 font-medium">{mediumInterestDebts.length} velkaa</span>
                    </div>
                    <Progress 
                      value={(mediumInterestDebts.length / debts.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Matala korko (&lt;5%)</span>
                      <span className="text-green-600 font-medium">{lowInterestDebts.length} velkaa</span>
                    </div>
                    <Progress 
                      value={(lowInterestDebts.length / debts.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Velka-analyysi</CardTitle>
                <CardDescription>Suosituksia velkatilanteesi parantamiseksi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Priority Recommendations */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Prioriteettisuositukset</h4>
                  
                  {highInterestDebts.length > 0 && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Korkean koron velat:</strong> Sinulla on {highInterestDebts.length} velkaa 
                        yli 15% korolla. Keskity näiden maksuun ensimmäisenä säästääksesi korkokuluissa.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {totalMinimumPayments / monthlyIncome > 0.2 && (
                    <Alert>
                      <Calculator className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Kuukausimaksut:</strong> Vähimmäismaksusi vievät {(totalMinimumPayments / monthlyIncome * 100).toFixed(1)}% 
                        tuloistasi. Harkitse ylimääräisiä maksuja tai velkojen yhdistämistä.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Potential Savings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 dark:bg-green-950/30">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        Lumivyöry strategia
                      </h5>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Maksa korkeakorkoiset velat ensin. Säästät enemmän korkokuluissa.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 dark:bg-blue-950/30">
                    <CardContent className="p-4">
                      <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Lumipallo strategia
                      </h5>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Maksa pienimmät velat ensin. Rakentaa motivaatiota ja vauhtia.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yksityiskohtainen velkaluettelo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Velka</TableHead>
                        <TableHead>Tyyppi</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                        <TableHead className="text-right">Korko</TableHead>
                        <TableHead className="text-right">Vähimmäismaksu</TableHead>
                        <TableHead className="text-right">Prioriteetti</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {debts
                        .sort((a, b) => b.interestRate - a.interestRate)
                        .map((debt, index) => (
                        <TableRow key={debt.id}>
                          <TableCell className="font-medium">{debt.name}</TableCell>
                          <TableCell>
                            <Badge variant={debt.type === 'loan' ? 'default' : 'secondary'}>
                              {debt.type === 'loan' ? 'Laina' : 'Luottokortti'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(debt.balance)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <span className={
                              debt.interestRate > 15 ? 'text-red-600' :
                              debt.interestRate > 5 ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {debt.interestRate.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(debt.minimumPayment)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={
                              index < 2 ? 'destructive' :
                              index < debts.length / 2 ? 'default' : 'secondary'
                            }>
                              {index < 2 ? 'Korkea' :
                               index < debts.length / 2 ? 'Keskitaso' : 'Matala'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DebtSummary;
