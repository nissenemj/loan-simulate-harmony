
import React, { useState } from 'react';
import { PrioritizationMethod } from '@/utils/repayment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalculatorIcon, TrendingUp, CoinsIcon, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [budget, setBudget] = useState<number | string>(defaultBudget);
  const [prioritization, setPrioritization] = useState<PrioritizationMethod>(method);
  const isMobile = useIsMobile();

  const handleCalculate = () => {
    if (typeof budget === 'string') {
      const parsedBudget = parseFloat(budget);
      if (!isNaN(parsedBudget) && parsedBudget > 0) {
        onCalculate(parsedBudget, prioritization);
        console.log(`Calculating repayment plan with budget: ${parsedBudget}, method: ${prioritization}`);
      }
    } else if (budget > 0) {
      onCalculate(budget, prioritization);
      console.log(`Calculating repayment plan with budget: ${budget}, method: ${prioritization}`);
    }
  };

  return (
    <Card className="max-w-full overflow-hidden velkavapaus-card">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-wrap">
          <CalculatorIcon className="h-5 w-5 text-primary shrink-0" />
          <span className="break-words">Takaisinmaksusuunnitelma</span>
        </CardTitle>
        <CardDescription className="text-wrap break-words">
          Syötä kuukausittainen budjettisi velkojen maksamiseen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Kuukausittainen budjetti</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">€</span>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="pl-8"
              placeholder="500"
              min="0"
              step="10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Takaisinmaksustrategia</Label>
          <RadioGroup
            value={prioritization}
            onValueChange={(value) => setPrioritization(value as PrioritizationMethod)}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="avalanche" id="avalanche" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="avalanche" className="flex items-center gap-2 cursor-pointer">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Lumivyörystrategia
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Maksa ensin korkoimmat velat. Säästää eniten rahaa.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="snowball" id="snowball" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="snowball" className="flex items-center gap-2 cursor-pointer">
                  <CoinsIcon className="h-4 w-4 text-green-500" />
                  Lumipallostrategia
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Maksa ensin pienimmät velat. Motivoi nopeilla voitoilla.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCalculate} 
          className="w-full" 
          size={isMobile ? "sm" : "default"}
        >
          Laske takaisinmaksusuunnitelma
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetInput;
