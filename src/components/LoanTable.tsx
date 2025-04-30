import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Loan,
	calculateLoan,
	formatCurrency,
	formatPercentage,
} from "@/utils/loanCalculations";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowDown, ArrowUp, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedNumber from "./AnimatedNumber";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoanTableProps {
	loans: Loan[];
	onToggleLoan: (id: string) => void;
	onEditLoan?: (loan: Loan) => void;
	highestTotalInterestId?: string;
}

type SortField = "interestRate" | "totalInterest" | "monthlyPayment";
type SortDirection = "asc" | "desc";

const LoanTable: React.FC<LoanTableProps> = ({
	loans,
	onToggleLoan,
	onEditLoan,
	highestTotalInterestId,
}) => {
	const { t } = useLanguage();
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("desc");
		}
	};

	const getSortedLoans = () => {
		if (!sortField) return loans;

		return [...loans].sort((a, b) => {
			const resultA = calculateLoan(a);
			const resultB = calculateLoan(b);

			let valueA: number;
			let valueB: number;

			switch (sortField) {
				case "interestRate":
					valueA = a.interestRate;
					valueB = b.interestRate;
					break;
				case "totalInterest":
					valueA = resultA.totalInterest;
					valueB = resultB.totalInterest;
					break;
				case "monthlyPayment":
					valueA = resultA.monthlyPayment;
					valueB = resultB.monthlyPayment;
					break;
				default:
					return 0;
			}

			return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
		});
	};

	const sortedLoans = getSortedLoans();

	const getRepaymentTypeLabel = (type: string): string => {
		switch (type) {
			case "annuity":
				return t("loan.types.annuity");
			case "equal-principal":
				return t("loan.types.equalPrincipal");
			case "fixed-installment":
				return t("loan.types.fixedInstallment");
			case "custom-payment":
				return t("loan.types.customPayment");
			default:
				return type;
		}
	};

	if (loans.length === 0) {
		return (
			<div className="mt-6 text-center p-8 bg-white/80 velkavapaus-card">
				<p className="text-primary font-medium">{t("loan.table.noLoans")}</p>
			</div>
		);
	}

	return (
		<div className="mt-6 velkavapaus-card overflow-hidden">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-secondary/50">
							<TableHead>{t("loan.table.name")}</TableHead>
							<TableHead
								className="cursor-pointer hover:bg-secondary/80 transition-colors"
								onClick={() => handleSort("monthlyPayment")}
							>
								<div className="flex items-center gap-1">
									{t("loan.table.monthlyPayment")}
									{sortField === "monthlyPayment" &&
										(sortDirection === "asc" ? (
											<ArrowUp size={14} />
										) : (
											<ArrowDown size={14} />
										))}
								</div>
							</TableHead>
							<TableHead
								className="cursor-pointer hover:bg-secondary/80 transition-colors"
								onClick={() => handleSort("interestRate")}
							>
								<div className="flex items-center gap-1">
									{t("loan.table.interestRate")}
									{sortField === "interestRate" &&
										(sortDirection === "asc" ? (
											<ArrowUp size={14} />
										) : (
											<ArrowDown size={14} />
										))}
								</div>
							</TableHead>
							<TableHead
								className="cursor-pointer hover:bg-secondary/80 transition-colors"
								onClick={() => handleSort("totalInterest")}
							>
								<div className="flex items-center gap-1">
									{t("loan.table.totalInterest")}
									{sortField === "totalInterest" &&
										(sortDirection === "asc" ? (
											<ArrowUp size={14} />
										) : (
											<ArrowDown size={14} />
										))}
								</div>
							</TableHead>
							<TableHead>{t("loan.table.term")}</TableHead>
							<TableHead>{t("repayment.repaymentType")}</TableHead>
							<TableHead>{t("form.monthlyFee")}</TableHead>
							<TableHead className="text-right">
								{t("debtSummary.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedLoans.map((loan) => {
							const result = calculateLoan(loan);
							const isHighestInterest =
								loan.id === highestTotalInterestId && loan.isActive;

							return (
								<TableRow
									key={loan.id}
									className={cn(
										"transition-all duration-500 animate-fade-in",
										!loan.isActive && "opacity-50 bg-muted/30",
										isHighestInterest && "bg-primary/5"
									)}
								>
									<TableCell className="font-medium relative py-4">
										{loan.name}
										{isHighestInterest && (
											<div className="absolute -left-1 top-1/2 -translate-y-1/2 text-primary ml-1">
												<AlertCircle size={15} className="animate-pulse" />
											</div>
										)}
										{loan.interestType === "variable-euribor" && (
											<Badge
												variant="outline"
												className="ml-2 bg-secondary/50 text-xs"
											>
												Euribor
											</Badge>
										)}
									</TableCell>
									<TableCell>
										<AnimatedNumber
											value={result.monthlyPayment}
											formatter={(val) => formatCurrency(val)}
										/>
									</TableCell>
									<TableCell>
										<AnimatedNumber
											value={loan.interestRate}
											formatter={(val) => formatPercentage(val)}
										/>
									</TableCell>
									<TableCell>
										<AnimatedNumber
											value={result.totalInterest}
											formatter={(val) => formatCurrency(val)}
											className={
												isHighestInterest ? "text-primary font-medium" : ""
											}
										/>
									</TableCell>
									<TableCell>
										{loan.termYears}{" "}
										{loan.termYears === 1 ? t("table.year") : t("table.years")}
									</TableCell>
									<TableCell>
										{getRepaymentTypeLabel(loan.repaymentType)}
									</TableCell>
									<TableCell>
										{loan.monthlyFee ? (
											<AnimatedNumber
												value={loan.monthlyFee}
												formatter={(val) => formatCurrency(val)}
											/>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell className="text-right flex justify-end items-center gap-2">
										{onEditLoan && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onEditLoan(loan)}
												className="h-8 w-8"
											>
												<Edit size={16} className="text-muted-foreground" />
											</Button>
										)}
										<Switch
											checked={loan.isActive}
											onCheckedChange={() => onToggleLoan(loan.id)}
											className="data-[state=checked]:bg-primary"
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default LoanTable;
