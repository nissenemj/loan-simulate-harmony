
import { useState } from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Info, PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';

interface DebtVisualizationProps {
  debts: Debt[];
  paymentPlan?: PaymentPlan;
}

/**
 * DebtVisualization component
 * Visualizes debt information using charts
 */
export function DebtVisualization({ debts, paymentPlan }: DebtVisualizationProps) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<'distribution' | 'interest' | 'timeline'>('distribution');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Colors for charts
  const COLORS = [
    '#8B5CF6', // Purple
    '#D946EF', // Pink
    '#0EA5E9', // Blue
    '#F97316', // Orange
    '#22C55E', // Green
    '#EAB308', // Yellow
    '#EC4899', // Hot pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
  ];
  
  // Prepare data for debt distribution pie chart
  const pieData = debts.map(debt => ({
    name: debt.name,
    value: debt.balance,
    interestRate: debt.interestRate
  }));
  
  // Prepare data for interest comparison bar chart
  const barData = debts.map(debt => ({
    name: debt.name,
    balance: debt.balance,
    yearlyInterest: debt.balance * debt.interestRate / 100,
    interestRate: debt.interestRate
  }));
  
  // Prepare timeline data if payment plan exists
  const timelineData = paymentPlan ? 
    paymentPlan.monthlyPlans
      .filter((_, index) => index % 3 === 0) // Show every 3 months
      .map((plan, index) => ({
        name: `${t('visualization.month')} ${index * 3 + 1}`,
        balance: plan.totalRemainingBalance,
        date: plan.date
      })) 
    : [];
  
  // Custom tooltip formatter for the pie chart
  const customPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{t('calculator.interestRate')}: {payload[0].payload.interestRate}%</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip formatter for the bar chart
  const customBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            {t('visualization.balance')}: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm">
            {t('visualization.yearlyInterest')}: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('calculator.interestRate')}: {payload[0].payload.interestRate}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip formatter for the line chart
  const customLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-background border border-border p-3 rounded shadow-md">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            {t('visualization.remainingBalance')}: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(payload[0].payload.date).toLocaleDateString('fi-FI')}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Format y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value;
  };
  
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('visualization.debtBreakdown')}</CardTitle>
          <CardDescription>{t('visualization.breakdownDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t('visualization.noDebtsToVisualize')}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.debtBreakdown')}</CardTitle>
        <CardDescription>{t('visualization.breakdownDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              {t('visualization.distribution')}
            </TabsTrigger>
            <TabsTrigger value="interest" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              {t('visualization.interest')}
            </TabsTrigger>
            <TabsTrigger value="timeline" disabled={!paymentPlan} className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              {t('visualization.progress')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={customPieTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {t('visualization.distributionDescription')}
            </p>
          </TabsContent>
          
          <TabsContent value="interest" className="h-[350px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip content={customBarTooltip} />
                <Legend />
                <Bar dataKey="balance" name={t('visualization.balance')} fill="#8B5CF6" />
                <Bar dataKey="yearlyInterest" name={t('visualization.yearlyInterest')} fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {t('visualization.interestDescription')}
            </p>
          </TabsContent>
          
          <TabsContent value="timeline" className="h-[350px] md:h-[400px]">
            {paymentPlan ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timelineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={customLineTooltip} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name={t('visualization.remainingBalance')}
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {t('visualization.progressDescription')}
                </p>
              </>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{t('visualization.calculatePaymentPlanFirst')}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
