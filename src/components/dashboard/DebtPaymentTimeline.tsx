
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/loanCalculations";

interface DebtPaymentTimelineProps {
  totalDebt: number;
  totalAmountToPay: number;
  debtFreeDate: string;
}

const DebtPaymentTimeline = ({ totalDebt, totalAmountToPay, debtFreeDate }: DebtPaymentTimelineProps) => {
  const { t } = useLanguage();
  
  // Generate monthly data points until debt free date
  const generateTimelineData = () => {
    const startDate = new Date();
    const endDate = new Date(debtFreeDate);
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
    
    const monthlyReduction = totalDebt / monthsDiff;
    const monthlyInterest = (totalAmountToPay - totalDebt) / monthsDiff;
    
    return Array.from({ length: monthsDiff }, (_, index) => ({
      month: index,
      principal: totalDebt - (monthlyReduction * index),
      interest: monthlyInterest * (monthsDiff - index),
    }));
  };

  const data = generateTimelineData();

  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <CardTitle>{t('dashboard.paymentTimeline')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: t('dashboard.months'), position: 'bottom' }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area 
              type="monotone" 
              dataKey="principal" 
              stackId="1"
              stroke="#0088FE" 
              fill="#0088FE" 
              name={t('dashboard.principalDebt')}
            />
            <Area 
              type="monotone" 
              dataKey="interest" 
              stackId="1"
              stroke="#FF8042" 
              fill="#FF8042"
              name={t('dashboard.interest')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DebtPaymentTimeline;
