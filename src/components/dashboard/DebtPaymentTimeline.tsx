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
import { useLanguage } from "@/contexts/LanguageContext";
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
	const { t } = useLanguage();
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
						? t("visualization.start")
						: `${month} ${t("visualization.months")}`,
			};
		});
	};

	const data = generateTimelineData();

	return (
		<Card className="w-full h-[350px]">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>{t("visualization.paymentTimeline")}</CardTitle>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => navigate("/debt-summary?tab=repayment-plan")}
				>
					{t("dashboard.viewRepaymentPlan")}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="flex items-center justify-center h-[200px]">
						<p className="text-muted-foreground">
							{t("visualization.noDataAvailable")}
						</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={250}>
						<AreaChart
							data={data}
							margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.6} />
							<XAxis
								dataKey="monthLabel"
								tick={{ fontSize: 12 }}
								angle={-45}
								textAnchor="end"
								height={60}
							/>
							<YAxis
								tickFormatter={(value) => formatCurrency(value)}
								width={80}
								tick={{ fontSize: 12 }}
							/>
							<Tooltip
								formatter={(value: number) => formatCurrency(value)}
								labelFormatter={(label) => label}
								contentStyle={{
									backgroundColor: "rgba(255, 255, 255, 0.9)",
									borderRadius: "8px",
									boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Legend wrapperStyle={{ paddingTop: 20 }} />
							<Area
								type="monotone"
								dataKey="principal"
								stroke="#0088FE"
								fill="#0088FE"
								fillOpacity={0.6}
								name={t("visualization.principalPayment")}
								strokeWidth={2}
							/>
							<Area
								type="monotone"
								dataKey="interest"
								stroke="#FF8042"
								fill="#FF8042"
								fillOpacity={0.6}
								name={t("visualization.interestPayment")}
								strokeWidth={2}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};

export default DebtPaymentTimeline;
