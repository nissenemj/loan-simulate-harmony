
import React, { useMemo } from 'react';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from '@/utils/loanCalculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, PiggyBank, CalendarClock } from 'lucide-react';

interface DebtAnalyticsProps {
    loans: Loan[];
}

export const DebtAnalytics: React.FC<DebtAnalyticsProps> = ({ loans }) => {
    const analyticsData = useMemo(() => {
        let totalDebt = 0;
        let totalMonthlyPayment = 0;
        let totalInterestCost = 0;
        const loanDistribution: { name: string; value: number }[] = [];

        // Timeline projection (simplified based on minimum payments)
        const timelineData: { month: number; balance: number }[] = [];

        // Check if we have any loans
        if (loans.length === 0) return { totalDebt, totalMonthlyPayment, totalInterestCost, loanDistribution, timelineData };

        loans.forEach(loan => {
            totalDebt += loan.amount;
            const result = calculateLoan(loan);
            totalMonthlyPayment += result.monthlyPayment;
            // Note: Infinite interest (if payment too low) handled by checking isFinite
            if (isFinite(result.totalInterest)) {
                totalInterestCost += result.totalInterest;
            }

            loanDistribution.push({ name: loan.name, value: loan.amount });
        });

        // Create a rough timeline projection for the aggregate debt
        // This is a simplification assuming constant payments for visualization
        let currentBalance = totalDebt;
        let month = 0;
        // Limit projection to 10 years or until debt is paid
        while (currentBalance > 0 && month <= 120) {
            timelineData.push({ month, balance: Math.max(0, currentBalance) });

            // Rough monthly interest calculation on aggregate
            // (This is an approximation for visual purposes)
            const avgInterestRate = loans.reduce((acc, l) => acc + (l.amount / totalDebt) * l.interestRate, 0) / 100 / 12;
            const monthlyInterest = currentBalance * avgInterestRate;
            const principalPaid = totalMonthlyPayment - monthlyInterest;

            currentBalance -= principalPaid;
            month++;
        }

        return {
            totalDebt,
            totalMonthlyPayment,
            totalInterestCost,
            loanDistribution,
            timelineData
        };
    }, [loans]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kokonaisvelka</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalDebt)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kuukausierät yht.</CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalMonthlyPayment)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arvioidut korkokulut</CardTitle>
                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalInterestCost)}</div>
                        <p className="text-xs text-muted-foreground">Koko laina-ajalta</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Loan Distribution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Velan jakauma</CardTitle>
                        <CardDescription>Mistä kokonaisvelkasi muodostuu</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.loanDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analyticsData.loanDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Payoff Projection Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Takaisinmaksuennuste</CardTitle>
                        <CardDescription>Arvioitu velan kehitys nykyisillä maksuilla (10v)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={analyticsData.timelineData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" label={{ value: 'Kuukaudet', position: 'insideBottom', offset: -5 }} />
                                <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Area type="monotone" dataKey="balance" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} name="Jäljellä oleva velka" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
