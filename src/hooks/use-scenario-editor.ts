
import { useState, useEffect } from 'react';
import { useCurrencyFormatter } from '@/utils/formatting';
import type { Scenario } from '@/types/scenarios';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseScenarioEditorProps {
  totalMinPayments: number;
  onUpdate?: (values: Partial<Scenario>) => void;
}

export function useScenarioEditor({ totalMinPayments, onUpdate }: UseScenarioEditorProps) {
  const { t } = useLanguage();
  const [editFormData, setEditFormData] = useState<Partial<Scenario>>({
    interestRateAdjustment: 0,
    monthlyPayment: totalMinPayments,
    extraPayment: 0,
    strategy: 'avalanche'
  });

  const [previousValues, setPreviousValues] = useState<{
    months?: number;
    interest?: number;
  }>({});

  const currencyFormatter = useCurrencyFormatter();

  const presetScenarios = [
    {
      name: t('scenarios.lowerInterestRates') || 'Lower Interest Rates',
      interestRateAdjustment: -2,
      monthlyPayment: totalMinPayments,
      extraPayment: 0,
      strategy: 'avalanche' as const
    },
    {
      name: t('scenarios.higherPayment') || 'Higher Payment',
      interestRateAdjustment: 0,
      monthlyPayment: totalMinPayments * 1.2,
      extraPayment: 0,
      strategy: 'avalanche' as const
    },
    {
      name: t('scenarios.annualBonus') || 'Annual Bonus',
      interestRateAdjustment: 0,
      monthlyPayment: totalMinPayments,
      extraPayment: 2000,
      strategy: 'avalanche' as const
    }
  ];

  useEffect(() => {
    onUpdate?.(editFormData);
  }, [editFormData, onUpdate]);

  return {
    editFormData,
    setEditFormData,
    previousValues,
    setPreviousValues,
    presetScenarios,
    currencyFormatter
  };
}
