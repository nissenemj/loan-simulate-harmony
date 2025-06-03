import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/loanCalculations";
import { useNavigate } from "react-router-dom";

interface PaymentPlanSummaryProps {
	monthlyBudget: number;
	totalMinPayments: number;
	extraBudget: number;
	highestInterestDebt: {
		name: string;
		rate: number;
	};
}

const PaymentPlanSummary = ({
	monthlyBudget,
	totalMinPayments,
	extraBudget,
	highestInterestDebt,
}: PaymentPlanSummaryProps) => {
	const { t } = useLanguage();
	const navigate = useNavigate();

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center flex-wrap gap-2">
					<PiggyBank className="h-5 w-5 text-primary flex-shrink-0" />
					<span className="break-words">
						{t("dashboard.paymentPlanSummary")}
					</span>
				</CardTitle>
				<CardDescription className="break-words">
					{t("dashboard.paymentPlanDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 min-h-[80px] flex flex-col justify-between">
						<h4 className="text-xs sm:text-sm font-medium text-muted-foreground break-words">
							{t("dashboard.monthlyBudget")}
						</h4>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold break-all">
							{formatCurrency(monthlyBudget)}
						</p>
					</div>

					<div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 min-h-[80px] flex flex-col justify-between">
						<h4 className="text-xs sm:text-sm font-medium text-muted-foreground break-words">
							{t("dashboard.minimumPayments")}
						</h4>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold break-all">
							{formatCurrency(totalMinPayments)}
						</p>
					</div>

					<div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 min-h-[80px] flex flex-col justify-between">
						<h4 className="text-xs sm:text-sm font-medium text-muted-foreground break-words">
							{t("dashboard.extraBudget")}
						</h4>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-500 break-all">
							{formatCurrency(extraBudget)}
						</p>
					</div>
				</div>

				{highestInterestDebt.name && (
					<div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
						<h4 className="flex items-center text-primary font-medium">
							<TrendingUp className="mr-2 h-4 w-4" />
							{t("dashboard.prioritizedDebt")}
						</h4>
						<p className="mt-1">
							<span className="font-medium">{highestInterestDebt.name}</span> -{" "}
							{highestInterestDebt.rate.toFixed(2)}%{" "}
							{t("dashboard.interestRate")}
						</p>
						{extraBudget > 0 && (
							<p className="text-sm mt-2">
								{t("dashboard.allocatingExtra", {
									amount: formatCurrency(extraBudget),
								})}
							</p>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button
					variant="outline"
					onClick={() => navigate("/debt-summary?tab=repayment-plan")}
				>
					{t("dashboard.viewFullPlan")}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PaymentPlanSummary;
