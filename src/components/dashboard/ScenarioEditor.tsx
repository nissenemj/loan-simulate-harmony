
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScenarioEditor } from '@/hooks/use-scenario-editor';
import type { Scenario } from '@/types/scenarios';

interface ScenarioEditorProps {
  totalMinPayments: number;
  onUpdate: (values: Partial<Scenario>) => void;
  estimatedMonths?: number;
  estimatedInterest?: number;
}

export function ScenarioEditor({ 
  totalMinPayments,
  onUpdate,
  estimatedMonths,
  estimatedInterest
}: ScenarioEditorProps) {
  const { t } = useLanguage();
  const {
    editFormData,
    setEditFormData,
    previousValues,
    presetScenarios,
    currencyFormatter
  } = useScenarioEditor({ totalMinPayments, onUpdate });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRateAdjustment" className="flex items-center">
              {t('scenarios.interestRateChange')}
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 inline ml-1 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{t('scenarios.interestRateChangeTooltip')}</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </Label>
            <span className={`text-sm ${
              editFormData.interestRateAdjustment > 0 
                ? 'text-red-500' 
                : editFormData.interestRateAdjustment < 0 
                  ? 'text-green-500' 
                  : ''
            }`}>
              {editFormData.interestRateAdjustment > 0 ? '+' : ''}{editFormData.interestRateAdjustment}%
            </span>
          </div>
          <Slider
            id="interestRateAdjustment"
            value={[editFormData.interestRateAdjustment]}
            min={-5}
            max={5}
            step={0.25}
            onValueChange={(values) => {
              setEditFormData({
                ...editFormData,
                interestRateAdjustment: values[0]
              });
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">-5%</span>
            <span>0%</span>
            <span className="text-red-500">+5%</span>
          </div>
        </div>

        {(estimatedMonths !== undefined && estimatedInterest !== undefined) && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">{t('scenarios.estimatedImpact')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('visualization.monthsToPayoff')}</span>
                <div className="flex items-center">
                  <span>{estimatedMonths}</span>
                  {previousValues.months && (
                    <span className={`ml-2 flex items-center ${
                      estimatedMonths < previousValues.months ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {estimatedMonths < previousValues.months ? (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {previousValues.months - estimatedMonths}
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {estimatedMonths - previousValues.months}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>{t('visualization.totalInterestPaid')}</span>
                <div className="flex items-center">
                  <span>{currencyFormatter.format(estimatedInterest)}</span>
                  {previousValues.interest && (
                    <span className={`ml-2 flex items-center ${
                      estimatedInterest < previousValues.interest ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {estimatedInterest < previousValues.interest ? (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {currencyFormatter.format(previousValues.interest - estimatedInterest)}
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {currencyFormatter.format(estimatedInterest - previousValues.interest)}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">{t('scenarios.presets')}</h4>
          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setEditFormData(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
