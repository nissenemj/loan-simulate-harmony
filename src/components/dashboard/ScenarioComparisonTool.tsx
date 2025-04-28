import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { scenarioColors } from "@/utils/chartColors";
import { useIsMobile } from "@/hooks/use-mobile";
import ScenarioGuide from "./ScenarioGuide";
import { useCurrencyFormatter } from "@/utils/formatting";
import {
	X,
	AlertCircle,
	Info,
	TrendingDown,
	TrendingUp,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { combineDebts } from "@/utils/repayment/debtConverters";
import { generateRepaymentPlan } from "@/utils/repayment/generateRepaymentPlan";
import { PrioritizationMethod } from "@/utils/repayment/types";
import { PaymentStrategy } from "@/utils/calculator/types";
import { ScenarioEditor } from "./ScenarioEditor";
import { Scenario } from "@/types/scenarios";
import { Download, Share } from "lucide-react";
import { WhatIfAnalysis } from "./WhatIfAnalysis";
import { MilestoneVisualization } from "./MilestoneVisualization";
import { toast } from "sonner";

interface ScenarioComparisonToolProps {
	activeLoans: Loan[];
	activeCards: CreditCard[];
	monthlyBudget: number;
	onClose: () => void;
}

const ScenarioComparisonTool: React.FC<ScenarioComparisonToolProps> = ({
	activeLoans,
	activeCards,
	monthlyBudget,
	onClose,
}) => {
	const { t } = useLanguage();
	const currencyFormatter = useCurrencyFormatter();
	const [debugMode, setDebugMode] = useState(false);

	const totalDebt =
		activeLoans.reduce((sum, loan) => sum + loan.amount, 0) +
		activeCards.reduce((sum, card) => sum + card.balance, 0);

	const calculateTotalMinPayments = () => {
		const loanMinPayments = activeLoans.reduce((sum, loan) => {
			if (loan.minPayment) {
				return sum + loan.minPayment;
			} else {
				const monthlyRate = loan.interestRate / 100 / 12;
				const totalMonths = loan.termYears * 12;
				let payment;

				if (loan.repaymentType === "custom-payment" && loan.customPayment) {
					payment = loan.customPayment;
				} else {
					payment =
						(loan.amount *
							monthlyRate *
							Math.pow(1 + monthlyRate, totalMonths)) /
						(Math.pow(1 + monthlyRate, totalMonths) - 1);
				}

				if (loan.monthlyFee) {
					payment += loan.monthlyFee;
				}

				return sum + payment;
			}
		}, 0);

		const cardMinPayments = activeCards.reduce((sum, card) => {
			const percentPayment = card.balance * (card.minPaymentPercent / 100);
			const minPayment = Math.max(card.minPayment, percentPayment);
			return sum + minPayment;
		}, 0);

		return loanMinPayments + cardMinPayments;
	};

	const totalMinPayments = calculateTotalMinPayments();

	const defaultScenarios: Scenario[] = [
		{
			id: "current",
			name: t("scenarios.current") || "Current Situation",
			interestRateAdjustment: 0,
			monthlyPayment: Math.max(
				monthlyBudget,
				totalMinPayments,
				totalDebt * 0.01
			),
			extraPayment: 0,
			strategy: "avalanche",
		},
		{
			id: "optimistic",
			name: t("scenarios.optimistic") || "Optimistic",
			interestRateAdjustment: -1,
			monthlyPayment:
				Math.max(monthlyBudget, totalMinPayments, totalDebt * 0.01) * 1.2,
			extraPayment: 1000,
			strategy: "avalanche",
		},
		{
			id: "pessimistic",
			name: t("scenarios.pessimistic") || "Pessimistic",
			interestRateAdjustment: 2,
			monthlyPayment: Math.max(
				monthlyBudget,
				totalMinPayments,
				totalDebt * 0.01
			),
			extraPayment: 0,
			strategy: "avalanche",
		},
	];

	const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
	const [activeScenarioId, setActiveScenarioId] = useState<string>("current");
	const [editingScenarioId, setEditingScenarioId] = useState<string | null>(
		null
	);
	const [editFormData, setEditFormData] = useState<Omit<Scenario, "id">>({
		name: "",
		interestRateAdjustment: 0,
		monthlyPayment: 0,
		extraPayment: 0,
		strategy: "avalanche",
	});

	const [activeTab, setActiveTab] = useState("repayment");

	const validateValue = (
		value: number,
		min: number,
		max: number,
		defaultVal: number
	): number => {
		if (isNaN(value) || value < min || value > max) {
			return defaultVal;
		}
		return value;
	};

	const adjustDebtsForScenario = (scenario: Scenario) => {
		const adjustedLoans = activeLoans.map((loan) => ({
			...loan,
			interestRate: Math.max(
				0,
				loan.interestRate + scenario.interestRateAdjustment
			),
		}));

		const adjustedCards = activeCards.map((card) => ({
			...card,
			apr: Math.max(0, card.apr + scenario.interestRateAdjustment),
		}));

		return { adjustedLoans, adjustedCards };
	};

	const activeScenario =
		scenarios.find((scenario) => scenario.id === activeScenarioId) ||
		scenarios[0];

	const scenarioResults = React.useMemo(() => {
		return scenarios.map((scenario) => {
			const { adjustedLoans, adjustedCards } = adjustDebtsForScenario(scenario);
			const combinedDebts = combineDebts(adjustedLoans, adjustedCards);

			if (combinedDebts.length === 0) {
				return {
					id: scenario.id,
					name: scenario.name,
					totalMonths: 0,
					totalInterestPaid: 0,
					isViable: true,
					timeline: [],
					error: "no-debts",
				};
			}

			const effectiveMonthlyPayment =
				scenario.monthlyPayment + scenario.extraPayment / 12;

			try {
				const plan = generateRepaymentPlan(
					combinedDebts,
					effectiveMonthlyPayment,
					scenario.strategy as PrioritizationMethod
				);

				if (!plan.isViable) {
					return {
						id: scenario.id,
						name: scenario.name,
						totalMonths: 0,
						totalInterestPaid: 0,
						isViable: false,
						timeline: [],
						error: "insufficient-payment",
						insufficientBudgetMessage: plan.insufficientBudgetMessage,
					};
				}

				if (!plan.timeline || plan.timeline.length === 0) {
					return {
						id: scenario.id,
						name: scenario.name,
						totalMonths: 0,
						totalInterestPaid: 0,
						isViable: false,
						timeline: [],
						error: "empty-timeline",
					};
				}

				return {
					id: scenario.id,
					name: scenario.name,
					totalMonths: plan.totalMonths,
					totalInterestPaid: plan.totalInterestPaid,
					isViable: plan.isViable,
					timeline: plan.timeline,
				};
			} catch (error) {
				console.error(
					`Error generating repayment plan for scenario ${scenario.id}:`,
					error
				);
				return {
					id: scenario.id,
					name: scenario.name,
					totalMonths: 0,
					totalInterestPaid: 0,
					isViable: false,
					timeline: [],
					error: "calculation-error",
					errorMessage:
						error instanceof Error ? error.message : "Unknown error",
				};
			}
		});
	}, [scenarios, activeLoans, activeCards]);

	useEffect(() => {
		if (debugMode) {
			console.group("Scenario Comparison Debug");
			console.log("Monthly Budget:", monthlyBudget);
			console.log("Total Min Payments:", totalMinPayments);
			console.log("Total Debt:", totalDebt);
			console.log("Active Loans:", activeLoans);
			console.log("Active Cards:", activeCards);
			console.log("Scenarios:", scenarios);
			console.log("Scenario Results:", scenarioResults);
			console.groupEnd();
		}
	}, [
		debugMode,
		monthlyBudget,
		totalMinPayments,
		totalDebt,
		activeLoans,
		activeCards,
		scenarios,
		scenarioResults,
	]);

	const activeScenarioResults = scenarioResults.find(
		(result) => result.id === activeScenarioId
	);

	const comparisonChartData = React.useMemo(() => {
		const maxMonths = Math.max(
			...scenarioResults.map((result) =>
				result.timeline && result.timeline.length > 0
					? result.timeline.length
					: 0
			)
		);

		if (maxMonths === 0) return [];

		const data = [];

		for (let month = 0; month < maxMonths; month += 3) {
			const point: any = { month: month + 1 };

			scenarioResults.forEach((result) => {
				if (result.timeline && month < result.timeline.length) {
					point[`${result.id}_balance`] = result.timeline[month].totalRemaining;
					point[`${result.id}_interest`] =
						result.timeline[month].totalInterestPaid;
				}
			});

			data.push(point);
		}

		return data;
	}, [scenarioResults]);

	const [announcement, setAnnouncement] = useState("");

	const calculateDifference = (scenario: any, baseline: any) => {
		if (
			!scenario ||
			!baseline ||
			scenario.totalMonths === 0 ||
			baseline.totalMonths === 0
		) {
			return null;
		}

		const monthDiff = baseline.totalMonths - scenario.totalMonths;
		const interestDiff =
			baseline.totalInterestPaid - scenario.totalInterestPaid;

		if (monthDiff > 0) {
			return `${monthDiff} ${t("visualization.monthsEarlier")}`;
		} else if (monthDiff < 0) {
			return `${Math.abs(monthDiff)} ${t("visualization.monthsLater")}`;
		} else {
			return t("visualization.sameTime");
		}
	};

	const handleScenarioChange = (scenarioId: string) => {
		setActiveScenarioId(scenarioId);

		const scenario = scenarios.find((s) => s.id === scenarioId);
		const result = scenarioResults.find((r) => r.id === scenarioId);

		if (scenario && result) {
			setAnnouncement(
				`${t("scenarios.selected")} ${scenario.name}. ` +
					`${t("visualization.monthsToPayoff")}: ${result.totalMonths} ${t(
						"visualization.months"
					)}. ` +
					`${t("visualization.totalInterestPaid")}: ${currencyFormatter.format(
						result.totalInterestPaid
					)}.`
			);
		}
	};

	const handleEditScenario = (scenarioId: string) => {
		const scenario = scenarios.find((s) => s.id === scenarioId);
		if (!scenario) return;

		setEditFormData({
			name: scenario.name,
			interestRateAdjustment: scenario.interestRateAdjustment,
			monthlyPayment: scenario.monthlyPayment,
			extraPayment: scenario.extraPayment,
			strategy: scenario.strategy,
		});

		setEditingScenarioId(scenarioId);
	};

	const handleSaveScenario = () => {
		if (!editingScenarioId) return;

		const validatedData = {
			...editFormData,
			interestRateAdjustment: validateValue(
				editFormData.interestRateAdjustment,
				-10,
				10,
				0
			),
			monthlyPayment: validateValue(
				editFormData.monthlyPayment,
				totalMinPayments,
				totalMinPayments * 5,
				totalMinPayments
			),
			extraPayment: validateValue(editFormData.extraPayment, 0, 50000, 0),
		};

		setScenarios((prevScenarios) =>
			prevScenarios.map((scenario) =>
				scenario.id === editingScenarioId
					? { ...scenario, ...validatedData }
					: scenario
			)
		);

		setEditingScenarioId(null);
	};

	const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (
			name === "interestRateAdjustment" ||
			name === "monthlyPayment" ||
			name === "extraPayment"
		) {
			setEditFormData({
				...editFormData,
				[name]: parseFloat(value) || 0,
			});
		} else {
			setEditFormData({
				...editFormData,
				[name]: value,
			});
		}
	};

	const handleStrategyChange = (
		strategy: "avalanche" | "snowball" | "equal"
	) => {
		setEditFormData({
			...editFormData,
			strategy,
		});
	};

	const handleResetScenarios = () => {
		setScenarios(defaultScenarios);
		setActiveScenarioId("current");
		setEditingScenarioId(null);
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-background border rounded-md p-3 shadow-md">
					<p className="font-medium">
						{t("repayment.month")} {label}
					</p>
					{payload.map((entry: any, index: number) => {
						const scenarioId = entry.dataKey.split("_")[0];
						const dataType = entry.dataKey.split("_")[1];
						const scenario = scenarios.find((s) => s.id === scenarioId);

						return (
							<p key={index} style={{ color: entry.color }} className="text-sm">
								{scenario?.name || scenarioId} -{" "}
								{dataType === "balance"
									? t("dashboard.remainingDebt")
									: t("repayment.totalInterestPaid")}
								: {currencyFormatter.format(entry.value)}
							</p>
						);
					})}
				</div>
			);
		}
		return null;
	};

	const [showGuide, setShowGuide] = useState(false);

	const isMobile = useIsMobile();

	const [estimatedMonths, setEstimatedMonths] = useState<number | undefined>(
		undefined
	);
	const [estimatedInterest, setEstimatedInterest] = useState<
		number | undefined
	>(undefined);

	const handleEditFormUpdate = (values: Partial<Scenario>) => {
		const scenario = { ...activeScenario, ...values };
		const { adjustedLoans, adjustedCards } = adjustDebtsForScenario(
			scenario as Scenario
		);
		const combinedDebts = combineDebts(adjustedLoans, adjustedCards);
		const effectiveMonthlyPayment =
			scenario.monthlyPayment! + scenario.extraPayment! / 12;
		const plan = generateRepaymentPlan(
			combinedDebts,
			effectiveMonthlyPayment,
			scenario.strategy! as PrioritizationMethod
		);

		setEstimatedMonths(plan.totalMonths);
		setEstimatedInterest(plan.totalInterestPaid);
	};

	const exportScenarioData = () => {
		const activeResult = scenarioResults.find(
			(result) => result.id === activeScenarioId
		);
		if (!activeResult) return;

		const scenario = scenarios.find((s) => s.id === activeScenarioId);

		const data = {
			scenarioName: scenario?.name,
			totalDebt,
			monthlyPayment: scenario?.monthlyPayment,
			extraPayment: scenario?.extraPayment,
			interestRateAdjustment: scenario?.interestRateAdjustment,
			strategy: scenario?.strategy,
			results: {
				monthsToPayoff: activeResult.totalMonths,
				totalInterestPaid: activeResult.totalInterestPaid,
				timeline: activeResult.timeline,
			},
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `${scenario?.name
			.replace(/\s+/g, "-")
			.toLowerCase()}-scenario.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success(t("dashboard.scenarioExported"));
	};

	const handleShare = () => {
		const shareUrl = `${window.location.origin}/share-scenario?id=${activeScenarioId}`;
		navigator.clipboard.writeText(shareUrl);
		toast.success(t("dashboard.scenarioShared"));
	};

	const handleWhatIfChanges = ({
		extraPayment,
		interestChange,
	}: {
		extraPayment: number;
		interestChange: number;
	}) => {
		const updatedScenario = {
			...scenarios.find((s) => s.id === activeScenarioId)!,
			extraPayment,
			interestRateAdjustment: interestChange,
		};
		setScenarios((prevScenarios) =>
			prevScenarios.map((s) =>
				s.id === activeScenarioId ? updatedScenario : s
			)
		);
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<div className="flex justify-between items-center">
					<div>
						<CardTitle>{t("dashboard.scenarioComparison")}</CardTitle>
						<AlertDescription className="mt-1">
							{t("dashboard.scenarioDescription")}
							<Button
								variant="link"
								className="p-0 h-auto text-xs font-normal ml-1"
								onClick={() => setShowGuide(true)}
							>
								{t("common.learnMore")}
							</Button>
						</AlertDescription>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						aria-label={t("common.close")}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-6">
					<div role="status" aria-live="polite" className="sr-only">
						{announcement}
					</div>

					{totalMinPayments > 0 && (
						<Alert className="bg-muted">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								{t("scenarios.minimumPaymentAlert", {
									payment: currencyFormatter.format(totalMinPayments),
								})}
							</AlertDescription>
						</Alert>
					)}

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{scenarioResults.map((result) => {
							const scenario = scenarios.find((s) => s.id === result.id);

							return (
								<Card
									key={result.id}
									className={`cursor-pointer transition-all ${
										result.id === activeScenarioId ? "ring-2 ring-primary" : ""
									}`}
									onClick={() => handleScenarioChange(result.id)}
									tabIndex={0}
									role="radio"
									aria-checked={result.id === activeScenarioId}
									aria-label={`${t("scenarios.select")} ${scenario?.name}`}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleScenarioChange(result.id);
											e.preventDefault();
										}
									}}
								>
									<CardHeader className="py-3 px-4">
										<div className="flex justify-between items-center">
											<CardTitle className="text-base">
												{scenario?.name}
											</CardTitle>
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													handleEditScenario(result.id);
												}}
											>
												{editingScenarioId === result.id ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</Button>
										</div>
									</CardHeader>

									{editingScenarioId === result.id ? (
										<CardContent className="pt-0">
											<div className="space-y-4">
												<div>
													<label className="text-sm font-medium">
														{t("scenarios.name")}:
													</label>
													<input
														type="text"
														name="name"
														className="w-full mt-1 p-2 border rounded-md text-sm"
														value={editFormData.name}
														onChange={handleEditFormChange}
													/>
												</div>
												<div>
													<label className="text-sm font-medium">
														{t("scenarios.interestRateChange")}:
													</label>
													<input
														type="number"
														name="interestRateAdjustment"
														className="w-full mt-1 p-2 border rounded-md text-sm"
														value={editFormData.interestRateAdjustment}
														onChange={handleEditFormChange}
														step="0.1"
														min="-10"
														max="10"
													/>
												</div>
												<div>
													<label className="text-sm font-medium">
														{t("scenarios.monthlyPayment")}:
													</label>
													<input
														type="number"
														name="monthlyPayment"
														className="w-full mt-1 p-2 border rounded-md text-sm"
														value={editFormData.monthlyPayment}
														onChange={handleEditFormChange}
														min={totalMinPayments}
													/>
												</div>
												<div>
													<label className="text-sm font-medium">
														{t("scenarios.extraPayment")}:
													</label>
													<input
														type="number"
														name="extraPayment"
														className="w-full mt-1 p-2 border rounded-md text-sm"
														value={editFormData.extraPayment}
														onChange={handleEditFormChange}
														min="0"
													/>
													<p className="text-xs text-muted-foreground mt-1">
														{t("scenarios.extraPaymentExplanation")}
													</p>
												</div>
												<div>
													<label className="text-sm font-medium">
														{t("dashboard.method")}:
													</label>
													<div className="grid grid-cols-3 gap-2 mt-1">
														<Button
															size="sm"
															variant={
																editFormData.strategy === "avalanche"
																	? "default"
																	: "outline"
															}
															className="text-xs"
															onClick={() => handleStrategyChange("avalanche")}
														>
															{t("dashboard.avalancheStrategy")}
														</Button>
														<Button
															size="sm"
															variant={
																editFormData.strategy === "snowball"
																	? "default"
																	: "outline"
															}
															className="text-xs"
															onClick={() => handleStrategyChange("snowball")}
														>
															{t("dashboard.snowballStrategy")}
														</Button>
														<Button
															size="sm"
															variant={
																editFormData.strategy === "equal"
																	? "default"
																	: "outline"
															}
															className="text-xs"
															onClick={() => handleStrategyChange("equal")}
														>
															{t("dashboard.equalStrategy")}
														</Button>
													</div>
												</div>
												<div className="flex justify-end space-x-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => setEditingScenarioId(null)}
													>
														{t("common.cancel")}
													</Button>
													<Button size="sm" onClick={handleSaveScenario}>
														{t("common.save")}
													</Button>
												</div>
											</div>
										</CardContent>
									) : (
										<CardContent className="pt-0 pb-4">
											<div className="space-y-2">
												<div className="flex justify-between items-center">
													<span className="text-sm text-muted-foreground">
														{t("scenarios.monthsToPayoff") ||
															"Months to payoff"}
													</span>
													<span className="font-medium">
														{result.error ? (
															<span className="text-destructive">
																{result.error === "insufficient-payment"
																	? t("scenarios.insufficientPayment") ||
																	  "Insufficient payment"
																	: t("scenarios.calculationError") ||
																	  "Calculation error"}
															</span>
														) : (
															`${result.totalMonths || 0} ${
																t("common.months") || "months"
															}`
														)}
													</span>
												</div>

												<div className="flex justify-between items-center">
													<span className="text-sm text-muted-foreground">
														{t("scenarios.totalInterest") ||
															"Total interest paid"}
													</span>
													<span className="font-medium">
														{result.error
															? "-"
															: currencyFormatter.format(
																	result.totalInterestPaid || 0
															  )}
													</span>
												</div>

												{result.error === "insufficient-payment" && (
													<div className="mt-2 text-xs text-destructive">
														<AlertCircle className="h-3 w-3 inline mr-1" />
														{t("scenarios.increasePayment") ||
															"Increase monthly payment to create a viable plan"}
													</div>
												)}

												{result.error === "calculation-error" && (
													<div className="mt-2 text-xs text-destructive">
														<AlertCircle className="h-3 w-3 inline mr-1" />
														{t("scenarios.tryDifferentParameters") ||
															"Try different parameters"}
													</div>
												)}

												{!result.error &&
													result.isViable &&
													result.id !== "current" && (
														<div className="mt-2 text-xs text-muted-foreground">
															<span
																className={
																	result.totalMonths <
																	(scenarioResults.find(
																		(r) => r.id === "current"
																	)?.totalMonths || 0)
																		? "text-green-600"
																		: "text-destructive"
																}
															>
																{calculateDifference(
																	result,
																	scenarioResults.find(
																		(r) => r.id === "current"
																	)
																)}
															</span>
														</div>
													)}
											</div>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2">
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={comparisonChartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									{scenarioResults.map((result) => {
										if (!result.timeline || result.timeline.length === 0)
											return null;

										return (
											<React.Fragment key={result.id}>
												<Line
													type="monotone"
													dataKey={`${result.id}_balance`}
													stroke={
														result.id === "current"
															? "#8884d8"
															: result.id === "optimistic"
															? "#82ca9d"
															: "#ffc658"
													}
													name={`${
														scenarios.find((s) => s.id === result.id)?.name
													} - ${t("dashboard.remainingDebt")}`}
													activeDot={{ r: 8 }}
												/>
												<Line
													type="monotone"
													dataKey={`${result.id}_interest`}
													stroke={
														result.id === "current"
															? "#ff7373"
															: result.id === "optimistic"
															? "#47A1D6"
															: "#ff9e40"
													}
													name={`${
														scenarios.find((s) => s.id === result.id)?.name
													} - ${t("repayment.totalInterestPaid")}`}
													strokeDasharray="5 5"
												/>
											</React.Fragment>
										);
									})}
								</LineChart>
							</ResponsiveContainer>

							{activeScenarioResults &&
								activeScenarioResults.timeline &&
								activeScenarioResults.timeline.length > 0 && (
									<MilestoneVisualization
										timeline={activeScenarioResults.timeline}
										totalDebt={totalDebt}
									/>
								)}
						</div>
						<div>
							<ScenarioEditor
								totalMinPayments={totalMinPayments}
								onUpdate={handleEditFormUpdate}
								estimatedMonths={estimatedMonths}
								estimatedInterest={estimatedInterest}
							/>
							<WhatIfAnalysis onApply={handleWhatIfChanges} />
						</div>
					</div>
				</div>

				{process.env.NODE_ENV === "development" && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setDebugMode(!debugMode)}
						className="absolute bottom-2 right-2 text-xs"
					>
						{debugMode ? "Disable Debug" : "Enable Debug"}
					</Button>
				)}
			</CardContent>
			<CardFooter className="pt-6">
				<div className="flex justify-between w-full">
					<Button variant="outline" size="sm" onClick={handleResetScenarios}>
						{t("common.reset")}
					</Button>

					<div className="flex gap-4">
						<Button
							variant="outline"
							size="sm"
							onClick={exportScenarioData}
							className="flex items-center"
							disabled={!activeScenarioResults || !!activeScenarioResults.error}
						>
							<Download className="h-4 w-4 mr-2" />
							{t("dashboard.exportScenario")}
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={handleShare}
							className="flex items-center"
							disabled={!activeScenarioResults || !!activeScenarioResults.error}
						>
							<Share className="h-4 w-4 mr-2" />
							{t("dashboard.shareScenario")}
						</Button>
					</div>
				</div>
			</CardFooter>

			{showGuide && (
				<ScenarioGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
			)}
		</Card>
	);
};

export default ScenarioComparisonTool;
