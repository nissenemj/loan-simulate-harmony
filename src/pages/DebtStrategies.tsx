import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Calculator, LineChart, Coins, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import NewsletterSignup from "@/components/NewsletterSignup";
import { BackgroundBeams } from "@/components/ui/background-beams";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import UnderConstructionBanner from "@/components/UnderConstructionBanner";
import { ErrorProvider } from "@/contexts/ErrorContext";

// Import debt-related components
import {
	DebtPayoffCalculator,
	DebtPayoffTimeline,
	DebtConsolidationCalculator,
	ExtraPaymentCalculator,
	DebtVisualization,
} from "@/components/calculator";

// Import types
import { Debt, PaymentPlan } from "@/utils/calculator/types";

const DebtStrategies = () => {
	const { t } = useLanguage();
	const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
	const [creditCards, setCreditCards] = useLocalStorage<CreditCard[]>(
		"creditCards",
		[]
	);
	const [debts, setDebts] = useState<Debt[]>([]);

	// Update debts when loans or credit cards change
	useEffect(() => {
		// Convert loans and credit cards to Debt objects
		const loanDebts: Debt[] = loans
			.filter((loan) => loan.isActive)
			.map((loan) => ({
				id: loan.id,
				name: loan.name,
				balance: loan.amount,
				interestRate: loan.interestRate,
				minimumPayment:
					loan.minPayment || (loan.amount * loan.interestRate) / 100 / 12,
				type: "loan",
			}));

		const creditCardDebts: Debt[] = creditCards
			.filter((card) => card.isActive)
			.map((card) => ({
				id: card.id,
				name: card.name,
				balance: card.balance,
				interestRate: card.apr,
				minimumPayment: Math.max(
					card.minPayment,
					card.balance * (card.minPaymentPercent / 100)
				),
				type: "credit-card",
			}));

		setDebts([...loanDebts, ...creditCardDebts]);
	}, [loans, creditCards]);

	const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
	const [calculationError, setCalculationError] = useState<string | null>(null);

	// Handle saving payment plan
	const handleSaveResults = (plan: PaymentPlan) => {
		setCalculationError(null);
		setPaymentPlan(plan);
	};

	// Handle calculation errors
	const handleCalculationError = (error: any) => {
		if (error.message && error.message.includes("maximum number of months")) {
			setCalculationError(t("debtStrategies.errorMaxMonths"));
		} else {
			setCalculationError(
				error.message || t("debtStrategies.errorInCalculation")
			);
		}
	};

	return (
		<ErrorProvider>
			<div className="min-h-screen">
				<div className="container mx-auto py-8 px-4 max-w-7xl">
					<Helmet>
						<title>
							{t("debtStrategies.pageTitle")} | {t("app.title")}
						</title>
					</Helmet>

					<div className="space-y-6">
						<BreadcrumbNav />
						<UnderConstructionBanner />

						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{t("debtStrategies.pageTitle")}
							</h1>
							<p className="text-muted-foreground mt-2">
								{t("debtStrategies.pageDescription")}
							</p>
						</div>

						{loans.length === 0 && creditCards.length === 0 ? (
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									{t("debtStrategies.noDebtAlert")}
								</AlertDescription>
							</Alert>
						) : (
							<>
								<DebtVisualization debts={debts} paymentPlan={paymentPlan} />

								{calculationError && (
									<Alert variant="destructive" className="my-4">
										<Info className="h-4 w-4" />
										<AlertDescription>{calculationError}</AlertDescription>
									</Alert>
								)}

								<Tabs defaultValue="calculator" className="w-full mt-8">
									<TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
										<TabsTrigger
											value="calculator"
											className="flex items-center gap-2"
										>
											<Calculator className="h-4 w-4" />
											{t("debtStrategies.calculatorTab")}
										</TabsTrigger>
										<TabsTrigger
											value="timeline"
											className="flex items-center gap-2"
										>
											<LineChart className="h-4 w-4" />
											{t("debtStrategies.timelineTab")}
										</TabsTrigger>
										<TabsTrigger
											value="extraPayment"
											className="flex items-center gap-2"
										>
											<Coins className="h-4 w-4" />
											{t("debtStrategies.extraPaymentTab")}
										</TabsTrigger>
										<TabsTrigger
											value="consolidation"
											className="flex items-center gap-2"
										>
											<TrendingDown className="h-4 w-4" />
											{t("debtStrategies.consolidationTab")}
										</TabsTrigger>
									</TabsList>

									<TabsContent value="calculator">
										<DebtPayoffCalculator
											initialDebts={debts}
											onSaveResults={handleSaveResults}
											onError={handleCalculationError}
										/>
									</TabsContent>

									<TabsContent value="timeline">
										{paymentPlan ? (
											<DebtPayoffTimeline
												debts={debts}
												additionalPayment={
													paymentPlan.monthlyPayment -
													debts.reduce(
														(sum, debt) => sum + debt.minimumPayment,
														0
													)
												}
												strategy={paymentPlan.strategy}
											/>
										) : (
											<Alert>
												<Info className="h-4 w-4" />
												<AlertDescription>
													{t("debtStrategies.calculateFirst")}
												</AlertDescription>
											</Alert>
										)}
									</TabsContent>

									<TabsContent value="extraPayment">
										<ExtraPaymentCalculator debts={debts} />
									</TabsContent>

									<TabsContent value="consolidation">
										<DebtConsolidationCalculator debts={debts} />
									</TabsContent>
								</Tabs>
							</>
						)}
					</div>
				</div>

				<div className="relative h-[500px] w-full mt-16 rounded-lg overflow-hidden">
					<div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
						<NewsletterSignup className="w-full max-w-xl relative z-10 bg-background/80 backdrop-blur-sm" />
					</div>
					<BackgroundBeams />
				</div>
			</div>
		</ErrorProvider>
	);
};

export default DebtStrategies;
