
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
	const navigate = useNavigate();
	const isMobile = useIsMobile();
	const currencyFormatter = useCurrencyFormatter();

	// Default example debts
	const defaultDebts: Debt[] = [
		{
			id: "demo-debt-1",
			name: "Luottokortti",
			balance: 5000,
			interestRate: 18,
			minimumPayment: 150,
			type: "credit-card",
		},
		{
			id: "demo-debt-2",
			name: "Henkilökohtainen laina",
			balance: 10000,
			interestRate: 8,
			minimumPayment: 200,
			type: "loan",
		},
	];

	const [debts, setDebts] = useState<Debt[]>(defaultDebts);
	const [extraPayment, setExtraPayment] = useState<number>(230);
	const [strategy, setStrategy] = useState<PaymentStrategy>("snowball");
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

			// Validate that total payment is greater than minimum payment
			if (totalPayment <= minimumPaymentSum && extraPayment === 0) {
				// Set fallback data when no extra payment
				setChartData([
					{ month: "Kuukausi 1", balance: 15000 },
					{ month: "Kuukausi 2", balance: 14650 },
					{ month: "Kuukausi 3", balance: 14290 },
					{ month: "Kuukausi 4", balance: 13920 },
					{ month: "Kuukausi 5", balance: 13540 },
					{ month: "Kuukausi 6", balance: 13150 },
					{ month: "Kuukausi 7", balance: 12750 },
					{ month: "Kuukausi 8", balance: 12340 },
					{ month: "Kuukausi 9", balance: 11920 },
					{ month: "Kuukausi 10", balance: 11490 },
					{ month: "Kuukausi 11", balance: 11050 },
					{ month: "Kuukausi 12", balance: 10600 },
				]);
				return;
			}

			// Calculate for avalanche strategy
			const avalanchePlan = calculatePaymentPlan(
				debts,
				totalPayment,
				"avalanche"
			);

			// Calculate for snowball strategy
			const snowballPlan = calculatePaymentPlan(
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

			// Prepare chart data based on current strategy
			const currentStrategy =
				strategy === "avalanche" ? avalanchePlan : snowballPlan;

			// Create chart data showing remaining balance over time (12 months max for demo)
			const maxMonths = Math.min(12, currentStrategy.monthlyPlans.length);
			const totalInitialBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
			
			const chartDataPoints = [];
			
			// Add starting point
			chartDataPoints.push({
				month: "Kuukausi 1",
				balance: totalInitialBalance,
			});

			// Add monthly progress
			for (let i = 0; i < maxMonths - 1; i++) {
				const plan = currentStrategy.monthlyPlans[i];
				if (plan) {
					chartDataPoints.push({
						month: `Kuukausi ${i + 2}`,
						balance: Math.round(plan.totalRemainingBalance),
					});
				}
			}

			setChartData(chartDataPoints);
		} catch (error) {
			console.error("Error calculating demo results:", error);
			// Set fallback data if calculation fails
			setChartData([
				{ month: "Kuukausi 1", balance: 15000 },
				{ month: "Kuukausi 2", balance: 14650 },
				{ month: "Kuukausi 3", balance: 14290 },
				{ month: "Kuukausi 4", balance: 13920 },
				{ month: "Kuukausi 5", balance: 13540 },
				{ month: "Kuukausi 6", balance: 13150 },
				{ month: "Kuukausi 7", balance: 12750 },
				{ month: "Kuukausi 8", balance: 12340 },
				{ month: "Kuukausi 9", balance: 11920 },
				{ month: "Kuukausi 10", balance: 11490 },
				{ month: "Kuukausi 11", balance: 11050 },
				{ month: "Kuukausi 12", balance: 10600 },
			]);
		}
	};

	// Handle CTA click
	const handleCTAClick = () => {
		navigate("/calculator");
	};

	// Get current strategy results
	const currentResults =
		strategy === "avalanche" ? results.avalanche : results.snowball;

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
				monthsSaved: Math.max(0, minPaymentPlan.totalMonths - currentResults.months),
				interestSaved: Math.max(0, minPaymentPlan.totalInterestPaid - currentResults.interest),
			};
		} catch (error) {
			console.error("Error calculating savings:", error);
			return { monthsSaved: 15, interestSaved: 806.83 }; // Fallback values
		}
	};

	const { monthsSaved, interestSaved } = calculateSavings();

	return (
		<section className="py-16 px-4 bg-muted/30 dark:bg-muted/10">
			<div className="container mx-auto max-w-5xl">
				<div className="text-center mb-10">
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-3">
						<Calculator className="h-4 w-4 mr-2" />
						Kokeile nyt
					</div>
					<h2 className="text-3xl md:text-4xl font-bold mb-3">
						Kokeile velkalaskuriamme
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
						Katso kuinka paljon nopeammin voisit olla velaton yksinkertaisen laskurimme avulla
					</p>
				</div>

				<Card className="shadow-xl border-primary/10">
					<CardHeader className="border-b bg-muted/30 dark:bg-muted/10">
						<CardTitle className="text-xl md:text-2xl flex items-center">
							<Calculator className="h-5 w-5 mr-2 text-primary" />
							Velanmaksulaskuri
						</CardTitle>
						<CardDescription className="text-base">
							Syötä velkasi tiedot ja katso kuinka paljon voisit säästää
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6 p-6">
						{/* Debt inputs */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium">
								Velkasi
							</h3>

							{debts.map((debt, index) => (
								<div
									key={debt.id}
									className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-muted/20"
								>
									<div>
										<Label htmlFor={`demo-debt-name-${index}`} className="text-sm font-medium">
											Velan nimi
										</Label>
										<Input
											id={`demo-debt-name-${index}`}
											value={debt.name}
											onChange={(e) =>
												handleUpdateDebt(debt.id, "name", e.target.value)
											}
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor={`demo-debt-balance-${index}`} className="text-sm font-medium">
											Nykyinen saldo
										</Label>
										<div className="relative mt-1">
											<span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">
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
										<Label htmlFor={`demo-debt-interest-${index}`} className="text-sm font-medium">
											Korkoprosentti (%)
										</Label>
										<div className="relative mt-1">
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
											<span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-sm">
												%
											</span>
										</div>
									</div>

									<div>
										<Label htmlFor={`demo-debt-payment-${index}`} className="text-sm font-medium">
											Vähimmäismaksu
										</Label>
										<div className="relative mt-1">
											<span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">
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
									Ylimääräinen kuukausimaksu
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Pienikin ylimääräinen maksu joka kuukausi voi merkittävästi lyhentää velanmaksuaikaasi
								</p>

								<div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 items-center">
									<div className="px-2">
										<Slider
											value={[extraPayment]}
											min={0}
											max={500}
											step={10}
											onValueChange={(value) => setExtraPayment(value[0])}
											className="w-full"
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
								Takaisinmaksustrategia
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Valitse strategia, joka sopii parhaiten tilanteeseesi
							</p>

							<Tabs
								value={strategy}
								onValueChange={(value) => setStrategy(value as PaymentStrategy)}
								className="w-full"
							>
								<TabsList className="grid grid-cols-2 w-full max-w-md">
									<TabsTrigger value="avalanche">
										Lumivyöry-menetelmä
									</TabsTrigger>
									<TabsTrigger value="snowball">
										Lumipallo-menetelmä
									</TabsTrigger>
								</TabsList>

								<TabsContent value="avalanche" className="mt-4">
									<div className="bg-muted/50 p-4 rounded-md">
										<div className="flex items-start gap-2">
											<Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
											<p className="text-sm">
												Lumivyöry-menetelmä maksaa ensin korkeamman koron velat. Säästää eniten rahaa pitkällä aikavälillä.
											</p>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="snowball" className="mt-4">
									<div className="bg-muted/50 p-4 rounded-md">
										<div className="flex items-start gap-2">
											<Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
											<p className="text-sm">
												Lumipallo-menetelmä maksaa ensin pienimmät velat, antaen nopeita voittoja motivaation ylläpitämiseksi.
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>

						{/* Results section */}
						<div className="space-y-6 pt-4 border-t">
							<h3 className="text-xl font-semibold mb-6 flex items-center">
								<Lightbulb className="h-5 w-5 mr-2 text-primary" />
								Tulokset
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Time savings */}
								<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10 shadow-md overflow-hidden">
									<CardContent className="pt-6 relative">
										<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mt-12 -mr-12"></div>
										<div className="flex items-start gap-4 relative z-10">
											<div className="bg-primary/20 p-3 rounded-full">
												<Clock className="h-6 w-6 text-primary" />
											</div>
											<div>
												<h4 className="font-medium text-lg">
													Säästetty aika
												</h4>
												<div className="mt-2 space-y-1">
													<p className="text-3xl font-bold">
														{monthsSaved} kuukautta
													</p>
													<p className="text-sm text-muted-foreground">
														Säästetyt kuukaudet verrattuna vain vähimmäismaksujen maksamiseen
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Interest savings */}
								<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10 shadow-md overflow-hidden">
									<CardContent className="pt-6 relative">
										<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mt-12 -mr-12"></div>
										<div className="flex items-start gap-4 relative z-10">
											<div className="bg-primary/20 p-3 rounded-full">
												<Coins className="h-6 w-6 text-primary" />
											</div>
											<div>
												<h4 className="font-medium text-lg">
													Säästetty korko
												</h4>
												<div className="mt-2 space-y-1">
													<p className="text-3xl font-bold">
														{currencyFormatter.format(interestSaved)}
													</p>
													<p className="text-sm text-muted-foreground">
														Säästetty raha koroissa verrattuna vain vähimmäismaksujen maksamiseen
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Chart visualization */}
							<div className="mt-8">
								<h3 className="text-lg font-medium mb-4">
									Velanmaksumatkasi
								</h3>

								<div className="h-80 w-full bg-white dark:bg-muted/20 rounded-lg p-4 border">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={chartData}
											margin={{
												top: 20,
												right: 30,
												left: 20,
												bottom: 60,
											}}
										>
											<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
											<XAxis
												dataKey="month"
												angle={-45}
												textAnchor="end"
												height={80}
												tick={{ fontSize: 12 }}
												interval={0}
											/>
											<YAxis
												tickFormatter={(value) =>
													currencyFormatter.formatWithoutSymbol(value)
												}
												tick={{ fontSize: 12 }}
											/>
											<Tooltip
												formatter={(value) => [
													currencyFormatter.format(Number(value)),
													'Jäljellä oleva saldo'
												]}
												labelFormatter={(label) => label}
												contentStyle={{
													backgroundColor: 'rgba(255, 255, 255, 0.95)',
													borderRadius: '8px',
													boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
													border: '1px solid #e2e8f0'
												}}
											/>
											<Bar
												dataKey="balance"
												fill="#8884d8"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* CTA */}
							<div className="mt-8 text-center">
								<div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 shadow-md">
									<h3 className="text-xl font-semibold mb-3">
										Valmis luomaan täydellisen velanmaksusuunnitelmasi?
									</h3>
									<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
										Rekisteröidy luodaksesi henkilökohtaisen suunnitelman kaikille veloillesi ja seurataksesi edistymistäsi kohti taloudellista vapautta
									</p>

									<Button
										size="lg"
										className="bg-primary text-white hover:bg-primary/90 transition-colors h-12 px-6 text-base"
										onClick={handleCTAClick}
									>
										Luo täysi suunnitelmasi
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default LandingPageDemo;
