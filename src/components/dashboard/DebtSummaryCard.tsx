
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/utils/loanCalculations";
import { CreditCard, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import DebtBreakdownPie from "./DebtBreakdownPie";

interface DebtSummaryCardProps {
	totalDebt: number;
	debtFreeDate: string;
	totalMinPayments: number;
	totalAmountToPay: number;
}

const DebtSummaryCard = ({
	totalDebt,
	debtFreeDate,
	totalMinPayments,
	totalAmountToPay,
}: DebtSummaryCardProps) => {
	const navigate = useNavigate();

	// Format currency values
	const formattedTotalDebt = formatCurrency(totalDebt);
	const formattedMinPayments = formatCurrency(totalMinPayments);
	const formattedTotalPay = formatCurrency(totalAmountToPay);

	// Calculate interest cost
	const interestCost = totalAmountToPay - totalDebt;
	const formattedInterestCost = formatCurrency(interestCost);

	return (
		<div className="space-y-6">
			<Card className="w-full">
				<CardContent className="p-4 sm:p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
						<div className="flex flex-col min-h-[120px] justify-between">
							<div className="flex items-center space-x-2 flex-wrap">
								<DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-muted-foreground font-medium text-sm sm:text-base break-words">
									Kokonaisvelka
								</span>
								<HelpTooltip content="Kaikkien aktiivisten velkojesi yhteenlaskettu määrä" />
							</div>
							<span className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 break-all">
								{formattedTotalDebt}
							</span>
							<div className="flex mt-2 items-start flex-col sm:flex-row sm:items-center sm:space-x-2">
								<span className="text-xs sm:text-sm text-muted-foreground break-words">
									Arvioitu korkokustannus:
								</span>
								<span className="text-xs sm:text-sm font-medium break-all">
									{formattedInterestCost}
								</span>
								<HelpTooltip content="Kokonaissumma, jonka maksat korkoja nykyisillä ehdoilla" />
							</div>
						</div>

						<div className="flex flex-col min-h-[120px] justify-between">
							<div className="flex items-center space-x-2 flex-wrap">
								<Calendar className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-muted-foreground font-medium text-sm sm:text-base break-words">
									Arvioitu velaton päivämäärä
								</span>
								<HelpTooltip content="Arvioitu päivämäärä, jolloin olet velaton nykyisillä maksuilla" />
							</div>
							<span className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 break-words">
								{debtFreeDate || "Ei laskettu"}
							</span>
							<div className="flex mt-2 items-start flex-col sm:flex-row sm:items-center sm:space-x-2">
								<span className="text-xs sm:text-sm text-muted-foreground break-words">
									Maksettava yhteensä:
								</span>
								<span className="text-xs sm:text-sm font-medium break-all">
									{formattedTotalPay}
								</span>
								<HelpTooltip content="Kokonaissumma, jonka maksat (pääoma + korot)" />
							</div>
						</div>

						<div className="flex flex-col min-h-[120px] justify-between">
							<div className="flex items-center space-x-2 flex-wrap">
								<CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-muted-foreground font-medium text-sm sm:text-base break-words">
									Kuukausittaiset vähimmäismaksut
								</span>
								<HelpTooltip content="Kaikkien velkojesi vähimmäismaksujen summa kuukaudessa" />
							</div>
							<span className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 break-all">
								{formattedMinPayments}
							</span>
							<div className="flex mt-2 items-start flex-col sm:flex-row sm:items-center sm:space-x-2">
								<span className="text-xs sm:text-sm text-muted-foreground break-words">
									kuukaudessa
								</span>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="pb-6 px-6 pt-0">
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={() => navigate("/debt-summary")}
					>
						Näytä yksityiskohtainen erittely
					</Button>
				</CardFooter>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<DebtBreakdownPie
					totalDebt={totalDebt}
					totalMinPayments={totalMinPayments}
					totalAmountToPay={totalAmountToPay}
				/>
			</div>
		</div>
	);
};

export default DebtSummaryCard;
