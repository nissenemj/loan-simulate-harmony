
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/loanCalculations";

interface DebtBreakdownPieProps {
  totalDebt: number;
  totalMinPayments: number;
  totalAmountToPay: number;
}

const DebtBreakdownPie = ({ totalDebt, totalMinPayments, totalAmountToPay }: DebtBreakdownPieProps) => {
  const { t } = useLanguage();
  
  const data = [
    { name: t('results.principalDebt'), value: totalDebt, color: '#0088FE' },
    { name: t('results.totalInterest'), value: totalAmountToPay - totalDebt, color: '#FF8042' },
  ];

  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <CardTitle>{t('dashboard.debtBreakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={false} // Remove direct labels on the pie slices to avoid overlapping
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DebtBreakdownPie;
