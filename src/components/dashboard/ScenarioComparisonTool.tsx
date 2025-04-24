import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { scenarioColors } from '@/utils/chartColors';
import { useIsMobile } from '@/hooks/use-mobile';
import ScenarioGuide from './ScenarioGuide';
import { useCurrencyFormatter } from '@/utils/formatting';
import { X, AlertCircle, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { combineDebts } from '@/utils/repayment/debtConverters';
import { generateRepaymentPlan } from '@/utils/repayment/generateRepaymentPlan';
import { ScenarioEditor } from './ScenarioEditor';
import { Scenario } from '@/types/scenarios';

interface ScenarioComparisonToolProps {
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
  onClose: () => void;
}

const ScenarioComparisonTool: React.FC<ScenarioComparisonToolProps> = ({ 
  activeLoans, 
  activeCards,
  monthlyBudget, 
  onClose 
}) => {
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
  
  const scenarioResults = React.useMemo(() => {
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
  
  const comparisonChartData = React.useMemo(() => {
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
  
  const [showGuide, setShowGuide] = useState(false);
  
  const isMobile = useIsMobile();

  const [estimatedMonths, setEstimatedMonths] = useState<number | undefined>(undefined);
  const [estimatedInterest, setEstimatedInterest] = useState<number | undefined>(undefined);

  const handleEditFormUpdate = (values: Partial<Scenario>) => {
    const scenario = { ...activeScenario, ...values };
    const { adjustedLoans, adjustedCards } = adjustDebtsForScenario(scenario as Scenario);
    const combinedDebts = combineDebts(adjustedLoans, adjustedCards);
    const effectiveMonthlyPayment = scenario.monthlyPayment! + (scenario.extraPayment! / 12);
    const plan = generateRepaymentPlan(combinedDebts, effectiveMonthlyPayment, scenario.strategy!);

    setEstimatedMonths(plan.totalMonths);
    setEstimatedInterest(plan.totalInterestPaid);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('dashboard.scenarioComparison')}</CardTitle>
            <AlertDescription className="mt-1">
              {t('dashboard.scenarioDescriptionEnhanced')}
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs font-normal ml-1" 
                onClick={() => setShowGuide(true)}
              >
                {t('common.learnMore')}
              </Button>
            </AlertDescription>
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
                {t('scenarios.minimumPaymentAlert', { payment: currencyFormatter.format(totalMinPayments) }) || 
                  `Total minimum payments required: ${currencyFormatter.format(totalMinPayments)}. Any scenario with lower monthly payment will not be viable.`}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {scenarioResults.map(result => {
              const monthsToPayoff = result.totalMonths;
              const interestPaid = result.totalInterestPaid;
              const scenario = scenarios.find(s => s.id === result.id);
              
              return (
                <Card 
                  key={result.id}
                  className={`${result.id === activeScenarioId ? 'border-primary' : ''}`}
                >
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{scenario?.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t('visualization.monthsToPayoff')}</span>
                        <span className="font-medium">{monthsToPayoff} {t('visualization.months')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t('visualization.totalInterestPaid')}</span>
                        <span className="font-medium">{currencyFormatter.format(interestPaid)}</span>
                      </div>
                      {result.id !== 'current' && (
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm text-muted-foreground">{t('visualization.comparisonResult')}</span>
                          <div className="flex items-center">
                            {result.totalMonths < (scenarioResults.find(r => r.id === 'current')?.totalMonths || 0) && (
                              <span className="text-green-600 flex items-center text-sm">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {scenarioResults.find(r => r.id === 'current')?.totalMonths - result.totalMonths} {t('visualization.months')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Chart goes here */}
            </div>
            <div>
              <ScenarioEditor 
                totalMinPayments={totalMinPayments}
                onUpdate={handleEditFormUpdate}
                estimatedMonths={estimatedMonths}
                estimatedInterest={estimatedInterest}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioComparisonTool;
