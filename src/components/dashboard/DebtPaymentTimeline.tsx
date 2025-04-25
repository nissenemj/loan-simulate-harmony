
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const DebtPaymentTimeline = ({
  totalDebt,
  totalAmountToPay,
  debtFreeDate,
}: DebtPaymentTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Generate data points for the timeline
  const generateTimelineData = () => {
    const paymentMonths = 24; // 2 years as default timeline
    const monthlyPayment = totalAmountToPay / paymentMonths;
    const interestPortion = (totalAmountToPay - totalDebt) / paymentMonths;

    return Array.from({ length: paymentMonths + 1 }, (_, index) => ({
      month: index,
      balance: Math.max(0, totalDebt - (monthlyPayment - interestPortion) * index),
      interest: interestPortion * index,
    }));
  };

  const data = generateTimelineData();

  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <CardTitle>{t("visualization.debtPaymentTimeline")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => `${value} ${t("calculator.months")}`}
              label={{ 
                value: t("calculator.months"),
                position: "bottom",
                offset: 0
              }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `${t("calculator.month")} ${label}`}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stackId="1"
              stroke="#0088FE"
              fill="#0088FE"
              name={t("calculator.remainingBalance")}
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke="#FF8042"
              fill="#FF8042"
              name={t("calculator.interestPaid")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DebtPaymentTimeline;
