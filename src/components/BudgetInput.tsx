
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PrioritizationMethod } from '@/utils/repayment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalculatorIcon, TrendingUp, CoinsIcon } from 'lucide-react';

interface BudgetInputProps {
  onCalculate: (budget: number, method: PrioritizationMethod) => void;
  defaultBudget?: number;
  method?: PrioritizationMethod;
}

const BudgetInput: React.FC<BudgetInputProps> = ({ 
  onCalculate, 
  defaultBudget = 500,
  method = 'avalanche'
}) => {
  const { t } = useLanguage();
  const [budget, setBudget] = useState<number | string>(defaultBudget);
  const [prioritization, setPrioritization] = useState<PrioritizationMethod>(method);

  const handleCalculate = () => {
    if (typeof budget === 'string') {
      const parsedBudget = parseFloat(budget);
      if (!isNaN(parsedBudget) && parsedBudget > 0) {
        onCalculate(parsedBudget, prioritization);
      }
    } else if (budget > 0) {
      onCalculate(budget, prioritization);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-5 w-5 text-primary" />
          {t("repayment.title")}
        </CardTitle>
        <CardDescription>
          {t("repayment.enterBudgetPrompt")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">{t("repayment.budget")}</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="pl-8"
              placeholder={t("repayment.budgetPlaceholder")}
              min="0"
              step="10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("repayment.strategy")}</Label>
          <RadioGroup 
            value={prioritization} 
            onValueChange={(value) => setPrioritization(value as PrioritizationMethod)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="avalanche" id="avalanche" />
              <Label htmlFor="avalanche" className="flex flex-col cursor-pointer">
                <span className="font-medium">{t("repayment.highestInterestFirst")}</span>
                <span className="text-xs text-muted-foreground">{t("repayment.highestInterestDesc")}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="snowball" id="snowball" />
              <Label htmlFor="snowball" className="flex flex-col cursor-pointer">
                <span className="font-medium">{t("repayment.lowestBalanceFirst")}</span>
                <span className="text-xs text-muted-foreground">{t("repayment.lowestBalanceDesc")}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full">
          <CalculatorIcon className="mr-2 h-4 w-4" />
          {t("repayment.calculateNow")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetInput;
