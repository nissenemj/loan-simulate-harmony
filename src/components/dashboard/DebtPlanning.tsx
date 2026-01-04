import React, { useState, useMemo } from 'react';
import { Loan, calculateLoan } from '@/utils/loanCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, Zap, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DebtPlanningProps {
    loans: Loan[];
}

export const DebtPlanning: React.FC<DebtPlanningProps> = ({ loans }) => {
    const [extraPayment, setExtraPayment] = useState(0);
    const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

    // Calculate base scenario (minimum payments only)
    const baseScenario = useMemo(() => {
        const totalDebt = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalMonthlyPayment = loans.reduce((sum, loan) => {
            const result = calculateLoan(loan);
            return sum + result.monthlyPayment;
        }, 0);
        const monthlyInterest = loans.reduce((sum, loan) =>
            sum + (loan.amount * loan.interestRate / 100 / 12), 0
        );

        if (totalMonthlyPayment <= monthlyInterest) {
            return { months: Infinity, totalPaid: Infinity, totalInterest: Infinity };
        }

        const months = Math.ceil(totalDebt / (totalMonthlyPayment - monthlyInterest));
        const totalPaid = totalMonthlyPayment * months;
        const totalInterest = totalPaid - totalDebt;

        return { months, totalPaid, totalInterest };
    }, [loans]);

    // Calculate scenario with extra payment
    const extraPaymentScenario = useMemo(() => {
        if (extraPayment === 0) return baseScenario;

        const totalDebt = loans.reduce((sum, loan) => sum + loan.amount, 0);
        const totalMonthlyPayment = loans.reduce((sum, loan) => {
            const result = calculateLoan(loan);
            return sum + result.monthlyPayment;
        }, 0) + extraPayment;
        const monthlyInterest = loans.reduce((sum, loan) =>
            sum + (loan.amount * loan.interestRate / 100 / 12), 0
        );

        if (totalMonthlyPayment <= monthlyInterest) {
            return { months: Infinity, totalPaid: Infinity, totalInterest: Infinity };
        }

        const months = Math.ceil(totalDebt / (totalMonthlyPayment - monthlyInterest));
        const totalPaid = totalMonthlyPayment * months;
        const totalInterest = totalPaid - totalDebt;

        return { months, totalPaid, totalInterest };
    }, [loans, extraPayment, baseScenario]);

    const savings = useMemo(() => ({
        months: baseScenario.months - extraPaymentScenario.months,
        interest: baseScenario.totalInterest - extraPaymentScenario.totalInterest
    }), [baseScenario, extraPaymentScenario]);

    const formatCurrency = (value: number) => {
        if (!isFinite(value)) return '∞';
        return value.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
    };

    const formatTime = (months: number) => {
        if (!isFinite(months)) return '∞';
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return `${years} v ${remainingMonths} kk`;
    };

    return (
        <div className="space-y-6">
            {/* Strategy Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Valitse strategia
                    </CardTitle>
                    <CardDescription>
                        Vertaile eri takaisinmaksustrategioita
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={selectedStrategy} onValueChange={(v) => setSelectedStrategy(v as 'avalanche' | 'snowball')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="avalanche">Lumivyöry</TabsTrigger>
                            <TabsTrigger value="snowball">Lumipallo</TabsTrigger>
                        </TabsList>
                        <TabsContent value="avalanche" className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">Lumivyöry-menetelmä</h4>
                                <p className="text-sm text-muted-foreground">
                                    Maksa ensin korkeimman koron velat. Säästät enemmän korkoja pitkällä aikavälillä.
                                </p>
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">Järjestys:</p>
                                    {[...loans]
                                        .sort((a, b) => b.interestRate - a.interestRate)
                                        .map((loan, index) => (
                                            <div key={loan.id} className="flex items-center gap-2 text-sm">
                                                <span className="font-bold">{index + 1}.</span>
                                                <span>{loan.name}</span>
                                                <span className="text-muted-foreground">({loan.interestRate}%)</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="snowball" className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">Lumipallo-menetelmä</h4>
                                <p className="text-sm text-muted-foreground">
                                    Maksa ensin pienimmät velat. Saat nopeita voittoja ja motivaatiota jatkaa.
                                </p>
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">Järjestys:</p>
                                    {[...loans]
                                        .sort((a, b) => a.amount - b.amount)
                                        .map((loan, index) => (
                                            <div key={loan.id} className="flex items-center gap-2 text-sm">
                                                <span className="font-bold">{index + 1}.</span>
                                                <span>{loan.name}</span>
                                                <span className="text-muted-foreground">({formatCurrency(loan.amount)})</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Extra Payment Simulator */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Ylimääräisen maksun simulointi
                    </CardTitle>
                    <CardDescription>
                        Katso kuinka ylimääräiset maksut vaikuttavat velkavapauden saavuttamiseen
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Ylimääräinen kuukausimaksu</label>
                            <span className="text-2xl font-bold">{formatCurrency(extraPayment)}</span>
                        </div>
                        <Slider
                            value={[extraPayment]}
                            onValueChange={(value) => setExtraPayment(value[0])}
                            max={1000}
                            step={50}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Ilman ylimääräistä</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {formatTime(baseScenario.months)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Korot: {formatCurrency(baseScenario.totalInterest)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-primary">Ylimääräisellä maksulla</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-primary">
                                    {formatTime(extraPaymentScenario.months)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Korot: {formatCurrency(extraPaymentScenario.totalInterest)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {extraPayment > 0 && savings.months > 0 && (
                        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Säästöpotentiaali</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-green-700 dark:text-green-300">Säästetty aika</p>
                                    <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                        {formatTime(savings.months)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-green-700 dark:text-green-300">Säästetyt korot</p>
                                    <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                        {formatCurrency(savings.interest)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Button */}
            <Card>
                <CardContent className="pt-6">
                    <Button asChild size="lg" className="w-full">
                        <Link to="/calculator">
                            <TrendingDown className="mr-2 h-5 w-5" />
                            Luo yksityiskohtainen suunnitelma laskurissa
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
