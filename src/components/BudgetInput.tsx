
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { PrioritizationMethod } from "@/utils/repayment";
interface BudgetInputProps {
  onCalculate: (budget: number, method: PrioritizationMethod) => void;
  className?: string;
  defaultBudget?: number;
  method?: PrioritizationMethod;
}
const BudgetInput: React.FC<BudgetInputProps> = ({
  onCalculate,
  className,
  defaultBudget = 500,
  method: initialMethod = 'avalanche'
}) => {
  const {
    t
  } = useLanguage();
  const [budget, setBudget] = useState<number>(defaultBudget);
  const [method, setMethod] = useState<PrioritizationMethod>(initialMethod);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(budget, method);
  };
  return <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg gap-2">
          <PiggyBank className="h-5 w-5" />
          {t("repayment.budgetTitle")}
        </CardTitle>
        <CardDescription>
          {t("repayment.budgetDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">{t("repayment.monthlyBudget")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input id="budget" type="number" min="0" step="10" className="pl-8" value={budget} onChange={e => setBudget(parseFloat(e.target.value) || 0)} placeholder="500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">{t("repayment.prioritizationMethod")}</Label>
            <Select value={method} onValueChange={value => setMethod(value as PrioritizationMethod)}>
              <SelectTrigger>
                <SelectValue placeholder={t("repayment.selectMethod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avalanche">{t("repayment.avalancheMethod")}</SelectItem>
                <SelectItem value="snowball">{t("repayment.snowballMethod")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {method === 'avalanche' ? t("repayment.avalancheDescription") : t("repayment.snowballDescription")}
            </p>
          </div>
          
          <Button type="submit" size="sm" className="w-full mt-2 font-extralight whitespace-normal py-3 h-auto flex items-center justify-center">
            <Calculator className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="text-center inline-block w-full">{t("repayment.calculatePlan")}</span>
          </Button>
        </form>
      </CardContent>
    </Card>;
};
export default BudgetInput;
