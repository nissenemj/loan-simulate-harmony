import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Calculator, BarChart3 } from 'lucide-react';
import { Debt, PaymentStrategy } from '@/utils/calculator/types';
import { calculatePaymentPlan } from '@/utils/calculator/debtCalculator';

interface Scenario {
  id: string;
  name: string;
  additionalPayment: number;
  strategy: PaymentStrategy;
  color: string;
}

interface ScenarioResult extends Scenario {
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
}

interface ScenarioComparisonToolProps {
  debts: Debt[];
}

const ScenarioComparisonTool: React.FC<ScenarioComparisonToolProps> = ({ debts }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Vähimmäismaksut + Lumivyöry',
      additionalPayment: 0,
      strategy: 'avalanche',
      color: '#3B82F6'
    },
    {
      id: '2', 
      name: 'Vähimmäismaksut + Lumipallo',
      additionalPayment: 0,
      strategy: 'snowball',
      color: '#10B981'
    }
  ]);

  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [newScenario, setNewScenario] = useState({
    name: '',
    additionalPayment: 0,
    strategy: 'avalanche' as PaymentStrategy
  });

  // Calculate results for all scenarios
  useEffect(() => {
    if (debts.length === 0) {
      setResults([]);
      return;
    }

    const calculatedResults: ScenarioResult[] = [];

    scenarios.forEach(scenario => {
      try {
        const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        const totalMonthlyPayment = totalMinimumPayment + scenario.additionalPayment;
        
        const plan = calculatePaymentPlan(debts, totalMonthlyPayment, scenario.strategy);
        
        calculatedResults.push({
          ...scenario,
          totalMonths: plan.totalMonths,
          totalInterestPaid: plan.totalInterestPaid,
          totalPaid: plan.totalMonths * totalMonthlyPayment
        });
      } catch (error) {
        console.error(`Virhe laskettaessa skenaariota ${scenario.name}:`, error);
      }
    });

    setResults(calculatedResults);
  }, [scenarios, debts]);

  // Add new scenario
  const addScenario = () => {
    if (!newScenario.name.trim()) return;

    const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const usedColors = scenarios.map(s => s.color);
    const availableColor = colors.find(color => !usedColors.includes(color)) || '#6B7280';

    const scenario: Scenario = {
      id: Date.now().toString(),
      name: newScenario.name,
      additionalPayment: newScenario.additionalPayment,
      strategy: newScenario.strategy,
      color: availableColor
    };

    setScenarios([...scenarios, scenario]);
    setNewScenario({
      name: '',
      additionalPayment: 0,
      strategy: 'avalanche'
    });
  };

  // Remove scenario
  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Find best scenarios
  const bestTimeScenario = results.reduce((best, current) => 
    current.totalMonths < best.totalMonths ? current : best, results[0]);
  
  const bestInterestScenario = results.reduce((best, current) => 
    current.totalInterestPaid < best.totalInterestPaid ? current : best, results[0]);

  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Skenaarioiden vertailu
          </CardTitle>
          <CardDescription>
            Vertaile eri takaisinmaksustrategioita ja näe mikä sopii sinulle parhaiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lisää ensin velkoja voidaksesi vertailla eri skenaarioita.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Skenaarioiden vertailu
        </CardTitle>
        <CardDescription>
          Vertaile eri takaisinmaksustrategioita ja näe mikä sopii sinulle parhaiten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scenarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scenarios">Skenaariot</TabsTrigger>
            <TabsTrigger value="results">Tulokset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="space-y-4">
            {/* Add new scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lisää uusi skenaario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="scenarioName">Skenaario nimi</Label>
                    <Input
                      id="scenarioName"
                      value={newScenario.name}
                      onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                      placeholder="Esim. Aggressiivinen takaisinmaksu"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalPayment">Ylimääräinen maksu (€)</Label>
                    <Input
                      id="additionalPayment"
                      type="number"
                      min="0"
                      step="10"
                      value={newScenario.additionalPayment}
                      onChange={(e) => setNewScenario({...newScenario, additionalPayment: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strategy">Strategia</Label>
                    <Select
                      value={newScenario.strategy}
                      onValueChange={(value: PaymentStrategy) => setNewScenario({...newScenario, strategy: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avalanche">Lumivyöry (korkein korko ensin)</SelectItem>
                        <SelectItem value="snowball">Lumipallo (pienin saldo ensin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={addScenario} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Lisää skenaario
                </Button>
              </CardContent>
            </Card>

            {/* Existing scenarios */}
            <div className="space-y-2">
              <h3 className="font-semibold">Nykyiset skenaariot</h3>
              {scenarios.map(scenario => (
                <div key={scenario.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: scenario.color }}
                    />
                    <div>
                      <p className="font-medium">{scenario.name}</p>
                      <p className="text-sm text-muted-foreground">
                        +{formatCurrency(scenario.additionalPayment)} • {
                          scenario.strategy === 'avalanche' ? 'Lumivyöry' : 'Lumipallo'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {scenarios.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScenario(scenario.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {results.length > 0 && (
              <>
                {/* Best scenarios highlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-300">
                          Nopein takaisinmaksu
                        </span>
                      </div>
                      <p className="text-sm font-medium">{bestTimeScenario?.name}</p>
                      <p className="text-lg font-bold text-green-600">
                        {bestTimeScenario?.totalMonths} kuukautta
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          Pienimmät korot
                        </span>
                      </div>
                      <p className="text-sm font-medium">{bestInterestScenario?.name}</p>
                      <p className="text-lg font-bold text-blue-600">
                        {bestInterestScenario && formatCurrency(bestInterestScenario.totalInterestPaid)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Results table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Skenaario</TableHead>
                        <TableHead className="text-right">Kuukausia</TableHead>
                        <TableHead className="text-right">Kokonaiskorot</TableHead>
                        <TableHead className="text-right">Kokonaismaksu</TableHead>
                        <TableHead className="text-right">Kuukausierä</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map(result => {
                        const monthlyPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + result.additionalPayment;
                        const isBestTime = result.id === bestTimeScenario?.id;
                        const isBestInterest = result.id === bestInterestScenario?.id;
                        
                        return (
                          <TableRow key={result.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: result.color }}
                                />
                                <span>{result.name}</span>
                                <div className="flex gap-1">
                                  {isBestTime && (
                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                      Nopein
                                    </Badge>
                                  )}
                                  {isBestInterest && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                      Edullisin
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {result.totalMonths}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(result.totalInterestPaid)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(result.totalPaid)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(monthlyPayment)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScenarioComparisonTool;
