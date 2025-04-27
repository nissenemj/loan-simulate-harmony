import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/loanCalculations";
import { Loan } from "@/utils/loanCalculations";
import { CreditCard } from "@/utils/creditCardCalculations";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DebtFreeTimelineProps {
  totalDebt: number;
  formattedDebtFreeDate: string;
  activeLoans: Loan[];
  activeCards: CreditCard[];
  monthlyBudget: number;
}

const DebtFreeTimeline = ({
  totalDebt,
  formattedDebtFreeDate,
  activeLoans,
  activeCards,
  monthlyBudget,
}: DebtFreeTimelineProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Calculate estimated months to debt freedom
  const calculateMonthsToDebtFreedom = () => {
    if (totalDebt <= 0 || monthlyBudget <= 0) {
      return 0;
    }
    
    // Simple calculation (doesn't account for interest)
    return Math.ceil(totalDebt / monthlyBudget);
  };

  const monthsToDebtFreedom = calculateMonthsToDebtFreedom();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("dashboard.debtFreeTimeline")}</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/debt-strategies")}
        >
          {t("dashboard.optimizeStrategy")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.estimatedDebtFreeDate")}
              </p>
              <h3 className="text-2xl font-bold">{formattedDebtFreeDate}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {monthsToDebtFreedom > 0
                  ? t("dashboard.monthsToDebtFreedom", {
                      count: monthsToDebtFreedom,
                    })
                  : t("dashboard.alreadyDebtFree")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex justify-between gap-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.totalDebt")}:
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(totalDebt)}
              </p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.monthlyBudget")}:
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(monthlyBudget)}
              </p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.numberOfDebts")}:
              </p>
              <p className="text-sm font-medium">
                {activeLoans.length + activeCards.length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtFreeTimeline;
