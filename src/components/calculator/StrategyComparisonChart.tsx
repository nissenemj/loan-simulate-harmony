
import React from 'react';
import { Debt } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StrategyComparisonChartProps {
  debts: Debt[];
}

export function StrategyComparisonChart({ debts }: StrategyComparisonChartProps) {
  const { t, locale } = useTranslation();
  
  // This is a simplified calculation just for demonstration purposes
  // In a real application, we would use more complex calculations from utility functions
  
  // Total debt amount
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  
  // Simple calculation of months to payoff using different strategies and additional payments
  const calculateMonths = (strategy: 'avalanche' | 'snowball', additionalPayment: number = 0) => {
    const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const monthlyPayment = totalMinPayment + additionalPayment;
    
    // Simplified estimate - would be more complex in real calculation
    const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate * debt.balance, 0) / totalDebt;
    
    // Apply a small multiplier based on strategy (just for demonstration)
    const strategyMultiplier = strategy === 'avalanche' ? 0.95 : 1.05;
    
    // Simple formula for months to pay off debt (very simplified)
    const months = (totalDebt / monthlyPayment) * (1 + (avgInterestRate / 100 / 12)) * strategyMultiplier;
    
    return Math.ceil(months);
  };
  
  // Calculate total interest paid (simplified)
  const calculateTotalInterest = (strategy: 'avalanche' | 'snowball', additionalPayment: number = 0) => {
    const months = calculateMonths(strategy, additionalPayment);
    const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const monthlyPayment = totalMinPayment + additionalPayment;
    
    // Simplified calculation
    const totalPaid = months * monthlyPayment;
    const totalInterest = totalPaid - totalDebt;
    
    return Math.max(0, totalInterest);
  };
  
  // Prepare data for the charts
  const timeData = [
    {
      name: t('visualization.minimumAvalanche'),
      months: calculateMonths('avalanche', 0),
    },
    {
      name: t('visualization.minimumSnowball'),
      months: calculateMonths('snowball', 0),
    },
    {
      name: t('visualization.extra100Avalanche'),
      months: calculateMonths('avalanche', 100),
    },
    {
      name: t('visualization.extra100Snowball'),
      months: calculateMonths('snowball', 100),
    },
  ];
  
  const interestData = [
    {
      name: t('visualization.minimumAvalanche'),
      interest: calculateTotalInterest('avalanche', 0),
    },
    {
      name: t('visualization.minimumSnowball'),
      interest: calculateTotalInterest('snowball', 0),
    },
    {
      name: t('visualization.extra100Avalanche'),
      interest: calculateTotalInterest('avalanche', 100),
    },
    {
      name: t('visualization.extra100Snowball'),
      interest: calculateTotalInterest('snowball', 100),
    },
  ];
  
  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.strategyComparison')}</CardTitle>
        <CardDescription>{t('visualization.strategyComparisonDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="time">
          <TabsList>
            <TabsTrigger value="time">{t('visualization.timeComparison')}</TabsTrigger>
            <TabsTrigger value="interest">{t('visualization.interestComparison')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{ value: t('visualization.monthsToPayoff'), angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} ${t('visualization.months')}`, t('visualization.timeToPayoff')]}
                  />
                  <Legend />
                  <Bar dataKey="months" name={t('visualization.monthsToPayoff')} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="interest">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={interestData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{ value: t('visualization.totalInterestPaid'), angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => formatter.format(value).replace(/[^\d.]/g, '')}
                  />
                  <Tooltip 
                    formatter={(value) => [formatter.format(Number(value)), t('visualization.totalInterestPaid')]}
                  />
                  <Legend />
                  <Bar dataKey="interest" name={t('visualization.totalInterestPaid')} fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
