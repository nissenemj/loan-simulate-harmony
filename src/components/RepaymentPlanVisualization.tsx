
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
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

  if (!plan.isViable) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("repayment.insufficientBudget")}</AlertTitle>
        <AlertDescription>
          {plan.insufficientBudgetMessage || t("repayment.budgetTooLow")}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if timeline is empty or calculation hit limits
  if (!plan.timeline || plan.timeline.length === 0) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("repayment.calculationError")}</AlertTitle>
        <AlertDescription>
          {t("debtStrategies.errorMaxMonths")}
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
          <CardTitle>{t("repayment.planSummary")}</CardTitle>
          <CardDescription>{t("repayment.planDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <CalendarClock className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">{t("repayment.timeToFreedom")}</div>
              <div className="text-2xl font-bold">
                {plan.totalMonths} {t("form.months")}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.floor(plan.totalMonths / 12)} {t("table.years")} {plan.totalMonths % 12} {t("form.months")}
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">{t("repayment.totalInterestPaid")}</div>
              <div className="text-2xl font-bold">
                {formatCurrency(plan.totalInterestPaid)}
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <TrendingDown className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium text-muted-foreground">{t("repayment.firstDebtPaidOff")}</div>
              <div className="text-2xl font-bold">
                {debtPayoffData.length > 0 ? `${debtPayoffData[0].months} ${t("form.months")}` : '-'}
              </div>
              <div className="text-xs text-muted-foreground">
                {debtPayoffData.length > 0 ? debtPayoffData[0].name : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Allocation Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("repayment.monthlyAllocation")}</CardTitle>
          <CardDescription>{t("repayment.allocationDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("repayment.debtName")}</TableHead>
                <TableHead>{t("repayment.minPayment")}</TableHead>
                <TableHead>{t("repayment.extraPayment")}</TableHead>
                <TableHead>{t("repayment.totalPayment")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.monthlyAllocation.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">{allocation.name}</TableCell>
                  <TableCell>{formatCurrency(allocation.minPayment)}</TableCell>
                  <TableCell>
                    {allocation.extraPayment > 0 ? (
                      <span className="text-green-600">+{formatCurrency(allocation.extraPayment)}</span>
                    ) : (
                      formatCurrency(0)
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(allocation.totalPayment)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">{t("repayment.total")}</TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(plan.monthlyAllocation.reduce((sum, a) => sum + a.minPayment, 0))}
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(plan.monthlyAllocation.reduce((sum, a) => sum + a.extraPayment, 0))}
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(plan.monthlyAllocation.reduce((sum, a) => sum + a.totalPayment, 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Balance Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("repayment.balanceTimeline")}</CardTitle>
          <CardDescription>{t("repayment.balanceTimelineDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={balanceTimelineData} 
                margin={{ top: 10, right: 10, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="month" 
                  label={{ 
                    value: t("repayment.months"), 
                    position: 'insideBottom', 
                    offset: -15,
                    fill: "var(--text-secondary, #E0E0E0)"
                  }} 
                />
                <YAxis 
                  tickFormatter={(value) => `€${Math.floor(value / 1000)}k`}
                  label={{ 
                    value: t("repayment.balance"), 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: 0,
                    fill: "var(--text-secondary, #E0E0E0)"
                  }}  
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), t("repayment.totalRemaining")]}
                  labelFormatter={(label) => `${t("repayment.months")}: ${label}`}
                  contentStyle={{
                    backgroundColor: "var(--bg-secondary, #1E1E1E)",
                    borderColor: "var(--bg-highlight, #333333)"
                  }}
                  itemStyle={{
                    color: "var(--text-secondary, #E0E0E0)"
                  }}
                  labelStyle={{
                    color: "var(--text-primary, #FFFFFF)"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalRemaining" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Debt Payoff Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("repayment.debtPayoffSchedule")}</CardTitle>
          <CardDescription>{t("repayment.payoffScheduleDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={debtPayoffData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 100, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  type="number" 
                  label={{ 
                    value: t("repayment.months"), 
                    position: 'insideBottom', 
                    offset: -15,
                    fill: "var(--text-secondary, #E0E0E0)"
                  }} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={90} 
                  tick={{ fill: "var(--text-secondary, #E0E0E0)" }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${t("form.months")}`, t("repayment.payoffTime")]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "var(--bg-secondary, #1E1E1E)",
                    borderColor: "var(--bg-highlight, #333333)"
                  }}
                  itemStyle={{
                    color: "var(--text-secondary, #E0E0E0)"
                  }}
                  labelStyle={{
                    color: "var(--text-primary, #FFFFFF)"
                  }}
                />
                <Bar dataKey="months" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepaymentPlanVisualization;
