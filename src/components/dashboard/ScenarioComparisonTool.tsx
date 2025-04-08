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
import { Loan } from '@/utils/loanCalculations';
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
import { useCurrencyFormatter } from '@/utils/formatting';

interface ScenarioComparisonToolProps {
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
  onClose: () => void;
}

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
  const currencyFormatter = useCurrencyFormatter();
  
  const totalDebt = 
    activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + 
    activeCards.reduce((sum, card) => sum + card.balance, 0);
  
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
  
  const defaultScenarios: Scenario[] = [
    {
      id: 'current',
      name: t('scenarios.current'),
      interestRateAdjustment: 0,
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments),
      extraPayment: 0,
      strategy: 'avalanche'
    },
    {
      id: 'optimistic',
      name: t('scenarios.optimistic'),
      interestRateAdjustment: -1, // Interest rates go down by 1%
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments) * 1.2, // 20% more payment
      extraPayment: 1000, // Extra annual payment
      strategy: 'avalanche'
    },
    {
      id: 'pessimistic',
      name: t('scenarios.pessimistic'),
      interestRateAdjustment: 2, // Interest rates go up by 2%
      monthlyPayment: Math.max(monthlyBudget, totalMinPayments),
      extraPayment: 0,
      strategy: 'avalanche'
    }
  ];
  
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
  
  const [activeTab, setActiveTab] = useState('repayment');
  
  const validateValue = (value: number, min: number, max: number, defaultVal: number): number => {
    if (isNaN(value) || value < min || value > max) {
      return defaultVal;
    }
    return value;
  };
  
  const adjustDebtsForScenario = (scenario: Scenario) => {
    const adjustedLoans = activeLoans.map(loan => ({
      ...loan,
      interestRate: Math.max(0, loan.interestRate + scenario.interestRateAdjustment)
    }));
    
    const adjustedCards = activeCards.map(card => ({
      ...card,
      apr: Math.max(0, card.apr + scenario.interestRateAdjustment)
    }));
    
    return { adjustedLoans, adjustedCards };
  };
  
  const activeScenario = scenarios.find(scenario => scenario.id === activeScenarioId) || scenarios[0];
  
  const scenarioResults = useMemo(() => {
    return scenarios.map(scenario => {
      const { adjustedLoans, adjustedCards } = adjustDebtsForScenario(scenario);
      const combinedDebts = combineDebts(adjustedLoans, adjustedCards);
      
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
  
  const activeScenarioResults = scenarioResults.find(result => result.id === activeScenarioId);
  
  const comparisonChartData = useMemo(() => {
    const maxMonths = Math.max(...scenarioResults.map(result => 
      result.timeline.length > 0 ? result.timeline.length : 0
    ));
    
    if (maxMonths === 0) return [];
    
    const data = [];
    
    for (let month = 0; month < maxMonths; month += 3) {
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
  
  const handleSaveScenario = () => {
    if (!editingScenarioId) return;
    
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
  
  const handleStrategyChange = (strategy: 'avalanche' | 'snowball' | 'equal') => {
    setEditFormData({
      ...editFormData,
      strategy
    });
  };
  
  const handleResetScenarios = () => {
    setScenarios(defaultScenarios);
    setActiveScenarioId('current');
    setEditingScenarioId(null);
  };
  
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
                {scenario?.name || scenarioId} - {dataType === 'balance' ? t('dashboard.remainingDebt') : t('repayment.totalInterestPaid')}: {currencyFormatter.format(entry.value)}
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
            <CardTitle>{t('dashboard.scenarioComparison')}</CardTitle>
            <CardDescription>
              {t('dashboard.scenarioDescription')}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {totalMinPayments > 0 && (
            <Alert className="bg-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('scenarios.minimumPaymentAlert', { payment: currencyFormatter.format(totalMinPayments) })}
              </AlertDescription>
            </Alert>
          )}
          
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
                        <Label htmlFor="name">{t('scenarios.name')}</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={editFormData.name} 
                          onChange={handleEditFormChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="interestRateAdjustment">{t('scenarios.interestRateChange')}</Label>
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
                          <Label htmlFor="monthlyPayment">{t('scenarios.monthlyPayment')}</Label>
                          <span className="text-sm">{currencyFormatter.format(editFormData.monthlyPayment)}</span>
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
                          <span>{currencyFormatter.format(totalMinPayments)}</span>
                          <span>{currencyFormatter.format(Math.max(totalMinPayments * 2, totalMinPayments + 1000))}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="extraPayment">
                            {t('scenarios.annualExtraPayment')}
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 inline ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {t('scenarios.extraPaymentExplanation')}
                                  </p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </Label>
                          <span className="text-sm">{currencyFormatter.format(editFormData.extraPayment)}</span>
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
                        <Label>{t('repayment.strategy')}</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'avalanche' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('avalanche')}
                          >
                            <TrendingDown className="mr-1 h-3 w-3" />
                            {t('dashboard.avalancheStrategy')}
                          </Button>
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'snowball' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('snowball')}
                          >
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {t('dashboard.snowballStrategy')}
                          </Button>
                          <Button
                            type="button"
                            variant={editFormData.strategy === 'equal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStrategyChange('equal')}
                          >
                            <ArrowRight className="mr-1 h-3 w-3" />
                            {t('dashboard.equalStrategy')}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingScenarioId(null)}
                        >
                          {t('common.cancel')}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveScenario}
                        >
                          {t('common.save')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-muted-foreground">{t('scenarios.interestRateChange')}:</div>
                        <div className={`font-medium ${scenario.interestRateAdjustment > 0 ? 'text-destructive' : scenario.interestRateAdjustment < 0 ? 'text-green-600' : ''}`}>
                          {scenario.interestRateAdjustment > 0 ? '+' : ''}{scenario.interestRateAdjustment}%
                        </div>
                        
                        <div className="text-muted-foreground">{t('scenarios.monthlyPayment')}:</div>
                        <div className="font-medium">{currencyFormatter.format(scenario.monthlyPayment)}</div>
                        
                        <div className="text-muted-foreground">{t('scenarios.annualExtraPayment')}:</div>
                        <div className="font-medium">{currencyFormatter.format(scenario.extraPayment)}</div>
                        
                        <div className="text-muted-foreground">{t('repayment.strategy')}:</div>
                        <div className="font-medium">{
                          scenario.strategy === 'avalanche' 
                            ? t('dashboard.avalancheStrategy')
                            : scenario.strategy === 'snowball'
                              ? t('dashboard.snowballStrategy')
                              : t('dashboard.equalStrategy')
                        }</div>
                      </div>
                      
                      {scenarioResults.find(result => result.id === scenario.id) && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="text-muted-foreground">{t('repayment.debtFreeIn')}:</div>
                            <div className="font-medium">
                              {scenarioResults.find(result => result.id === scenario.id)?.totalMonths || 0} {t('repayment.months')}
                            </div>
                            
                            <div className="text-muted-foreground">{t('repayment.totalInterestPaid')}:</div>
                            <div className="font-medium">
                              {currencyFormatter.format(scenarioResults.find(result => result.id === scenario.id)?.totalInterestPaid || 0)}
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="repayment">{t('scenarios.debtOverTime')}</TabsTrigger>
              <TabsTrigger value="comparison">{t('scenarios.scenarioComparison')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="repayment" className="space-y-4">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                      label={{ value: t('repayment.balance'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {scenarios.map((scenario, index) => (
                      <Area
                        key={`${scenario.id}_balance`}
                        type="monotone"
                        dataKey={`${scenario.id}_balance`}
                        name={`${scenario.name} - ${t('dashboard.remainingDebt')}`}
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
                      label={{ value: t('repayment.months'), position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`} 
                      label={{ value: t('repayment.totalInterestPaid'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {scenarios.map((scenario, index) => (
                      <Line
                        key={`${scenario.id}_interest`}
                        type="monotone"
                        dataKey={`${scenario.id}_interest`}
                        name={`${scenario.name} - ${t('repayment.totalInterestPaid')}`}
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
                        return [`${value} ${t('repayment.months')}`, t('repayment.debtFreeIn')];
                      } else if (name === 'interest') {
                        return [currencyFormatter.format(value as number), t('repayment.totalInterestPaid')];
                      }
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar 
                      dataKey="months" 
                      fill="#8884d8" 
                      name={t('repayment.debtFreeIn')}
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
                        return [currencyFormatter.format(value as number), t('repayment.totalInterestPaid')];
                      } else if (name === 'averageMonthlyInterest') {
                        return [currencyFormatter.format(value as number), t('scenarios.avgMonthlyInterest')];
                      }
                      return [value, name];
                    }} />
                    <Legend />
                    <Bar 
                      dataKey="interest" 
                      fill="#82ca9d" 
                      name={t('repayment.totalInterestPaid')}
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
          {t('scenarios.resetToDefault')}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {t('common.close')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScenarioComparisonTool;
