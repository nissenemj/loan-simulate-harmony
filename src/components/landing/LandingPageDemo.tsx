import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Debt, PaymentStrategy } from "@/utils/calculator/types";
import { calculatePaymentPlan } from "@/utils/calculator/debtCalculator";
import { ArrowRight, Calculator, Lightbulb, Clock, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrencyFormatter } from "@/utils/formatting";

/**
 * A simplified debt calculator demo for the landing page
 */
const LandingPageDemo = () => {
	const { t } = useLanguage();
	const navigate = useNavigate();
	const isMobile = useIsMobile();
	const currencyFormatter = useCurrencyFormatter();

	// Default example debts
	const defaultDebts: Debt[] = [
		{
			id: "demo-debt-1",
			name: t("landing.demo.creditCardDebt"),
			balance: 5000,
			interestRate: 18,
			minimumPayment: 150,
			type: "credit-card",
		},
		{
			id: "demo-debt-2",
			name: t("landing.demo.personalLoan"),
			balance: 10000,
			interestRate: 8,
			minimumPayment: 200,
			type: "loan",
		},
	];

	const [debts, setDebts] = useState<Debt[]>(defaultDebts);
	const [extraPayment, setExtraPayment] = useState<number>(100);
	const [strategy, setStrategy] = useState<PaymentStrategy>("avalanche");
	const [results, setResults] = useState<{
		avalanche: { months: number; interest: number } | null;
		snowball: { months: number; interest: number } | null;
	}>({ avalanche: null, snowball: null });
	const [chartData, setChartData] = useState<any[]>([]);

	// Calculate results when inputs change
	useEffect(() => {
		calculateResults();
	}, [debts, extraPayment, strategy]);

	// Handle debt field updates
	const handleUpdateDebt = (id: string, field: keyof Debt, value: any) => {
		setDebts(
			debts.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt))
		);
	};

	// Calculate results for both strategies
	const calculateResults = async () => {
		try {
			// Calculate minimum payment sum
			const minimumPaymentSum = debts.reduce(
				(sum, debt) => sum + debt.minimumPayment,
				0
			);
			const totalPayment = minimumPaymentSum + extraPayment;

			// Calculate for avalanche strategy
			const avalanchePlan = await calculatePaymentPlan(
				debts,
				totalPayment,
				"avalanche"
			);

			// Calculate for snowball strategy
			const snowballPlan = await calculatePaymentPlan(
				debts,
				totalPayment,
				"snowball"
			);

			// Set results
			setResults({
				avalanche: {
					months: avalanchePlan.totalMonths,
					interest: avalanchePlan.totalInterestPaid,
				},
				snowball: {
					months: snowballPlan.totalMonths,
					interest: snowballPlan.totalInterestPaid,
				},
			});

			// Prepare chart data
			const currentStrategy =
				strategy === "avalanche" ? avalanchePlan : snowballPlan;

			// Create simplified chart data (first 12 months or less)
			const chartData = currentStrategy.monthlyPlans
				.slice(0, Math.min(12, currentStrategy.monthlyPlans.length))
				.map((plan, index) => ({
					name: `${t("calculator.month")} ${plan.month + 1}`,
					balance: plan.totalRemainingBalance,
					payment: plan.totalPaid,
				}));

			setChartData(chartData);
		} catch (error) {
			console.error("Error calculating demo results:", error);
		}
	};

	// Handle CTA click
	const handleCTAClick = () => {
		navigate("/auth");
	};

	// Get current strategy results
	const currentResults =
		strategy === "avalanche" ? results.avalanche : results.snowball;
	const alternativeResults =
		strategy === "avalanche" ? results.snowball : results.avalanche;

	// Calculate savings compared to minimum payments
	const calculateSavings = () => {
		if (!currentResults) return { monthsSaved: 0, interestSaved: 0 };

		try {
			// Calculate minimum payment scenario
			const minimumPaymentSum = debts.reduce(
				(sum, debt) => sum + debt.minimumPayment,
				0
			);
			const minPaymentPlan = calculatePaymentPlan(
				debts,
				minimumPaymentSum,
				"avalanche"
			);

			return {
				monthsSaved: minPaymentPlan.totalMonths - currentResults.months,
				interestSaved:
					minPaymentPlan.totalInterestPaid - currentResults.interest,
			};
		} catch (error) {
			console.error("Error calculating savings:", error);
			return { monthsSaved: 0, interestSaved: 0 };
		}
	};

	const { monthsSaved, interestSaved } = calculateSavings();

	// Calculate strategy comparison
	const strategyComparison = () => {
		if (!currentResults || !alternativeResults)
			return { monthsDiff: 0, interestDiff: 0 };

		return {
			monthsDiff: Math.abs(currentResults.months - alternativeResults.months),
			interestDiff: Math.abs(
				currentResults.interest - alternativeResults.interest
			),
		};
	};

	const { monthsDiff, interestDiff } = strategyComparison();

	return (
		<section className="py-12 px-4">
			<div className="container mx-auto max-w-5xl">
				<div className="text-center mb-8">
					<h2 className="text-2xl md:text-3xl font-bold mb-2">
						{t("landing.demo.title")}
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						{t("landing.demo.subtitle")}
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>{t("landing.demo.calculatorTitle")}</CardTitle>
						<CardDescription>
							{t("landing.demo.calculatorDescription")}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Debt inputs */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">
								{t("landing.demo.debtInputsTitle")}
							</h3>

							{debts.map((debt, index) => (
								<div
									key={debt.id}
									className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md"
								>
									<div>
										<Label htmlFor={`demo-debt-name-${index}`}>
											{t("loan.name")}
										</Label>
										<Input
											id={`demo-debt-name-${index}`}
											value={debt.name}
											onChange={(e) =>
												handleUpdateDebt(debt.id, "name", e.target.value)
											}
										/>
									</div>

									<div>
										<Label htmlFor={`demo-debt-balance-${index}`}>
											{t("loan.balance")}
										</Label>
										<div className="relative">
											<span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
												€
											</span>
											<Input
												id={`demo-debt-balance-${index}`}
												type="number"
												value={debt.balance}
												onChange={(e) =>
													handleUpdateDebt(
														debt.id,
														"balance",
														Number(e.target.value) || 0
													)
												}
												className="pl-8"
												min="0"
												step="100"
											/>
										</div>
									</div>

									<div>
										<Label htmlFor={`demo-debt-interest-${index}`}>
											{t("loan.interestRate")}
										</Label>
										<div className="relative">
											<Input
												id={`demo-debt-interest-${index}`}
												type="number"
												value={debt.interestRate}
												onChange={(e) =>
													handleUpdateDebt(
														debt.id,
														"interestRate",
														Number(e.target.value) || 0
													)
												}
												className="pr-8"
												min="0"
												max="100"
												step="0.1"
											/>
											<span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">
												%
											</span>
										</div>
									</div>

									<div>
										<Label htmlFor={`demo-debt-payment-${index}`}>
											{t("repayment.minPayment")}
										</Label>
										<div className="relative">
											<span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
												€
											</span>
											<Input
												id={`demo-debt-payment-${index}`}
												type="number"
												value={debt.minimumPayment}
												onChange={(e) =>
													handleUpdateDebt(
														debt.id,
														"minimumPayment",
														Number(e.target.value) || 0
													)
												}
												className="pl-8"
												min="0"
												step="10"
											/>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Extra payment slider */}
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-medium mb-2">
									{t("landing.demo.extraPaymentTitle")}
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									{t("landing.demo.extraPaymentDescription")}
								</p>

								<div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 items-center">
									<div className="px-2">
										<Slider
											value={[extraPayment]}
											min={0}
											max={500}
											step={10}
											onValueChange={(value) => setExtraPayment(value[0])}
										/>
									</div>
									<div className="relative">
										<span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
											€
										</span>
										<Input
											type="number"
											value={extraPayment}
											onChange={(e) =>
												setExtraPayment(Number(e.target.value) || 0)
											}
											className="pl-8"
											min="0"
											step="10"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Strategy selection */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium mb-2">
								{t("landing.demo.strategyTitle")}
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{t("landing.demo.strategyDescription")}
							</p>

							<Tabs
								value={strategy}
								onValueChange={(value) => setStrategy(value as PaymentStrategy)}
							>
								<TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
									<TabsTrigger value="avalanche">
										{t("repayment.avalancheMethod")}
									</TabsTrigger>
									<TabsTrigger value="snowball">
										{t("repayment.snowballMethod")}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="avalanche" className="mt-4">
									<div className="bg-muted/50 p-4 rounded-md">
										<div className="flex items-start gap-2">
											<Lightbulb className="h-5 w-5 text-primary mt-0.5" />
											<p className="text-sm">
												{t("landing.demo.avalancheDescription")}
											</p>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="snowball" className="mt-4">
									<div className="bg-muted/50 p-4 rounded-md">
										<div className="flex items-start gap-2">
											<Lightbulb className="h-5 w-5 text-primary mt-0.5" />
											<p className="text-sm">
												{t("landing.demo.snowballDescription")}
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>

						{/* Results */}
						{currentResults && (
							<div className="space-y-6 pt-4">
								<div className="border-t pt-6">
									<h3 className="text-lg font-medium mb-4">
										{t("landing.demo.resultsTitle")}
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Time savings */}
										<Card className="bg-muted/30">
											<CardContent className="pt-6">
												<div className="flex items-start gap-4">
													<div className="bg-primary/10 p-2 rounded-full">
														<Clock className="h-6 w-6 text-primary" />
													</div>
													<div>
														<h4 className="font-medium">
															{t("landing.demo.timeSavingsTitle")}
														</h4>
														<div className="mt-1 space-y-1">
															<p className="text-2xl font-bold">
																{monthsSaved} {t("landing.demo.months")}
															</p>
															<p className="text-sm text-muted-foreground">
																{t("landing.demo.timeSavingsDescription")}
															</p>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Interest savings */}
										<Card className="bg-muted/30">
											<CardContent className="pt-6">
												<div className="flex items-start gap-4">
													<div className="bg-primary/10 p-2 rounded-full">
														<Coins className="h-6 w-6 text-primary" />
													</div>
													<div>
														<h4 className="font-medium">
															{t("landing.demo.interestSavingsTitle")}
														</h4>
														<div className="mt-1 space-y-1">
															<p className="text-2xl font-bold">
																{currencyFormatter.format(interestSaved)}
															</p>
															<p className="text-sm text-muted-foreground">
																{t("landing.demo.interestSavingsDescription")}
															</p>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>

									{/* Strategy comparison note */}
									{monthsDiff > 0 || interestDiff > 0 ? (
										<div className="mt-4 bg-muted/50 p-4 rounded-md">
											<div className="flex items-start gap-2">
												<Lightbulb className="h-5 w-5 text-primary mt-0.5" />
												<p className="text-sm">
													{strategy === "avalanche"
														? t("landing.demo.avalancheComparisonNote", {
																months: monthsDiff,
																interest:
																	currencyFormatter.format(interestDiff),
														  })
														: t("landing.demo.snowballComparisonNote", {
																months: monthsDiff,
																interest:
																	currencyFormatter.format(interestDiff),
														  })}
												</p>
											</div>
										</div>
									) : null}
								</div>

								{/* Chart visualization */}
								<div className="border-t pt-6">
									<h3 className="text-lg font-medium mb-4">
										{t("landing.demo.visualizationTitle")}
									</h3>

									<div className="h-64 md:h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={chartData}
												margin={{
													top: 20,
													right: isMobile ? 10 : 30,
													left: isMobile ? 10 : 20,
													bottom: isMobile ? 60 : 40,
												}}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis
													dataKey="name"
													angle={isMobile ? -45 : -20}
													textAnchor="end"
													height={isMobile ? 80 : 60}
													tick={{ fontSize: isMobile ? 10 : 12 }}
												/>
												<YAxis
													tickFormatter={(value) =>
														currencyFormatter.formatWithoutSymbol(value)
													}
												/>
												<Tooltip
													formatter={(value) => [
														currencyFormatter.format(Number(value)),
													]}
												/>
												<Bar
													dataKey="balance"
													name={t("landing.demo.remainingBalance")}
													fill="#8884d8"
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>

								{/* CTA */}
								<div className="border-t pt-6 text-center">
									<h3 className="text-lg font-medium mb-2">
										{t("landing.demo.ctaTitle")}
									</h3>
									<p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
										{t("landing.demo.ctaDescription")}
									</p>

									<Button
										size="lg"
										className="bg-primary text-white hover:bg-primary/90 transition-colors dark:bg-brand-primary dark:hover:bg-brand-primary-light"
										onClick={handleCTAClick}
									>
										{t("landing.demo.ctaButton")}
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default LandingPageDemo;
