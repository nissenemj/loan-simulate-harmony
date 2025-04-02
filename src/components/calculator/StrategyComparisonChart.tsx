
import React, { useMemo } from 'react';
import { Debt } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { compareScenarios } from '@/utils/calculator/debtCalculator';
import { useCurrencyFormatter } from '@/utils/formatting';

interface StrategyComparisonChartProps {
  debts: Debt[];
}

export function StrategyComparisonChart({ debts }: StrategyComparisonChartProps) {
  const { t } = useTranslation();
  const currencyFormatter = useCurrencyFormatter();
  
  // Use actual calculation utilities for accurate comparisons
  const { timeData, interestData } = useMemo(() => {
    if (debts.length === 0) {
      return { timeData: [], interestData: [] };
    }
    
    // Define scenarios to compare
    const scenarios = [
      {
        id: 'min-avalanche',
        name: t('visualization.minimumAvalanche'),
        additionalMonthlyPayment: 0,
        strategy: 'avalanche' as const
      },
      {
        id: 'min-snowball',
        name: t('visualization.minimumSnowball'),
        additionalMonthlyPayment: 0,
        strategy: 'snowball' as const
      },
      {
        id: 'extra100-avalanche',
        name: t('visualization.extra100Avalanche'),
        additionalMonthlyPayment: 100,
        strategy: 'avalanche' as const
      },
      {
        id: 'extra100-snowball',
        name: t('visualization.extra100Snowball'),
        additionalMonthlyPayment: 100,
        strategy: 'snowball' as const
      }
    ];
    
    try {
      // Use the actual compareScenarios utility
      const comparisonResults = compareScenarios(debts, scenarios);
      
      // Transform results for charts
      const timeData = comparisonResults.map(result => ({
        name: result.scenarioName,
        months: result.totalMonths
      }));
      
      const interestData = comparisonResults.map(result => ({
        name: result.scenarioName,
        interest: result.totalInterestPaid
      }));
      
      return { timeData, interestData };
    } catch (error) {
      console.error('Error comparing scenarios:', error);
      return { timeData: [], interestData: [] };
    }
  }, [debts, t]);
  
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
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {timeData.length > 0 ? (
                  <BarChart
                    data={timeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-20} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: t('visualization.monthsToPayoff'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} ${t('visualization.months')}`, t('visualization.timeToPayoff')]}
                    />
                    <Legend />
                    <Bar dataKey="months" name={t('visualization.monthsToPayoff')} fill="#8884d8" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('visualization.noDataAvailable')}
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="interest">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {interestData.length > 0 ? (
                  <BarChart
                    data={interestData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      angle={-20} 
                      textAnchor="end" 
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: t('visualization.totalInterestPaid'), angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => currencyFormatter.formatWithoutSymbol(value)}
                    />
                    <Tooltip 
                      formatter={(value) => [currencyFormatter.format(Number(value)), t('visualization.totalInterestPaid')]}
                    />
                    <Legend />
                    <Bar dataKey="interest" name={t('visualization.totalInterestPaid')} fill="#FF8042" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('visualization.noDataAvailable')}
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
