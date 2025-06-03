
import React, { useMemo } from 'react';
import { Debt, PaymentPlan } from '@/utils/calculator/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { useCurrencyFormatter } from '@/utils/formatting';
import { useIsMobile } from '@/hooks/use-mobile';

interface DebtBreakdownChartProps {
  debts: Debt[];
  paymentPlan?: PaymentPlan;
}

export function DebtBreakdownChart({ debts, paymentPlan }: DebtBreakdownChartProps) {
  const currencyFormatter = useCurrencyFormatter();
  const isMobile = useIsMobile();
  
  // An array of colors for the pie chart segments
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#A259FF', '#4CAF50', '#F44336', '#E91E63',
    '#3F51B5', '#009688', '#FFC107', '#607D8B'
  ];
  
  // State for the active pie segment
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  // Prepare and memoize data for the chart to prevent unnecessary recalculations
  const { pieData, totalBalance } = useMemo(() => {
    // Filter out any debts with zero or negative balance
    const validDebts = debts.filter(debt => debt.balance > 0);
    
    // Calculate total balance
    const total = validDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Prepare data for the pie chart with percentage calculation
    const data = validDebts.map((debt, index) => ({
      name: debt.name,
      value: debt.balance,
      color: COLORS[index % COLORS.length],
      type: debt.type || 'generic debt',
      percentage: (debt.balance / total) * 100
    }));
    
    return { pieData: data, totalBalance: total };
  }, [debts, COLORS]);

  // Handlers for mouse events on pie segments
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  // Render active shape with more details
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#333">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#999">
          {currencyFormatter.format(payload.value)} ({payload.percentage.toFixed(1)}%)
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Velkojen erittely</CardTitle>
          <CardDescription>Kuinka velkasi jakautuvat</CardDescription>
        </div>
        {totalBalance > 0 && (
          <div className="text-right mt-2 md:mt-0">
            <div className="text-sm text-muted-foreground">Kokonaisvelka</div>
            <div className="text-xl font-bold">{currencyFormatter.format(totalBalance)}</div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80" aria-label="Velkojen erittely" role="img">
          <ResponsiveContainer width="100%" height="100%">
            {pieData.length > 0 ? (
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? "35%" : "50%"}
                  outerRadius={isMobile ? "60%" : "70%"}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    percent > (isMobile ? 0.08 : 0.05) ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                  }
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      aria-label={`${entry.name}: ${currencyFormatter.format(entry.value)} (${entry.percentage.toFixed(1)}%)`}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => currencyFormatter.format(Number(value))}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                />
                <Legend 
                  layout={isMobile ? "vertical" : "horizontal"} 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '10px', fontSize: isMobile ? '10px' : '12px' }}
                  formatter={(value, entry: any) => {
                    const item = pieData.find(d => d.name === value);
                    return (
                      <span className="text-xs md:text-sm" style={{ color: entry.color }}>
                        {value} - {item ? currencyFormatter.format(item.value) : ''}
                      </span>
                    );
                  }}
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Ei velkoja visualisoitavaksi
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
