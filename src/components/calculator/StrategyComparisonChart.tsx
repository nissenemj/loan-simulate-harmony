
import React, { useMemo } from 'react';
import { Debt } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { compareScenarios } from '@/utils/calculator/debtCalculator';
import { useCurrencyFormatter } from '@/utils/formatting';
import { useIsMobile } from '@/hooks/use-mobile';

interface StrategyComparisonChartProps {
  debts: Debt[];
}

export function StrategyComparisonChart({ debts }: StrategyComparisonChartProps) {
  const currencyFormatter = useCurrencyFormatter();
  const isMobile = useIsMobile();
  
  // Use actual calculation utilities for accurate comparisons
  const { timeData, interestData } = useMemo(() => {
    if (debts.length === 0) {
      return { timeData: [], interestData: [] };
    }
    
    // Define scenarios to compare with shorter, clearer names
    const scenarios = [
      {
        id: 'min-avalanche',
        name: isMobile ? 'Min + Lumivyöry' : 'Vähimmäis + Lumivyöry',
        additionalMonthlyPayment: 0,
        strategy: 'avalanche' as const
      },
      {
        id: 'min-snowball',
        name: isMobile ? 'Min + Lumipallo' : 'Vähimmäis + Lumipallo',
        additionalMonthlyPayment: 0,
        strategy: 'snowball' as const
      },
      {
        id: 'extra100-avalanche',
        name: isMobile ? '+100€ Lumivyöry' : '+100€ Lumivyöry',
        additionalMonthlyPayment: 100,
        strategy: 'avalanche' as const
      },
      {
        id: 'extra100-snowball',
        name: isMobile ? '+100€ Lumipallo' : '+100€ Lumipallo',
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
  }, [debts, isMobile]);

  // Simple tick formatter for X-axis that only returns strings
  const formatXAxisTick = (value: string) => {
    if (isMobile && value.length > 12) {
      // For mobile, truncate long labels
      return value.substring(0, 10) + '...';
    }
    return value;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategioiden vertailu</CardTitle>
        <CardDescription>Vertaile eri velkojen takaisinmaksustrategioita</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="time">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="time">Ajan vertailu</TabsTrigger>
            <TabsTrigger value="interest">Korkojen vertailu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time">
            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                {timeData.length > 0 ? (
                  <BarChart
                    data={timeData}
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: isMobile ? 80 : 100, 
                      bottom: isMobile ? 120 : 80 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      angle={isMobile ? -45 : -30} 
                      textAnchor="end" 
                      height={isMobile ? 120 : 80}
                      tick={{ 
                        fontSize: isMobile ? 10 : 12,
                        fill: 'hsl(var(--foreground))'
                      }}
                      interval={0}
                      tickFormatter={formatXAxisTick}
                    />
                    <YAxis
                      tick={{ 
                        fontSize: 12,
                        fill: 'hsl(var(--foreground))'
                      }}
                      label={{ 
                        value: 'Kuukautta takaisinmaksuun', 
                        angle: -90, 
                        position: 'insideLeft',
                        offset: isMobile ? -60 : -80,
                        style: { 
                          textAnchor: 'middle',
                          fill: 'hsl(var(--foreground))'
                        }
                      }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} kuukautta`, 'Takaisinmaksuaika']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '10px',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                    <Bar 
                      dataKey="months" 
                      name="Kuukautta takaisinmaksuun" 
                      fill="hsl(var(--primary))"
                      aria-label="Kuukautta takaisinmaksuun"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Ei dataa saatavilla
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="interest">
            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                {interestData.length > 0 ? (
                  <BarChart
                    data={interestData}
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: isMobile ? 80 : 100, 
                      bottom: isMobile ? 120 : 80 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name"
                      angle={isMobile ? -45 : -30} 
                      textAnchor="end" 
                      height={isMobile ? 120 : 80}
                      tick={{ 
                        fontSize: isMobile ? 10 : 12,
                        fill: 'hsl(var(--foreground))'
                      }}
                      interval={0}
                      tickFormatter={formatXAxisTick}
                    />
                    <YAxis
                      tick={{ 
                        fontSize: 12,
                        fill: 'hsl(var(--foreground))'
                      }}
                      label={{ 
                        value: 'Kokonaiskorot maksettu', 
                        angle: -90, 
                        position: 'insideLeft',
                        offset: isMobile ? -60 : -80,
                        style: { 
                          textAnchor: 'middle',
                          fill: 'hsl(var(--foreground))'
                        }
                      }}
                      tickFormatter={(value) => currencyFormatter.formatWithoutSymbol(value)}
                    />
                    <Tooltip 
                      formatter={(value) => [currencyFormatter.format(Number(value)), 'Kokonaiskorot maksettu']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '10px',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                    <Bar 
                      dataKey="interest" 
                      name="Kokonaiskorot maksettu" 
                      fill="hsl(var(--destructive))"
                      aria-label="Kokonaiskorot maksettu"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Ei dataa saatavilla
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
