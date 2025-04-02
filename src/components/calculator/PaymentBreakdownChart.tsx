
import React from 'react';
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
  
  // Create monthly data for the first 12 months or less if the plan is shorter
  const monthlyData = paymentPlan.monthlyPlans
    .slice(0, Math.min(12, paymentPlan.monthlyPlans.length))
    .map((plan) => ({
      name: `${t('month')} ${plan.month}`,
      principal: plan.totalPrincipalPaid,
      interest: plan.totalInterestPaid,
    }));

  // Create cumulative data
  const cumulativeData = paymentPlan.monthlyPlans
    .filter((_, index) => index % 3 === 0 || index === paymentPlan.monthlyPlans.length - 1) // Every 3 months
    .map((plan) => {
      // Calculate cumulative values up to this month
      const monthsIncluded = paymentPlan.monthlyPlans.slice(0, plan.month);
      const cumulativePrincipal = monthsIncluded.reduce((sum, p) => sum + p.totalPrincipalPaid, 0);
      const cumulativeInterest = monthsIncluded.reduce((sum, p) => sum + p.totalInterestPaid, 0);
      
      return {
        name: `${t('month')} ${plan.month}`,
        principal: cumulativePrincipal,
        interest: cumulativeInterest,
      };
    });

  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="cumulative">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
