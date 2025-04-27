
import React, { useState } from 'react';
import { PrioritizationMethod } from '@/utils/repayment/types';  // Updated import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface BudgetInputProps {
  onCalculate: (budget: number, method: PrioritizationMethod) => void;
  defaultBudget?: number;
  method: PrioritizationMethod;
}

const BudgetInput: React.FC<BudgetInputProps> = ({ onCalculate, defaultBudget = 1000, method }) => {
  const [budget, setBudget] = useState<number>(defaultBudget);
  const [strategy, setStrategy] = useState<PrioritizationMethod>(method);
  const { t } = useLanguage();

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = Number(e.target.value);
    setBudget(newBudget);
  };

  const handleStrategyChange = (value: PrioritizationMethod) => {
    setStrategy(value);
  };

  const handleSubmit = () => {
    onCalculate(budget, strategy);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="monthly-budget">{t('debtStrategies.monthlyBudget')}</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
          <Input
            type="number"
            id="monthly-budget"
            placeholder="1000"
            value={budget}
            onChange={handleBudgetChange}
            className="pl-8 h-12 md:h-11"
            min="100"
            step="100"
          />
        </div>
      </div>

      <div>
        <Label>{t('debtStrategies.paymentMethod')}</Label>
        <RadioGroup defaultValue={strategy} className="flex flex-col space-y-1.5" onValueChange={handleStrategyChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="avalanche" id="avalanche" className="h-5 w-5" />
            <Label htmlFor="avalanche">{t('debtStrategies.avalancheMethod')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="snowball" id="snowball" className="h-5 w-5" />
            <Label htmlFor="snowball">{t('debtStrategies.snowballMethod')}</Label>
          </div>
        </RadioGroup>
      </div>

      <Button onClick={handleSubmit} className="w-full h-12 md:h-11">
        {t('debtStrategies.updateCalculation')}
      </Button>
    </div>
  );
};

export default BudgetInput;
