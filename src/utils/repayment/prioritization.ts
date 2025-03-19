
import { DebtItem, PrioritizationMethod } from './types';

/**
 * Prioritizes debts according to the selected method
 */
export const prioritizeDebts = (
  debts: DebtItem[],
  method: PrioritizationMethod = 'avalanche'
): DebtItem[] => {
  if (debts.length === 0) return [];
  
  const activeDebts = debts.filter(debt => debt.isActive && debt.balance > 0);
  
  return [...activeDebts].sort((a, b) => {
    if (method === 'avalanche') {
      // Highest interest rate first
      return b.interestRate - a.interestRate;
    } else {
      // Smallest balance first
      return a.balance - b.balance;
    }
  });
};
