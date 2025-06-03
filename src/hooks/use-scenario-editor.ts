
import { useState, useEffect } from 'react';
import { useCurrencyFormatter } from '@/utils/formatting';
import type { Scenario } from '@/types/scenarios';

interface UseScenarioEditorProps {
  totalMinPayments: number;
  onUpdate?: (values: Partial<Scenario>) => void;
}

export function useScenarioEditor({ totalMinPayments, onUpdate }: UseScenarioEditorProps) {
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
      name: 'Alhaisemmat korot',
      interestRateAdjustment: -2,
      monthlyPayment: totalMinPayments,
      extraPayment: 0,
      strategy: 'avalanche' as const
    },
    {
      name: 'Suurempi maksu',
      interestRateAdjustment: 0,
      monthlyPayment: totalMinPayments * 1.2,
      extraPayment: 0,
      strategy: 'avalanche' as const
    },
    {
      name: 'Vuosibonus',
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
