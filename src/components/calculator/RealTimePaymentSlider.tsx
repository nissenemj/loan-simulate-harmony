import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrencyFormatter } from '@/utils/formatting';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { DollarSign } from 'lucide-react';

interface RealTimePaymentSliderProps {
  minPayment: number;
  currentValue: number;
  onChange: (value: number) => void;
  debounceMs?: number;
  maxValue?: number;
}

/**
 * A slider component for adjusting extra monthly payments with real-time feedback
 */
const RealTimePaymentSlider: React.FC<RealTimePaymentSliderProps> = ({
  minPayment,
  currentValue,
  onChange,
  debounceMs = 300,
  maxValue
}) => {
  const { t } = useLanguage();
  const currencyFormatter = useCurrencyFormatter();
  
  // Calculate a reasonable max value if not provided
  const calculatedMaxValue = maxValue || Math.max(minPayment * 2, minPayment + 500);
  
  // State for the slider and input
  const [sliderValue, setSliderValue] = useState<number>(currentValue);
  const [inputValue, setInputValue] = useState<string>(currentValue.toString());
  
  // Update local state when prop changes
  useEffect(() => {
    setSliderValue(currentValue);
    setInputValue(currentValue.toString());
  }, [currentValue]);
  
  // Debounced onChange handler
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(sliderValue);
    }, debounceMs);
    
    return () => {
      clearTimeout(handler);
    };
  }, [sliderValue, onChange, debounceMs]);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    setInputValue(newValue.toString());
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSliderValue(numValue);
    }
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      setInputValue(sliderValue.toString());
    } else {
      // Ensure the value is within bounds
      const boundedValue = Math.max(0, Math.min(numValue, calculatedMaxValue));
      setSliderValue(boundedValue);
      setInputValue(boundedValue.toString());
      onChange(boundedValue);
    }
  };
  
  // Calculate potential savings
  const potentialSavings = sliderValue > minPayment 
    ? (sliderValue - minPayment) * 12 
    : 0;
  
  return (
    <Card className="bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="payment-slider" className="text-base font-medium">
                {t('calculator.monthlyPayment')}
              </Label>
              <HelpTooltip content={t('calculator.monthlyPaymentTooltip')} />
            </div>
            <div className="text-2xl font-bold text-primary">
              {currencyFormatter.format(sliderValue)}
            </div>
          </div>
          
          <div className="grid grid-cols-[1fr,120px] gap-4 items-center">
            <Slider
              id="payment-slider"
              min={0}
              max={calculatedMaxValue}
              step={10}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              className="cursor-pointer"
              aria-label={t('calculator.adjustMonthlyPayment')}
            />
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </span>
              <Input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="pl-8"
                min={0}
                max={calculatedMaxValue}
                step={10}
                aria-label={t('calculator.enterMonthlyPayment')}
              />
            </div>
          </div>
          
          {sliderValue > minPayment && (
            <div className="bg-primary/10 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">{t('calculator.extraPaymentImpact')}: </span>
                {t('calculator.extraPaymentDescription', { 
                  amount: currencyFormatter.format(sliderValue - minPayment),
                  yearly: currencyFormatter.format(potentialSavings)
                })}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-muted-foreground">{t('calculator.minimum')}</div>
              <button 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => {
                  setSliderValue(minPayment);
                  setInputValue(minPayment.toString());
                  onChange(minPayment);
                }}
                aria-label={t('calculator.setToMinimum')}
              >
                {currencyFormatter.format(minPayment)}
              </button>
            </div>
            <div>
              <div className="text-muted-foreground">{t('calculator.recommended')}</div>
              <button 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => {
                  const recommended = Math.round((minPayment * 1.2) / 10) * 10;
                  setSliderValue(recommended);
                  setInputValue(recommended.toString());
                  onChange(recommended);
                }}
                aria-label={t('calculator.setToRecommended')}
              >
                {currencyFormatter.format(Math.round((minPayment * 1.2) / 10) * 10)}
              </button>
            </div>
            <div>
              <div className="text-muted-foreground">{t('calculator.aggressive')}</div>
              <button 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => {
                  const aggressive = Math.round((minPayment * 1.5) / 10) * 10;
                  setSliderValue(aggressive);
                  setInputValue(aggressive.toString());
                  onChange(aggressive);
                }}
                aria-label={t('calculator.setToAggressive')}
              >
                {currencyFormatter.format(Math.round((minPayment * 1.5) / 10) * 10)}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePaymentSlider;
