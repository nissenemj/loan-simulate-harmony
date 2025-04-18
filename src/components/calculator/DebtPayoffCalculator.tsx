import { useState, useEffect } from "react";
import { Debt, PaymentStrategy, PaymentPlan } from "@/utils/calculator/types";
import { calculatePaymentPlan } from "@/utils/calculator/debtCalculator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";

interface DebtPayoffCalculatorProps {
	initialDebts?: Debt[];
	onSaveResults?: (plan: PaymentPlan) => void;
	onError?: (error: any) => void;
}

/**
 * Debt Payoff Calculator component
 * Allows users to calculate debt payoff plans using different strategies
 */
export function DebtPayoffCalculator({
	initialDebts = [],
	onSaveResults,
	onError,
}: DebtPayoffCalculatorProps) {
	const { t } = useTranslation();
	const [debts, setDebts] = useState<Debt[]>(initialDebts);
	const [newDebt, setNewDebt] = useState<Partial<Debt>>({
		name: "",
		balance: 0,
		interestRate: 0,
		minimumPayment: 0,
	});
	const [strategy, setStrategy] = useState<PaymentStrategy>("avalanche");
	const [additionalPayment, setAdditionalPayment] = useState(0);
	const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Calculate total minimum payment
	const totalMinimumPayment = debts.reduce(
		(sum, debt) => sum + debt.minimumPayment,
		0
	);

	// Calculate total monthly payment
	const totalMonthlyPayment = totalMinimumPayment + additionalPayment;

	// Calculate payment plan when inputs change
	useEffect(() => {
		if (debts.length === 0) {
			setPaymentPlan(null);
			return;
		}

		try {
			const plan = calculatePaymentPlan(debts, totalMonthlyPayment, strategy);
			setPaymentPlan(plan);
			setError(null);

			// Call onSaveResults if provided
			if (onSaveResults) {
				onSaveResults(plan);
			}
		} catch (err: any) {
			setError(err.message || "Error calculating payment plan");
			setPaymentPlan(null);

			// Call onError if provided
			if (onError) {
				onError(err);
			}
		}
	}, [debts, totalMonthlyPayment, strategy, onSaveResults, onError]);

	// Handle adding a new debt
	const handleAddDebt = () => {
		// Validate inputs
		if (
			!newDebt.name ||
			!newDebt.balance ||
			!newDebt.interestRate ||
			!newDebt.minimumPayment
		) {
			setError("Please fill in all debt fields");
			return;
		}

		// Create new debt with unique ID
		const debt: Debt = {
			id: `debt-${Date.now()}`,
			name: newDebt.name || "",
			balance: Number(newDebt.balance),
			interestRate: Number(newDebt.interestRate),
			minimumPayment: Number(newDebt.minimumPayment),
		};

		// Add to debts list
		setDebts([...debts, debt]);

		// Reset new debt form
		setNewDebt({
			name: "",
			balance: 0,
			interestRate: 0,
			minimumPayment: 0,
		});

		setError(null);
	};

	// Handle removing a debt
	const handleRemoveDebt = (id: string) => {
		setDebts(debts.filter((debt) => debt.id !== id));
	};

	// Handle strategy change
	const handleStrategyChange = (value: string) => {
		setStrategy(value as PaymentStrategy);
	};

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("fi-FI", {
			style: "currency",
			currency: "EUR",
		}).format(amount);
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("fi-FI", {
			year: "numeric",
			month: "long",
		});
	};

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">{t("calculator.addYourDebts")}</h2>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 stack-mobile">
					<div className="space-y-2">
						<Label htmlFor="debtName">{t("calculator.debtName")}</Label>
						<Input
							id="debtName"
							value={newDebt.name}
							onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
							placeholder={t("calculator.debtNamePlaceholder")}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="balance">{t("calculator.balance")}</Label>
						<Input
							id="balance"
							type="number"
							min="0"
							step="0.01"
							value={newDebt.balance || ""}
							onChange={(e) =>
								setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) })
							}
							placeholder="0.00"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="interestRate">{t("calculator.interestRate")}</Label>
						<Input
							id="interestRate"
							type="number"
							min="0"
							step="0.01"
							value={newDebt.interestRate || ""}
							onChange={(e) =>
								setNewDebt({
									...newDebt,
									interestRate: parseFloat(e.target.value),
								})
							}
							placeholder="0.00"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="minimumPayment">
							{t("calculator.minimumPayment")}
						</Label>
						<Input
							id="minimumPayment"
							type="number"
							min="0"
							step="0.01"
							value={newDebt.minimumPayment || ""}
							onChange={(e) =>
								setNewDebt({
									...newDebt,
									minimumPayment: parseFloat(e.target.value),
								})
							}
							placeholder="0.00"
						/>
					</div>

					<div className="flex items-end">
						<Button onClick={handleAddDebt} className="w-full">
							{t("calculator.addDebt")}
						</Button>
					</div>
				</div>
			</div>

			{debts.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-xl font-bold">{t("calculator.yourDebts")}</h3>

					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("calculator.debtName")}</TableHead>
									<TableHead className="text-right">
										{t("calculator.balance")}
									</TableHead>
									<TableHead className="text-right">
										{t("calculator.interestRate")}
									</TableHead>
									<TableHead className="text-right">
										{t("calculator.minimumPayment")}
									</TableHead>
									<TableHead className="text-center">
										{t("calculator.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{debts.map((debt) => (
									<TableRow key={debt.id}>
										<TableCell>{debt.name}</TableCell>
										<TableCell className="text-right">
											{formatCurrency(debt.balance)}
										</TableCell>
										<TableCell className="text-right">
											{debt.interestRate.toFixed(2)}%
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(debt.minimumPayment)}
										</TableCell>
										<TableCell className="text-center">
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleRemoveDebt(debt.id)}
											>
												<X className="h-4 w-4 mr-1" />
												{t("calculator.remove")}
											</Button>
										</TableCell>
									</TableRow>
								))}
								<TableRow className="bg-muted/50">
									<TableCell className="font-medium">
										{t("calculator.total")}
									</TableCell>
									<TableCell className="text-right font-medium">
										{formatCurrency(
											debts.reduce((sum, debt) => sum + debt.balance, 0)
										)}
									</TableCell>
									<TableCell className="text-right">-</TableCell>
									<TableCell className="text-right font-medium">
										{formatCurrency(totalMinimumPayment)}
									</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			{debts.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-xl font-bold">
						{t("calculator.paymentStrategy")}
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 stack-mobile">
						<div>
							<Tabs value={strategy} onValueChange={handleStrategyChange}>
								<TabsList className="grid grid-cols-2">
									<TabsTrigger value="avalanche">
										{t("calculator.avalanche")}
									</TabsTrigger>
									<TabsTrigger value="snowball">
										{t("calculator.snowball")}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="avalanche" className="space-y-2 mt-4">
									<h4 className="font-semibold">
										{t("calculator.avalancheStrategy")}
									</h4>
									<p className="text-muted-foreground">
										{t("calculator.avalancheDescription")}
									</p>
								</TabsContent>

								<TabsContent value="snowball" className="space-y-2 mt-4">
									<h4 className="font-semibold">
										{t("calculator.snowballStrategy")}
									</h4>
									<p className="text-muted-foreground">
										{t("calculator.snowballDescription")}
									</p>
								</TabsContent>
							</Tabs>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="additionalPayment">
									{t("calculator.additionalMonthlyPayment")}
								</Label>
								<Input
									id="additionalPayment"
									type="number"
									min="0"
									step="10"
									value={additionalPayment}
									onChange={(e) =>
										setAdditionalPayment(parseFloat(e.target.value) || 0)
									}
									placeholder="0.00"
								/>
								<p className="text-sm text-muted-foreground">
									{t("calculator.additionalPaymentDescription")}
								</p>
							</div>

							<div className="bg-muted/50 p-4 rounded-lg">
								<div className="flex justify-between mb-2">
									<span>{t("calculator.minimumPayment")}:</span>
									<span className="font-semibold">
										{formatCurrency(totalMinimumPayment)}
									</span>
								</div>
								<div className="flex justify-between mb-2">
									<span>{t("calculator.additionalPayment")}:</span>
									<span className="font-semibold">
										{formatCurrency(additionalPayment)}
									</span>
								</div>
								<div className="flex justify-between pt-2 border-t">
									<span>{t("calculator.totalMonthlyPayment")}:</span>
									<span className="font-semibold">
										{formatCurrency(totalMonthlyPayment)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{paymentPlan && (
				<div className="space-y-4">
					<h3 className="text-xl font-bold">
						{t("calculator.paymentResults")}
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>{t("calculator.payoffDate")}</CardTitle>
								<CardDescription>
									{t("calculator.estimatedCompletion")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-2xl md:text-3xl font-bold">
									{formatDate(paymentPlan.payoffDate)}
								</div>
								<p className="text-muted-foreground">
									{paymentPlan.totalMonths} {t("calculator.months")}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>{t("calculator.totalInterest")}</CardTitle>
								<CardDescription>
									{t("calculator.interestPaid")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-2xl md:text-3xl font-bold">
									{formatCurrency(paymentPlan.totalInterestPaid)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>{t("calculator.totalPaid")}</CardTitle>
								<CardDescription>
									{t("calculator.principalPlusInterest")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-2xl md:text-3xl font-bold">
									{formatCurrency(paymentPlan.totalPaid)}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="mt-4">
						<Button onClick={() => onSaveResults && onSaveResults(paymentPlan)}>
							{t("calculator.saveResults")}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
