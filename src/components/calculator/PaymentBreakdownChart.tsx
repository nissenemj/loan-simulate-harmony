
import React, { useMemo } from 'react';
import { PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrencyFormatter } from '@/utils/formatting';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentBreakdownChartProps {
  paymentPlan: PaymentPlan;
}

export function PaymentBreakdownChart({ paymentPlan }: PaymentBreakdownChartProps) {
  const currencyFormatter = useCurrencyFormatter();
  const isMobile = useIsMobile();
  
  // Memoize the data calculations for better performance
  const { monthlyData, cumulativeData } = useMemo(() => {
    // Create monthly data for the first 12 months or less if the plan is shorter
    const monthlyData = paymentPlan.monthlyPlans
      .slice(0, Math.min(12, paymentPlan.monthlyPlans.length))
      .map((plan) => ({
        name: `Kuukausi ${plan.month + 1}`, // +1 for human-readable month numbers
        principal: plan.totalPrincipalPaid,
        interest: plan.totalInterestPaid,
      }));

    // Create properly calculated cumulative data
    const cumulativeData = [];
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    // Filter for every 3 months and the final month
    paymentPlan.monthlyPlans.forEach((plan, index) => {
      // Add to running totals
      cumulativePrincipal += plan.totalPrincipalPaid;
      cumulativeInterest += plan.totalInterestPaid;
      
      // Include data point every 3 months or for the final month
      if (index % 3 === 0 || index === paymentPlan.monthlyPlans.length - 1) {
        cumulativeData.push({
          name: `Kuukausi ${plan.month + 1}`, // +1 for human-readable month numbers
          principal: cumulativePrincipal,
          interest: cumulativeInterest,
        });
      }
    });
    
    return { monthlyData, cumulativeData };
  }, [paymentPlan]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maksujen erittely</CardTitle>
        <CardDescription>Kuukausittaisten maksujen jakautuminen pääomaan ja korkoihin</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="monthly">Kuukausittain</TabsTrigger>
            <TabsTrigger value="cumulative">Kumulatiivinen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="h-64 md:h-80" aria-label="Kuukausittainen erittely" role="img">
              <ResponsiveContainer width="100%" height="100%">
                {monthlyData.length > 0 ? (
                  <BarChart
                    data={monthlyData}
                    margin={{ 
                      top: 20, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 60 : 40 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={isMobile ? -45 : 0} 
                      textAnchor={isMobile ? "end" : "middle"} 
                      height={isMobile ? 60 : 40}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => currencyFormatter.formatWithoutSymbol(value)}
                      width={isMobile ? 40 : 60}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(Number(value))}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        fontSize: isMobile ? '12px' : '14px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '10px', 
                        fontSize: isMobile ? '10px' : '12px' 
                      }} 
                    />
                    <Bar 
                      dataKey="principal" 
                      name="Pääoman maksu" 
                      fill="#4CAF50"
                      aria-label="Pääoman maksu"
                    />
                    <Bar 
                      dataKey="interest" 
                      name="Korkomaksu" 
                      fill="#FF8042"
                      aria-label="Korkomaksu"
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
          
          <TabsContent value="cumulative">
            <div className="h-64 md:h-80" aria-label="Kumulatiivinen erittely" role="img">
              <ResponsiveContainer width="100%" height="100%">
                {cumulativeData.length > 0 ? (
                  <BarChart
                    data={cumulativeData}
                    margin={{ 
                      top: 20, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 60 : 40 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={isMobile ? -45 : 0} 
                      textAnchor={isMobile ? "end" : "middle"} 
                      height={isMobile ? 60 : 40}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => currencyFormatter.formatWithoutSymbol(value)}
                      width={isMobile ? 40 : 60}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(Number(value))}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        fontSize: isMobile ? '12px' : '14px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '10px', 
                        fontSize: isMobile ? '10px' : '12px' 
                      }} 
                    />
                    <Bar 
                      dataKey="principal" 
                      name="Kumulatiivinen pääoma" 
                      fill="#4CAF50"
                      aria-label="Kumulatiivinen pääoma"
                    />
                    <Bar 
                      dataKey="interest" 
                      name="Kumulatiiviset korot" 
                      fill="#FF8042"
                      aria-label="Kumulatiiviset korot"
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
