
import { DebtItem, PrioritizationMethod, RepaymentPlan } from './types';
import { prioritizeDebts } from './prioritization';
import { simulateRepayment } from './simulateRepayment';

/**
 * Generates a repayment plan for a set of debts based on a monthly budget
 * and prioritization method.
 */
export const generateRepaymentPlan = (
  debts: DebtItem[],
  monthlyBudget: number,
  method: PrioritizationMethod,
  equalDistribution: boolean = method === 'equal'
): RepaymentPlan => {
  if (!debts || debts.length === 0) {
    return {
      isViable: true,
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: []
    };
  }

  // Filter out zero balance debts and inactive debts
  const activeDebts = debts.filter(debt => debt.balance > 0 && debt.isActive !== false);
  
  if (activeDebts.length === 0) {
    return {
      isViable: true,
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: [],
      creditCardFreeMonth: 0
    };
  }

  // Step 1: Calculate minimum payments for all debts
  const totalMinPayment = activeDebts.reduce((sum, debt) => sum + debt.minPayment, 0);

  // Step 2: Check if budget is sufficient to cover all minimum payments
  if (monthlyBudget < totalMinPayment) {
    return {
      isViable: false,
      insufficientBudgetMessage: `Your budget of ${monthlyBudget.toFixed(2)} is insufficient to cover the minimum payments of ${totalMinPayment.toFixed(2)}`,
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: []
    };
  }

  // Step 3: Prioritize debts according to the method
  const prioritizedDebts = prioritizeDebts(activeDebts, method);

  // Step 4: Allocate budget - first cover minimum payments for all debts
  const initialAllocation: RepaymentPlan['monthlyAllocation'] = activeDebts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));

  // Step 5: Allocate extra funds based on strategy
  const extraBudget = monthlyBudget - totalMinPayment;
  if (extraBudget > 0 && prioritizedDebts.length > 0) {
    if (method === 'equal' || equalDistribution) {
      // Distribute extra budget equally among all debts
      const extraPerDebt = extraBudget / prioritizedDebts.length;
      
      prioritizedDebts.forEach(debt => {
        const allocation = initialAllocation.find(a => a.id === debt.id);
        if (allocation) {
          allocation.extraPayment = extraPerDebt;
          allocation.totalPayment = allocation.minPayment + extraPerDebt;
        }
      });
    } else {
      // Apply all extra to highest priority debt based on strategy
      const highestPriorityDebtId = prioritizedDebts[0].id;
      const allocationForHighestPriority = initialAllocation.find(a => a.id === highestPriorityDebtId);
      
      if (allocationForHighestPriority) {
        allocationForHighestPriority.extraPayment = extraBudget;
        allocationForHighestPriority.totalPayment = allocationForHighestPriority.minPayment + extraBudget;
      }
    }
  }

  try {
    // Step 6: Simulate repayment with the allocation
    const equalDistributionFlag = method === 'equal' || equalDistribution;
    const { timeline, finalAllocation } = simulateRepayment(activeDebts, initialAllocation, method, equalDistributionFlag);

    // Step 7: Calculate total months and interest paid
    const totalMonths = timeline.length;
    const totalInterestPaid = timeline.reduce((sum, month) => sum + month.totalInterestPaid, 0);

    // Step 8: Find when all credit cards are paid off
    const creditCardFreeMonth = findCreditCardFreeMonth(activeDebts, timeline);

    // Return the complete repayment plan
    return {
      isViable: true,
      totalMonths,
      totalInterestPaid,
      timeline,
      monthlyAllocation: initialAllocation,
      creditCardFreeMonth
    };
  } catch (error) {
    // If simulation exceeded maximum months or had other errors
    if (error instanceof Error && error.message.includes('maximum number of months')) {
      return {
        isViable: false,
        insufficientBudgetMessage: `Payment calculation exceeded maximum number of months (40 years)`,
        totalMonths: 480, // 40 years
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: initialAllocation
      };
    }
    
    // For other errors
    return {
      isViable: false,
      insufficientBudgetMessage: error instanceof Error ? error.message : 'Unknown calculation error',
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: initialAllocation
    };
  }
};

/**
 * Find the month when all credit cards are paid off
 */
function findCreditCardFreeMonth(debts: DebtItem[], timeline: RepaymentPlan['timeline']): number | undefined {
  // Get all credit card IDs
  const creditCardIds = new Set(
    debts.filter(debt => debt.type === 'credit-card').map(debt => debt.id)
  );
  
  // If no credit cards, return undefined
  if (creditCardIds.size === 0) {
    return undefined;
  }
  
  // Find the month when all credit cards are paid off
  for (let i = 0; i < timeline.length; i++) {
    const month = timeline[i];
    
    // Check if all credit cards have zero balance
    const allCreditCardsPaid = !month.debts.some(
      debt => creditCardIds.has(debt.id) && debt.remainingBalance > 0
    );
    
    if (allCreditCardsPaid) {
      return month.month;
    }
  }
  
  return undefined;
}
