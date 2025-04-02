
import React from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DebtBreakdownChartProps {
  debts: Debt[];
  paymentPlan?: PaymentPlan;
}

export function DebtBreakdownChart({ debts, paymentPlan }: DebtBreakdownChartProps) {
  const { t, locale } = useTranslation();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50', '#F44336', '#E91E63'];
  
  const data = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    color: COLORS[index % COLORS.length],
    type: debt.type || 'debt'
  }));

  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.debtBreakdown')}</CardTitle>
        <CardDescription>{t('visualization.distributionDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatter.format(Number(value))}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
