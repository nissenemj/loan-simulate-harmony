
import React, { useMemo } from 'react';
import { PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaymentBreakdownChartProps {
  paymentPlan: PaymentPlan;
}

export function PaymentBreakdownChart({ paymentPlan }: PaymentBreakdownChartProps) {
  const { t, locale } = useTranslation();
  
  // Memoize the data calculations for better performance
  const { monthlyData, cumulativeData } = useMemo(() => {
    // Create monthly data for the first 12 months or less if the plan is shorter
    const monthlyData = paymentPlan.monthlyPlans
      .slice(0, Math.min(12, paymentPlan.monthlyPlans.length))
      .map((plan) => ({
        name: `${t('month')} ${plan.month + 1}`, // +1 for human-readable month numbers
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
          name: `${t('month')} ${plan.month + 1}`, // +1 for human-readable month numbers
          principal: cumulativePrincipal,
          interest: cumulativeInterest,
        });
      }
    });
    
    return { monthlyData, cumulativeData };
  }, [paymentPlan, t]);

  // Memoize the formatter for better performance
  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  }, [locale]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.paymentBreakdown')}</CardTitle>
        <CardDescription>{t('visualization.paymentBreakdownDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList>
            <TabsTrigger value="monthly">{t('visualization.monthlyBreakdown')}</TabsTrigger>
            <TabsTrigger value="cumulative">{t('visualization.cumulativeBreakdown')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {monthlyData.length > 0 ? (
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => formatter.format(value).replace(/[^\d.]/g, '')}
                    />
                    <Tooltip
                      formatter={(value) => formatter.format(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="principal" name={t('visualization.principalPayment')} fill="#4CAF50" />
                    <Bar dataKey="interest" name={t('visualization.interestPayment')} fill="#FF8042" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('visualization.noDataAvailable')}
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="cumulative">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {cumulativeData.length > 0 ? (
                  <BarChart
                    data={cumulativeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => formatter.format(value).replace(/[^\d.]/g, '')}
                    />
                    <Tooltip
                      formatter={(value) => formatter.format(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="principal" name={t('visualization.cumulativePrincipal')} fill="#4CAF50" />
                    <Bar dataKey="interest" name={t('visualization.cumulativeInterest')} fill="#FF8042" />
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
