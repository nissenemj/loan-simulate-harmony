
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AlertCircle, TrendingDown, CalendarClock, DollarSign } from "lucide-react";
import { RepaymentPlan } from "@/utils/repayment";
import { formatCurrency } from "@/utils/loanCalculations";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";

interface RepaymentPlanVisualizationProps {
  plan: RepaymentPlan;
  debts?: (Loan | CreditCard)[];
  className?: string;
}

const RepaymentPlanVisualization: React.FC<RepaymentPlanVisualizationProps> = ({ 
  plan,
  debts = [],
  className
}) => {
  if (!plan.isViable) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Budjetti ei riitä</AlertTitle>
        <AlertDescription>
          {plan.insufficientBudgetMessage || "Budjetti on liian pieni velkojen maksuun"}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if timeline is empty or calculation hit limits
  if (!plan.timeline || plan.timeline.length === 0) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Laskentavirhe</AlertTitle>
        <AlertDescription>
          Laskenta ei onnistunut - maksuaika liian pitkä
        </AlertDescription>
      </Alert>
    );
  }

  // Prepare data for the balance timeline chart
  const balanceTimelineData = plan.timeline.filter((_, index) => 
    // Pick every 3rd month for larger timelines to avoid overcrowding
    plan.totalMonths <= 24 || index % 3 === 0 || index === plan.timeline.length - 1
  ).map(month => ({
    month: month.month,
    totalRemaining: month.totalRemaining,
  }));

  // Prepare data for the debt payoff chart
  const debtPayoffData = [];
  const uniqueDebtIds = [...new Set(plan.timeline[0]?.debts.map(debt => debt.id) || [])];
  
  uniqueDebtIds.forEach(debtId => {
    const debt = plan.timeline[0]?.debts.find(d => d.id === debtId);
    if (!debt) return;
    
    const lastMonthWithDebt = plan.timeline.findIndex(month => 
      month.debts.find(d => d.id === debtId)?.remainingBalance === 0
    );
    
    debtPayoffData.push({
      name: debt.name,
      months: lastMonthWithDebt !== -1 ? lastMonthWithDebt + 1 : plan.totalMonths,
    });
  });

  // Sort by payoff time
  debtPayoffData.sort((a, b) => a.months - b.months);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Takaisinmaksusuunnitelma</CardTitle>
          <CardDescription>Yhteenveto suunnitellusta takaisinmaksusta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <CalendarClock className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">Aika velkavapauteen</div>
              <div className="text-2xl font-bold">
                {plan.totalMonths} kuukautta
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.floor(plan.totalMonths / 12)} vuotta {plan.totalMonths % 12} kuukautta
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">Korot yhteensä</div>
              <div className="text-2xl font-bold">
                {formatCurrency(plan.totalInterestPaid)}
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <TrendingDown className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">Kuukausimaksu</div>
              <div className="text-2xl font-bold">
                {formatCurrency(plan.monthlyBudget)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Velkasaldon kehitys</CardTitle>
          <CardDescription>Velkojen väheneminen ajan myötä</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Jäljellä']}
                  labelFormatter={(label) => `Kuukausi ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalRemaining" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Debt Payoff Order */}
      {debtPayoffData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Velkojen maksujärjestys</CardTitle>
            <CardDescription>Missä järjestyksessä velat maksetaan pois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtPayoffData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={(value) => [`${value} kuukautta`, 'Maksuaika']}
                  />
                  <Bar dataKey="months" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RepaymentPlanVisualization;
