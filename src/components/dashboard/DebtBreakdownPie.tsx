
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
    { 
      name: t('visualization.totalInterestPaid'), 
      value: totalAmountToPay - totalDebt,
      color: '#FF8042'
    },
    { 
      name: t('visualization.principalPayment'), 
      value: totalDebt,
      color: '#0088FE'
    }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <CardTitle>{t('visualization.debtBreakdown')}</CardTitle>
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
              label={({ name, value }) => `${name}: ${getPercentage(value)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                `${formatCurrency(value)} (${getPercentage(value)}%)`,
                ''
              ]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DebtBreakdownPie;
