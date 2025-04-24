import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/loanCalculations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DebtPaymentTimelineProps {
  totalDebt: number;
  totalAmountToPay: number;
  debtFreeDate: string;
}

const DebtPaymentTimeline = ({ totalDebt, totalAmountToPay, debtFreeDate }: DebtPaymentTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const generateTimelineData = () => {
    if (!totalDebt || !totalAmountToPay || !debtFreeDate) {
      return [];
    }

    const startDate = new Date();
    const endDate = new Date(debtFreeDate);
    
    if (isNaN(endDate.getTime())) {
      console.warn('Invalid debt free date:', debtFreeDate);
      return [];
    }
    
    const monthsDiff = Math.max(1, (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth()));
    
    const monthlyReduction = totalDebt / Math.max(1, monthsDiff);
    const monthlyInterest = (totalAmountToPay - totalDebt) / Math.max(1, monthsDiff);
    
    return Array.from({ length: Math.max(1, monthsDiff) }, (_, index) => ({
      month: index,
      principal: totalDebt - (monthlyReduction * index),
      interest: monthlyInterest * (Math.max(1, monthsDiff) - index),
    }));
  };

  const data = generateTimelineData();

  if (!data.length) {
    return (
      <Card className="w-full h-[300px]">
        <CardHeader>
          <CardTitle>{t('visualization.paymentTimeline')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">{t('visualization.noDataAvailable')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[300px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('visualization.paymentTimeline')}</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/debt-summary?tab=repayment-plan')}
        >
          {t('dashboard.viewRepaymentPlan')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
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
              label={{ value: t('visualization.months'), position: 'bottom' }}
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
              name={t('visualization.principalPayment')}
            />
            <Area 
              type="monotone" 
              dataKey="interest" 
              stackId="1"
              stroke="#FF8042" 
              fill="#FF8042"
              name={t('visualization.interestPayment')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DebtPaymentTimeline;
