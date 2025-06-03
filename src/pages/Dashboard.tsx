import React, { useState, useMemo, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	HelpCircle,
	Download,
	Calculator,
	Save,
} from "lucide-react";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard as CreditCardType } from "@/utils/creditCardCalculations";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	PrioritizationMethod,
	convertCreditCardToDebtItem,
	convertLoanToDebtItem,
	generateRepaymentPlan,
	saveRepaymentStrategy,
} from "@/utils/repayment";

// Newly created components
import DebtSummaryCard from "@/components/dashboard/DebtSummaryCard";
import PaymentPlanSummary from "@/components/dashboard/PaymentPlanSummary";
import DebtBreakdownTabs from "@/components/dashboard/DebtBreakdownTabs";
import FinancialTips from "@/components/dashboard/FinancialTips";
import DebtFreeTimeline from "@/components/dashboard/DebtFreeTimeline";
import DebtPaymentTimeline from "@/components/dashboard/DebtPaymentTimeline"; // Import the DebtPaymentTimeline component
import LoanSummary from "@/components/LoanSummary";
import ScenarioComparisonTool from "@/components/dashboard/ScenarioComparisonTool";
import UnderConstructionBanner from "@/components/UnderConstructionBanner";

const Dashboard = () => {
	const [loans, setLoans] = useLocalStorage<Loan[]>("loans", []);
	const [creditCards, setCreditCards] = useLocalStorage<CreditCardType[]>(
		"creditCards",
		[]
	);
	const { user } = useAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();

	// State for selected scenario (default is current reality)
	const [showScenarioComparison, setShowScenarioComparison] = useState(false);
	const [showStrategySaveDialog, setShowStrategySaveDialog] = useState(false);
	const [strategyName, setStrategyName] = useState("");
	const [selectedMethod, setSelectedMethod] =
		useState<PrioritizationMethod>("avalanche");

	// Make sure we're only using active loans and credit cards
	const activeLoans = loans.filter((loan) => loan.isActive);
	const activeCards = creditCards.filter((card) => card.isActive);

	// Calculate the total debt
	const totalDebt =
		activeLoans.reduce((sum, loan) => sum + loan.amount, 0) +
		activeCards.reduce((sum, card) => sum + card.balance, 0);

	// Check if there are any debts
	const hasDebts =
		totalDebt > 0 || activeLoans.length > 0 || activeCards.length > 0;

	// Calculate a simple debt-free date (just for demonstration)
	const calculateDebtFreeDate = () => {
		const now = new Date();
		// Adding 5 years as a placeholder - this would be replaced by actual calculation
		const debtFreeDate = new Date(now.setFullYear(now.getFullYear() + 5));
		return debtFreeDate.toLocaleDateString("fi-FI");
	};

	// Format the debt free date for display
	const formattedDebtFreeDate = calculateDebtFreeDate();

	// Monthly budget for debt repayment (should ideally come from user settings)
	const monthlyBudget = 1500;

	// Calculate total minimum payments
	const totalMinPayments =
		activeLoans.reduce((sum, loan) => {
			// Use loan.minPayment if available, otherwise calculate it
			if (loan.minPayment) {
				return sum + loan.minPayment;
			} else {
				// Fallback calculation if minPayment is not directly available
				return (
					sum +
					(loan.amount * loan.interestRate) / 100 / 12 +
					loan.amount / (loan.termYears * 12)
				);
			}
		}, 0) +
		activeCards.reduce((sum, card) => {
			const percentPayment = card.balance * (card.minPaymentPercent / 100);
			return sum + Math.max(card.minPayment, percentPayment);
		}, 0);

	// Calculate extra budget available
	const extraBudget = Math.max(0, monthlyBudget - totalMinPayments);

	// Find debt with highest interest rate
	let highestInterestDebt = { name: "", rate: 0 };

	activeLoans.forEach((loan) => {
		if (loan.interestRate > highestInterestDebt.rate) {
			highestInterestDebt = { name: loan.name, rate: loan.interestRate };
		}
	});

	activeCards.forEach((card) => {
		if (card.apr > highestInterestDebt.rate) {
			highestInterestDebt = { name: card.name, rate: card.apr };
		}
	});

	// Calculate total amount to pay
	const calculateTotalAmountToPay = () => {
		const loanTotal = activeLoans.reduce((sum, loan) => {
			// Calculate simple interest over the loan term
			const interest = loan.amount * (loan.interestRate / 100) * loan.termYears;
			return sum + loan.amount + interest;
		}, 0);

		const cardTotal = activeCards.reduce((sum, card) => {
			// Rough estimate for credit cards (assumes paying off over 24 months)
			const interest = card.balance * (card.apr / 100) * 2;
			return sum + card.balance + interest;
		}, 0);

		return loanTotal + cardTotal;
	};

	const totalAmountToPay = calculateTotalAmountToPay();

	// Debug logs
	console.log("Dashboard loaded with:", {
		activeLoans: activeLoans.length,
		activeCards: activeCards.length,
		totalDebt,
		totalMinPayments,
		totalAmountToPay,
	});

	// Use a guest username if no user is logged in
	const username = user?.email?.split("@")[0] || t("dashboard.guest");

	// Export data as CSV
	const exportDataAsCSV = () => {
		// Create data arrays for loans and credit cards
		const loanData = activeLoans.map((loan) => ({
			type: "Loan",
			name: loan.name,
			amount: loan.amount,
			interestRate: loan.interestRate,
			termYears: loan.termYears,
			monthlyPayment:
				loan.minPayment ||
				(loan.amount * loan.interestRate) / 100 / 12 +
					loan.amount / (loan.termYears * 12),
		}));

		const cardData = activeCards.map((card) => ({
			type: "Credit Card",
			name: card.name,
			amount: card.balance,
			interestRate: card.apr,
			termYears: "N/A",
			monthlyPayment: Math.max(
				card.minPayment,
				card.balance * (card.minPaymentPercent / 100)
			),
		}));

		// Combine data
		const allData = [...loanData, ...cardData];

		// Create CSV header
		const header = [
			"Type",
			"Name",
			"Amount",
			"Interest Rate (%)",
			"Term (Years)",
			"Monthly Payment",
		];

		// Create CSV content
		const csvContent = [
			header.join(","),
			...allData.map((item) =>
				[
					item.type,
					`"${item.name}"`, // Wrap in quotes to handle commas in names
					item.amount.toFixed(2),
					item.interestRate.toFixed(2),
					item.termYears,
					item.monthlyPayment.toFixed(2),
				].join(",")
			),
		].join("\n");

		// Create a download link
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "debt_data.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success(t("dashboard.dataExported") || "Data exported successfully");
	};

	// Handle saving strategy
	const handleSaveStrategy = () => {
		if (!strategyName.trim()) {
			toast.error(t("errors.nameRequired"));
			return;
		}

		try {
			// Convert loans and credit cards to debt items
			const debtItems = [
				...activeLoans.map(convertLoanToDebtItem),
				...activeCards.map(convertCreditCardToDebtItem),
			];

			// Generate repayment plan
			const repaymentPlan = generateRepaymentPlan(
				debtItems,
				monthlyBudget,
				selectedMethod
			);

			// Save strategy
			saveRepaymentStrategy(
				strategyName,
				selectedMethod,
				monthlyBudget,
				repaymentPlan
			);

			// Close dialog and show success message
			setShowStrategySaveDialog(false);
			setStrategyName("");
			toast.success(t("dashboard.strategySaved"));
		} catch (error) {
			console.error("Error saving strategy:", error);
			toast.error(t("errors.saveFailed"));
		}
	};

	return (
		<div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
			<Helmet>
				<title>{t("dashboard.title")} | Loan Simulator</title>
			</Helmet>

			<div className="flex flex-col gap-8">
				<UnderConstructionBanner />

				<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							{t("dashboard.welcome")}, {username}
						</h1>
						<p className="text-muted-foreground">
							{t("dashboard.welcomeSubtitle")}
						</p>
					</div>

					<div className="flex items-center gap-4 mt-4 md:mt-0">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={exportDataAsCSV}
									>
										<Download className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{t("dashboard.exportData") || "Export debt data as CSV"}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{hasDebts && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setShowStrategySaveDialog(true)}
										>
											<Save className="mr-2 h-4 w-4" />
											{t("dashboard.saveStrategy")}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{t("dashboard.saveStrategyTooltip") ||
												"Save current repayment strategy"}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={showScenarioComparison ? "default" : "outline"}
										size="sm"
										onClick={() =>
											setShowScenarioComparison(!showScenarioComparison)
										}
									>
										<Calculator className="mr-2 h-4 w-4" />
										{t("dashboard.compareScenarios") || "Compare Scenarios"}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{t("dashboard.compareScenariosTooltip") ||
											"Compare different repayment scenarios"}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate("/debt-summary")}
						>
							{t("dashboard.viewDebtSummary")}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>

				{showScenarioComparison && (
					<ScenarioComparisonTool
						activeLoans={activeLoans}
						activeCards={activeCards}
						monthlyBudget={monthlyBudget}
						onClose={() => setShowScenarioComparison(false)}
					/>
				)}

				<DebtSummaryCard
					totalDebt={totalDebt}
					debtFreeDate={formattedDebtFreeDate}
					totalMinPayments={totalMinPayments}
					totalAmountToPay={totalAmountToPay}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
					<div className="w-full">
						<DebtPaymentTimeline
							totalDebt={totalDebt}
							totalAmountToPay={totalAmountToPay}
							debtFreeDate={formattedDebtFreeDate}
						/>
					</div>

					<div className="w-full">
						<PaymentPlanSummary
							monthlyBudget={monthlyBudget}
							totalMinPayments={totalMinPayments}
							extraBudget={extraBudget}
							highestInterestDebt={highestInterestDebt}
						/>
					</div>
				</div>

				<DebtBreakdownTabs
					activeLoans={activeLoans}
					activeCards={activeCards}
				/>

				{activeLoans.length > 0 && <LoanSummary loans={activeLoans} />}

				<FinancialTips />

				<DebtFreeTimeline
					totalDebt={totalDebt}
					formattedDebtFreeDate={formattedDebtFreeDate}
					activeCards={activeCards}
					activeLoans={activeLoans}
					monthlyBudget={monthlyBudget}
				/>
			</div>

			{/* Save Strategy Dialog */}
			<Dialog
				open={showStrategySaveDialog}
				onOpenChange={setShowStrategySaveDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("dashboard.saveStrategy")}</DialogTitle>
						<DialogDescription>
							{t("dashboard.saveStrategyDescription")}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="strategy-name" className="text-right">
								{t("dashboard.strategyName")}
							</Label>
							<Input
								id="strategy-name"
								value={strategyName}
								onChange={(e) => setStrategyName(e.target.value)}
								className="col-span-3"
								placeholder={t("dashboard.strategyNamePlaceholder")}
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="strategy-method" className="text-right">
								{t("dashboard.method")}
							</Label>
							<div className="col-span-3 flex gap-4">
								<Button
									type="button"
									variant={
										selectedMethod === "avalanche" ? "default" : "outline"
									}
									onClick={() => setSelectedMethod("avalanche")}
								>
									{t("dashboard.avalancheStrategy")}
								</Button>
								<Button
									type="button"
									variant={
										selectedMethod === "snowball" ? "default" : "outline"
									}
									onClick={() => setSelectedMethod("snowball")}
								>
									{t("dashboard.snowballStrategy")}
								</Button>
								<Button
									type="button"
									variant={selectedMethod === "equal" ? "default" : "outline"}
									onClick={() => setSelectedMethod("equal")}
								>
									{t("dashboard.equalStrategy")}
								</Button>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowStrategySaveDialog(false)}
						>
							{t("common.cancel")}
						</Button>
						<Button type="button" onClick={handleSaveStrategy}>
							{t("dashboard.save")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Dashboard;
