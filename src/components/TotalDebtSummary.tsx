
import React from "react";
import { Loan, calculateLoan, formatCurrency } from "@/utils/loanCalculations";
import {
	CreditCard,
	calculateCreditCard,
} from "@/utils/creditCardCalculations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertCircle,
	DollarSign,
	Percent,
	Calendar,
	CreditCard as CreditCardIcon,
	Calculator,
} from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import { cn } from "@/lib/utils";

interface TotalDebtSummaryProps {
	loans: Loan[];
	creditCards: CreditCard[];
	isDemo?: boolean;
	totalDebtBalance?: number;
}

export default function TotalDebtSummary({
	loans,
	creditCards,
	isDemo = false,
	totalDebtBalance,
}: TotalDebtSummaryProps) {
	// Calculate loan totals
	let totalLoanMonthlyPayment = 0;
	let totalLoanMonthlyInterest = 0;
	let totalLoanInterestEstimate = 0;
	let totalLoanMonthlyFee = 0;
	let totalLoanAmountPaid = 0;

	loans.forEach((loan) => {
		const calculation = calculateLoan(loan);
		totalLoanMonthlyPayment += calculation.monthlyPayment;
		totalLoanMonthlyInterest += calculation.interest;
		totalLoanInterestEstimate += calculation.totalInterest;
		totalLoanAmountPaid += calculation.totalAmountPaid;

		// Add monthly fee if present
		if (loan.monthlyFee) {
			totalLoanMonthlyFee += loan.monthlyFee;
		}
	});

	// Calculate credit card totals
	let totalCardMonthlyPayment = 0;
	let totalCardMonthlyInterest = 0;
	let totalCardInterestEstimate = 0;
	let hasInfiniteInterest = false;

	creditCards.forEach((card) => {
		const calculation = calculateCreditCard(card);
		totalCardMonthlyPayment += calculation.effectivePayment;
		totalCardMonthlyInterest += calculation.monthlyInterest;

		if (calculation.totalInterest === Infinity) {
			hasInfiniteInterest = true;
		} else {
			totalCardInterestEstimate += calculation.totalInterest;
		}
	});

	// Calculate total sums
	const totalMonthlyPayment = totalLoanMonthlyPayment + totalCardMonthlyPayment;
	const totalMonthlyInterest =
		totalLoanMonthlyInterest + totalCardMonthlyInterest;
	const totalInterestEstimate = hasInfiniteInterest
		? Infinity
		: totalLoanInterestEstimate + totalCardInterestEstimate;

	// For total balance, either use the provided value or calculate
	const totalBalance =
		totalDebtBalance ??
		loans.reduce((sum, loan) => sum + loan.amount, 0) +
			creditCards.reduce((sum, card) => sum + card.balance, 0);

	// Calculate total amount to be paid (principal + interest)
	const totalAmountPaid = hasInfiniteInterest
		? Infinity
		: totalLoanAmountPaid +
		  (totalBalance - loans.reduce((sum, loan) => sum + loan.amount, 0)) +
		  totalCardInterestEstimate;

	return (
		<Card className="overflow-hidden shadow-md border-border">
			{isDemo && (
				<div className="bg-amber-50 border-b border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 p-3 flex items-center gap-2 text-amber-800 dark:text-amber-300">
					<AlertCircle size={16} />
					<p className="text-sm font-medium">
						Tämä on esimerkkitietoja - muokkaa omilla tiedoillasi
					</p>
				</div>
			)}

			<CardHeader className="pb-2">
				<CardTitle className="text-xl font-semibold flex items-center gap-2">
					<DollarSign className="h-5 w-5 text-primary" />
					Velkojen yhteenveto
				</CardTitle>
			</CardHeader>

			<CardContent className="p-4 sm:p-6">
				<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					<DebtMetricCard
						title="Kuukausittaiset maksut yhteensä"
						value={totalMonthlyPayment}
						icon={<Calendar className="h-5 w-5 text-primary" />}
						note={
							totalLoanMonthlyFee > 0
								? "Sisältää kulut: " + formatCurrency(totalLoanMonthlyFee)
								: undefined
						}
					/>

					<DebtMetricCard
						title="Kuukausittaiset korot"
						value={totalMonthlyInterest}
						icon={<Percent className="h-5 w-5 text-primary" />}
					/>

					<DebtMetricCard
						title="Korot elinaikana yhteensä"
						value={totalInterestEstimate}
						icon={<Calendar className="h-5 w-5 text-primary" />}
						isInfinite={totalInterestEstimate === Infinity}
						infiniteText="Ei koskaan maksettu pois"
					/>

					<DebtMetricCard
						title="Velkasaldo yhteensä"
						value={totalBalance}
						icon={<CreditCardIcon className="h-5 w-5 text-primary" />}
					/>

					<DebtMetricCard
						title="Maksettu yhteensä"
						value={totalAmountPaid}
						icon={<Calculator className="h-5 w-5 text-primary" />}
						isInfinite={totalAmountPaid === Infinity}
						infiniteText="Ei koskaan maksettu pois"
						note="Sisältää korot ja kulut"
					/>
				</div>

				<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg text-muted-foreground text-xs sm:text-sm">
					<p className="break-words">Tämä yhteenveto näyttää nykyisen velkatilanteesi kokonaiskuvan. Luvut perustuvat syöttämiisi tietoihin ja nykyisiin maksuehtoihin.</p>
				</div>
			</CardContent>
		</Card>
	);
}

interface DebtMetricCardProps {
	title: string;
	value: number | string;
	icon?: React.ReactNode;
	note?: string;
	isInfinite?: boolean;
	infiniteText?: string;
	className?: string;
}

function DebtMetricCard({
	title,
	value,
	icon,
	note,
	isInfinite = false,
	infiniteText = "∞",
	className,
}: DebtMetricCardProps) {
	return (
		<div
			className={cn(
				"space-y-2 p-3 sm:p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors min-h-[100px] flex flex-col justify-between",
				className
			)}
		>
			<div className="flex items-center gap-2 flex-wrap">
				{icon && <div className="flex-shrink-0">{icon}</div>}
				<h3 className="text-xs sm:text-sm font-medium text-muted-foreground break-words min-w-0 flex-1">
					{title}
				</h3>
			</div>

			<div className="text-lg sm:text-xl lg:text-2xl font-bold min-h-[40px] flex items-center">
				{isInfinite ? (
					<div className="text-destructive w-full flex items-center break-all">
						{infiniteText}
					</div>
				) : (
					<div className="w-full flex items-center break-all">
						<AnimatedNumber
							value={typeof value === "number" ? value : 0}
							formatter={formatCurrency}
						/>
					</div>
				)}
			</div>

			{note && (
				<p className="text-xs text-muted-foreground break-words">{note}</p>
			)}
		</div>
	);
}
