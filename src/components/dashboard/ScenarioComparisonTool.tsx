
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card,
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loan, formatCurrency } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Info, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { combineDebts } from '@/utils/repayment/debtConverters';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';

interface ScenarioComparisonToolProps {
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
  onClose: () => void;
}

// Define a type for scenarios
interface Scenario {
  id: string;
  name: string;
  interestRateAdjustment: number; // % to add/subtract from all rates
  monthlyPayment: number; // Payment amount
  extraPayment: number; // Extra payment
  strategy: 'avalanche' | 'snowball' | 'equal';
}

const ScenarioComparisonTool = ({ 
  activeLoans, 
  activeCards, 
  monthlyBudget, 
  onClose 
}: ScenarioComparisonToolProps) => {
  const { t } = useLanguage();
  
  // Calculate total debt
  const totalDebt = 
    activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
    activeCards.reduce((sum, card) => sum + card.balance, 0);
  
  // Calculate total minimum payments
  const calculateTotalMinPayments = () => {
    const loanMinPayments = activeLoans.reduce((sum, loan) => {
      if (loan.minPayment) {
        return sum + loan.minPayment;
      } else {
        const monthlyRate = loan.interestRate / 100 / 12;
        const totalMonths = loan.termYears * 12;
        let payment;
        
        if (loan.repaymentType === 'custom-payment' && loan.customPayment) {
          payment = loan.customPayment;
        } else {
          payment = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }
        
        if (loan.monthlyFee) {
          payment += loan.monthlyFee;
        }
        
        return sum + payment;
      }
    }, 0);
    
    const cardMinPayments = activeCards.reduce((sum, card) => {
      const percentPayment = card.balance * (card.minPaymentPercent / 100);
      const minPayment = Math.max(card.minPayment, percentPayment);
      return sum + minPayment;
    }, 0);
    
    return loanMinPayments + cardMinPayments;
  };
  
  const totalMinPayments = calculateTotalMinPayments();
  
  // Predefined scenarios
  const defaultScenarios: Scenario[] = [
    {
      id: 'current',
      name: t('scenarios.current') || 'Current Situation',
      interestRateAdjustment: 0,
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments),
      extraPayment: 0,
      strategy: 'avalanche'
    },
    {
      id: 'optimistic',
      name: t('scenarios.optimistic') || 'Optimistic',
      interestRateAdjustment: -1, // Interest rates go down by 1%
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments) * 1.2, // 20% more payment
      extraPayment: 1000, // Extra annual payment
      strategy: 'avalanche'
    },
    {
      id: 'pessimistic',
      name: t('scenarios.pessimistic') || 'Pessimistic',
      interestRateAdjustment: 2, // Interest rates go up by 2%
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments),
      extraPayment: 0,
      strategy: 'avalanche'
    }
  ];
  
  // State for scenarios
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('current');
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Scenario, 'id'>>({
    name: '',
    interestRateAdjustment: 0,
    monthlyPayment: 0,
    extraPayment: 0,
    strategy: 'avalanche'
  });
  
  // Tabs for different comparisons
  const [activeTab, setActiveTab] = useState('repayment');
  
  // Validate value to ensure it's within a realistic range
  const validateValue = (value: number, min: number, max: number, defaultVal: number): number => {
    if (isNaN(value) || value < min || value > max) {
      return defaultVal;
    }
    return value;
  };
  
  // Function to adjust loans and cards based on scenario
  const adjustDebtsForScenario = (scenario: Scenario) => {
    // Apply interest rate adjustment to loans
    const adjustedLoans = activeLoans.map(loan => ({
      ...loan,
      interestRate: Math.max(0, loan.interestRate + scenario.interestRateAdjustment)
    }));
    
    // Apply interest rate adjustment to credit cards
    const adjustedCards = activeCards.map(card => ({
      ...card,
      apr: Math.max(0, card.apr + scenario.interestRateAdjustment)
    }));
    
    return { adjustedLoans, adjustedCards };
  };
  
  // Get active scenario
  const activeScenario = scenarios.find(scenario => scenario.id === activeScenarioId) || scenarios[0];
  
  // Calculate repayment plan for each scenario
  const scenarioResults = useMemo(() => {
    return scenarios.map(scenario => {
      const { adjustedLoans, adjustedCards } = adjustDebtsForScenario(scenario);
      const combinedDebts = combineDebts(adjustedLoans, adjustedCards);
      
      // Calculate monthly payment including the monthly portion of the annual extra payment
      const effectiveMonthlyPayment = scenario.monthlyPayment + (scenario.extraPayment / 12);
      
      const plan = generateRepaymentPlan(combinedDebts, effectiveMonthlyPayment, scenario.strategy);
      
      return {
        id: scenario.id,
        name: scenario.name,
        totalMonths: plan.totalMonths,
        totalInterestPaid: plan.totalInterestPaid,
        isViable: plan.isViable,
        timeline: plan.timeline
      };
    });
  }, [scenarios, activeLoans, activeCards]);
  
  // Get results for active scenario
  const activeScenarioResults = scenarioResults.find(result => result.id === activeScenarioId);
  
  // Generate comparison data for chart
  const comparisonChartData = useMemo(() => {
    // Find longest timeline
    const maxMonths = Math.max(...scenarioResults.map(result => 
      result.timeline.length > 0 ? result.timeline.length : 0
    ));
    
    if (maxMonths === 0) return [];
    
    const data = [];
    
    for (let month = 0; month < maxMonths; month += 3) { // Sample every 3 months for clarity
      const point: any = { month: month + 1 };
      
      scenarioResults.forEach(result => {
        if (month < result.timeline.length) {
          point[`${result.id}_balance`] = result.timeline[month].totalRemaining;
          point[`${result.id}_interest`] = result.timeline[month].totalInterestPaid;
        }
      });
      
      data.push(point);
    }
    
    return data;
  }, [scenarioResults]);
  
  // Handle editing a scenario
  const handleEditScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    setEditFormData({
      name: scenario.name,
      interestRateAdjustment: scenario.interestRateAdjustment,
      monthlyPayment: scenario.monthlyPayment,
      extraPayment: scenario.extraPayment,
      strategy: scenario.strategy
    });
    
    setEditingScenarioId(scenarioId);
  };
  
  // Handle saving edited scenario
  const handleSaveScenario = () => {
    if (!editingScenarioId) return;
    
    // Validate inputs
    const validatedData = {
      ...editFormData,
      interestRateAdjustment: validateValue(editFormData.interestRateAdjustment, -10, 10, 0),
      monthlyPayment: validateValue(editFormData.monthlyPayment, totalMinPayments, totalMinPayments * 5, totalMinPayments),
      extraPayment: validateValue(editFormData.extraPayment, 0, 50000, 0)
    };
    
    setScenarios(prevScenarios => 
      prevScenarios.map(scenario => 
        scenario.id === editingScenarioId 
          ? { ...scenario, ...validatedData }
          : scenario
      )
    );
    
    setEditingScenarioId(null);
  };
  
  // Handle input change in edit form
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'interestRateAdjustment' || name === 'monthlyPayment' || name === 'extraPayment') {
      setEditFormData({
        ...editFormData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };
  
  // Handle strategy change
  const handleStrategyChange = (strategy: 'avalanche' | 'snowball' | 'equal') => {
    setEditFormData({
      ...editFormData,
      strategy
    });
  };
  
  // Reset scenarios to default
  const handleResetScenarios = () => {
    setScenarios(defaultScenarios);
    setActiveScenarioId('current');
    setEditingScenarioId(null);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{t('repayment.month')} {label}</p>
          {payload.map((entry: any, index: number) => {
            const scenarioId = entry.dataKey.split('_')[0];
            const dataType = entry.dataKey.split('_')[1];
            const scenario = scenarios.find(s => s.id === scenarioId);
            
            return (
              <p 
                key={index} 
                style={{ color: entry.color }}
                className="text-sm"
              >
                {scenario?.name || scenarioId} - {dataType === 'balance' ? t('dashboard.remainingDebt') : t('dashboard.totalInterestPaid')}: {formatCurrency(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('dashboard.scenarioComparison') || 'Scenario Comparison'}</CardTitle>
            <CardDescription>
              {t('dashboard.scenarioDescription') || 'Compare different debt repayment scenarios and their outcomes'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Minimum payment alert */}
          {totalMinPayments > 0 && (
            <Alert className="bg-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('scenarios.minimumPaymentAlert', { payment: formatCurrency(totalMinPayments) }) || 
                  `Total minimum payments required: ${formatCurrency(totalMinPayments)}. Any scenario with lower monthly payment will not be viable.`}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Scenario selector and editor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <Card 
                key={scenario.id}
                className={`cursor-pointer transition-all ${scenario.id === activeScenarioId ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveScenarioId(scenario.id)}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditScenario(scenario.id);
                      }}
                    >
                      {editingScenarioId === scenario.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                
                {editingScenarioId === scenario.id ? (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('scenarios.name') || 'Scenario Name'}</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={editFormData.name} 
                          onChange={handleEditFormChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="interestRateAdjustment">{t('scenarios.interestRateChange') || 'Interest Rate Change (%)'}</Label>
                          <span className="text-sm">{editFormData.interestRateAdjustment > 0 ? '+' : ''}{editFormData.interestRateAdjustment}%</span>
                        </div>
                        <Slider
                          id="interestRateAdjustment"
                          value={[editFormData.interestRateAdjustment]}
                          min={-5}
                          max={5}
                          step={0.25}
                          onValueChange={(values) => {
                            setEditFormData({
                              ...editFormData,
                              interestRateAdjustment: values[0]
                            });
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>-5%</span>
                          <span>+5%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="monthlyPayment">{t('scenarios.monthlyPayment') || 'Monthly Payment'}</Label>
                          <span className="text-sm">{formatCurrency(editFormData.monthlyPayment)}</span>
                        </div>
                        <Slider
                          id="monthlyPayment"
                          value={[editFormData.monthlyPayment]}
                          min={totalMinPayments}
                          max={Math.max(totalMinPayments * 2, totalMinPayments + 1000)}
                          step={50}
                          onValueChange={(values) => {
                            setEditFormData({
                              ...editFormData,
                              monthlyPayment: values[0]
                            });
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(totalMinPayments)}</span>
                          <span>{formatCurrency(Math.max(totalMinPayments * 2, totalMinPayments + 1000))}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="extraPayment">
                            {t('scenarios.annualExtraPayment') || 'Annual Extra Payment'}
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 inline ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {t('scenarios.extraPaymentExplanation') || 
                                      'Additional payment made once per year, e.g., tax returns or bonuses'}
                                  </p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </Label>
                          <span className="text-sm">{formatCurrency(editFormData.extraPayment)}</span>
                        </div>
                        <Slider
                          id="extraPayment"
                          value={[editFormData.extraPayment]}
                          min={0}
                          max={10000}
                          step={500}
                          onValueChange={(values) => {
                            setEditFormData({
                              ...editFormData,
                              extraPayment: values[0]
                            });
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>€0</span>
                          <span>€10,000</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>{t('repayment.strategy') || 'Repayment Strategy'}</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'avalanche' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('avalanche')}
                          >
                            <TrendingDown className="mr-1 h-3 w-3" />
                            {t('repayment.avalancheStrategy') || 'Avalanche'}
                          </Button>
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'snowball' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('snowball')}
                          >
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {t('repayment.snowballStrategy') || 'Snowball'}
                          </Button>
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'equal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('equal')}
                          >
                            <ArrowRight className="mr-1 h-3 w-3" />
                            {t('dashboard.equalDistribution') || 'Equal'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingScenarioId(null)}
                        >
                          {t('common.cancel') || 'Cancel'}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveScenario}
                        >
                          {t('common.save') || 'Save'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-muted-foreground">{t('scenarios.interestRateChange') || 'Interest Rate Change'}:</div>
                        <div className={`font-medium ${scenario.interestRateAdjustment > 0 ? 'text-destructive' : scenario.interestRateAdjustment < 0 ? 'text-green-600' : ''}`}>
                          {scenario.interestRateAdjustment > 0 ? '+' : ''}{scenario.interestRateAdjustment}%
                        </div>
                        
                        <div className="text-muted-foreground">{t('scenarios.monthlyPayment') || 'Monthly Payment'}:</div>
                        <div className="font-medium">{formatCurrency(scenario.monthlyPayment)}</div>
                        
                        <div className="text-muted-foreground">{t('scenarios.annualExtraPayment') || 'Annual Extra Payment'}:</div>
                        <div className="font-medium">{formatCurrency(scenario.extraPayment)}</div>
                        
                        <div className="text-muted-foreground">{t('repayment.strategy') || 'Strategy'}:</div>
                        <div className="font-medium">{
                          scenario.strategy === 'avalanche' 
                            ? t('repayment.avalancheStrategy') || 'Avalanche'
                            : scenario.strategy === 'snowball'
                              ? t('repayment.snowballStrategy') || 'Snowball'
                              : t('dashboard.equalDistribution') || 'Equal'
                        }</div>
                      </div>
                      
                      {/* Scenario results */}
                      {scenarioResults.find(result => result.id === scenario.id) && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="text-muted-foreground">{t('repayment.debtFreeIn') || 'Debt Free In'}:</div>
                            <div className="font-medium">
                              {scenarioResults.find(result => result.id === scenario.id)?.totalMonths || 0} {t('repayment.months') || 'months'}
                            </div>
                            
                            <div className="text-muted-foreground">{t('repayment.totalInterestPaid') || 'Total Interest Paid'}:</div>
                            <div className="font-medium">
                              {formatCurrency(scenarioResults.find(result => result.id === scenario.id)?.totalInterestPaid || 0)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
          
          {/* Tabs for different comparisons */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="repayment">{t('scenarios.debtOverTime') || 'Debt Over Time'}</TabsTrigger>
              <TabsTrigger value="comparison">{t('scenarios.scenarioComparison') || 'Scenario Comparison'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="repayment" className="space-y-4">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: t('dashboard.months'), position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                      label={{ value: t('dashboard.debt'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {/* Render lines for each scenario */}
                    {scenarios.map((scenario, index) => (
                      <Area
                        key={`${scenario.id}_balance`}
                        type="monotone"
                        dataKey={`${scenario.id}_balance`}
                        name={`${scenario.name} - ${t('dashboard.remainingDebt') || 'Remaining Debt'}`}
                        fill={`hsl(${index * 60}, 70%, 60%)`}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        fillOpacity={0.2}
                        isAnimationActive={false}
                      />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: t('dashboard.months'), position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                      label={{ value: t('dashboard.interest'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {/* Render lines for each scenario */}
                    {scenarios.map((scenario, index) => (
                      <Line
                        key={`${scenario.id}_interest`}
                        type="monotone"
                        dataKey={`${scenario.id}_interest`}
                        name={`${scenario.name} - ${t('dashboard.totalInterestPaid') || 'Total Interest Paid'}`}
                        stroke={`hsl(${index * 90 + 180}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scenarioResults.map(result => ({
                      name: scenarios.find(s => s.id === result.id)?.name || result.id,
                      months: result.totalMonths,
                      interest: result.totalInterestPaid
                    }))}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'months') {
                        return [`${value} ${t('repayment.months') || 'months'}`, t('repayment.debtFreeIn') || 'Debt Free In'];
                      } else if (name === 'interest') {
                        return [formatCurrency(value as number), t('repayment.totalInterestPaid') || 'Total Interest Paid'];
                      }
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar 
                      dataKey="months" 
                      fill="#8884d8" 
                      name={t('repayment.debtFreeIn') || 'Debt Free In (months)'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scenarioResults.map(result => ({
                      name: scenarios.find(s => s.id === result.id)?.name || result.id,
                      interest: result.totalInterestPaid,
                      averageMonthlyInterest: result.totalMonths > 0 ? result.totalInterestPaid / result.totalMonths : 0
                    }))}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'interest') {
                        return [formatCurrency(value as number), t('repayment.totalInterestPaid') || 'Total Interest Paid'];
                      } else if (name === 'averageMonthlyInterest') {
                        return [formatCurrency(value as number), t('scenarios.avgMonthlyInterest') || 'Avg Monthly Interest'];
                      }
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar 
                      dataKey="interest" 
                      fill="#82ca9d" 
                      name={t('repayment.totalInterestPaid') || 'Total Interest Paid'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleResetScenarios}>
          <RefreshCw className="mr-2 h-3 w-3" />
          {t('scenarios.resetToDefault') || 'Reset to Default'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t('common.close') || 'Close'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScenarioComparisonTool;
