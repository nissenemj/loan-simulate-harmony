
import { DebtItem, PrioritizationMethod } from './types';

/**
 * Prioritizes debts according to the selected method
 */
export const prioritizeDebts = (
  debts: DebtItem[],
  method: PrioritizationMethod = 'avalanche'
): DebtItem[] => {
  if (debts.length === 0) return [];
  
  // Filter to only include active debts with positive balances
  const activeDebts = debts.filter(debt => debt.isActive !== false && debt.balance > 0);
  
  return [...activeDebts].sort((a, b) => {
    if (method === 'avalanche') {
      // Primary sort: Highest interest rate first
      const interestDiff = b.interestRate - a.interestRate;
      if (Math.abs(interestDiff) > 0.001) {
        return interestDiff;
      }
      // Secondary sort: Smallest balance when interest rates are equal
      return a.balance - b.balance;
    } else if (method === 'snowball') {
      // Primary sort: Smallest balance first
      const balanceDiff = a.balance - b.balance;
      if (Math.abs(balanceDiff) > 0.01) {
        return balanceDiff;
      }
      // Secondary sort: Highest interest rate when balances are very close
      return b.interestRate - a.interestRate;
    } else {
      // Fallback for minimum payments or other strategies
      return a.id.localeCompare(b.id); // Stable sort by ID
    }
  });
};
