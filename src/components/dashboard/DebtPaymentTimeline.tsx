
import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/loanCalculations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DebtPaymentTimelineProps {
	totalDebt: number;
	totalAmountToPay: number;
	debtFreeDate: string;
}

const DebtPaymentTimeline = ({
	totalDebt,
	totalAmountToPay,
	debtFreeDate,
}: DebtPaymentTimelineProps) => {
	const navigate = useNavigate();

	const generateTimelineData = () => {
		// Generate some default data even if we don't have all the inputs
		// This ensures the chart always shows something
		const defaultMonths = 24; // 2 years as default timeline

		// Use totalDebt or a default value
		const debt = totalDebt || 10000;

		// Use totalAmountToPay or calculate a default (debt + 20% interest)
		const amountToPay = totalAmountToPay || debt * 1.2;

		// Parse the debt free date or use a default (2 years from now)
		let endDate;
		try {
			endDate = debtFreeDate ? new Date(debtFreeDate) : new Date();
			if (isNaN(endDate.getTime())) {
				console.warn("Invalid debt free date:", debtFreeDate);
				endDate = new Date();
				endDate.setFullYear(endDate.getFullYear() + 2);
			}
		} catch (e) {
			console.warn("Error parsing debt free date:", e);
			endDate = new Date();
			endDate.setFullYear(endDate.getFullYear() + 2);
		}

		const startDate = new Date();

		// Calculate months difference or use default
		const monthsDiff = Math.max(
			1,
			debtFreeDate
				? (endDate.getFullYear() - startDate.getFullYear()) * 12 +
						(endDate.getMonth() - startDate.getMonth())
				: defaultMonths
		);

		const monthlyReduction = debt / Math.max(1, monthsDiff);
		const totalInterest = amountToPay - debt;
		const monthlyInterest = totalInterest / Math.max(1, monthsDiff);

		// Generate the timeline data - limit to 24 data points for readability
		const dataPoints = Math.min(monthsDiff, 24);
		const interval = Math.max(1, Math.floor(monthsDiff / dataPoints));

		return Array.from({ length: dataPoints }, (_, index) => {
			const month = index * interval;
			return {
				month,
				// For principal, we show the remaining principal balance
				principal: Math.max(0, debt - monthlyReduction * month),
				// For interest, we track the cumulative interest paid
				interest: monthlyInterest * month,
				// Add a formatted month label for the x-axis
				monthLabel:
					month === 0
						? "Alku"
						: `${month} kk`,
			};
		});
	};

	const data = generateTimelineData();

	return (
		<Card className="w-full h-full min-h-[350px] flex flex-col">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
				<div className="min-w-0 flex-1">
					<CardTitle className="break-words text-base sm:text-lg">
						Maksuaikataulu
					</CardTitle>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="flex-shrink-0 w-full sm:w-auto"
					onClick={() => navigate("/debt-summary?tab=repayment-plan")}
				>
					<span className="truncate">Näytä takaisinmaksusuunnitelma</span>
					<ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
				</Button>
			</CardHeader>
			<CardContent className="flex-1 p-4">
				{data.length === 0 ? (
					<div className="flex items-center justify-center h-[200px]">
						<p className="text-muted-foreground text-center break-words">
							Ei tietoja saatavilla
						</p>
					</div>
				) : (
					<div className="w-full h-[250px] min-h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart
								data={data}
								margin={{
									top: 10,
									right: 10,
									left: 10,
									bottom: 40,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" opacity={0.6} />
								<XAxis
									dataKey="monthLabel"
									tick={{ fontSize: 10 }}
									angle={-45}
									textAnchor="end"
									height={50}
									interval="preserveStartEnd"
								/>
								<YAxis
									tickFormatter={(value) => formatCurrency(value)}
									width={60}
									tick={{ fontSize: 10 }}
								/>
								<Tooltip
									formatter={(value: number) => formatCurrency(value)}
									labelFormatter={(label) => label}
									contentStyle={{
										backgroundColor: "rgba(255, 255, 255, 0.95)",
										borderRadius: "8px",
										boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
										fontSize: "12px",
									}}
								/>
								<Legend
									wrapperStyle={{
										paddingTop: 10,
										fontSize: "12px",
									}}
								/>
								<Area
									type="monotone"
									dataKey="principal"
									stroke="#0088FE"
									fill="#0088FE"
									fillOpacity={0.6}
									name="Pääoman maksu"
									strokeWidth={2}
								/>
								<Area
									type="monotone"
									dataKey="interest"
									stroke="#FF8042"
									fill="#FF8042"
									fillOpacity={0.6}
									name="Koronmaksu"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default DebtPaymentTimeline;
