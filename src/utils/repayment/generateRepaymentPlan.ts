
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
      monthlyAllocation: [],
      creditCardFreeMonth: undefined
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
      creditCardFreeMonth: undefined
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

  // Step 3: Check if budget is sufficient for actual debt repayment
  // Calculate the minimum budget required to pay off the debt eventually
  const totalInterest = activeDebts.reduce((sum, debt) => {
    const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
    return sum + monthlyInterest;
  }, 0);
  
  // If the monthly budget is less than the monthly interest, the debt will never be paid off
  if (monthlyBudget <= totalInterest) {
    return {
      isViable: false,
      insufficientBudgetMessage: `Your monthly budget of ${monthlyBudget.toFixed(2)} is less than or equal to the monthly interest of ${totalInterest.toFixed(2)}. The debt will never be paid off.`,
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: []
    };
  }

  // Step 4: Prioritize debts according to the method
  const prioritizedDebts = prioritizeDebts(activeDebts, method);

  // Step 5: Allocate budget - first cover minimum payments for all debts
  const initialAllocation: RepaymentPlan['monthlyAllocation'] = activeDebts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));

  // Step 6: Allocate extra funds based on strategy
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
    // Step 7: Simulate repayment with the allocation
    const equalDistributionFlag = method === 'equal' || equalDistribution;
    const { timeline, finalAllocation } = simulateRepayment(activeDebts, initialAllocation, method, equalDistributionFlag);

    // Check if the simulation exceeds the maximum number of months (40 years = 480 months)
    const MAX_MONTHS = 480;
    if (timeline.length > MAX_MONTHS) {
      return {
        isViable: false,
        insufficientBudgetMessage: `Payment calculation exceeded maximum number of months (40 years). Please increase your monthly payment.`,
        totalMonths: MAX_MONTHS,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: initialAllocation
      };
    }

    // Step 8: Calculate total months and interest paid
    const totalMonths = timeline.length;
    const totalInterestPaid = timeline.reduce((sum, month) => sum + month.totalInterestPaid, 0);

    // Check if the simulation produced a valid timeline
    if (totalMonths === 0 || timeline.length === 0) {
      return {
        isViable: false,
        insufficientBudgetMessage: "The repayment simulation didn't produce a valid timeline. Please increase your monthly payment.",
        totalMonths: 0,
        totalInterestPaid: 0,
        timeline: [],
        monthlyAllocation: initialAllocation
      };
    }

    // Step 9: Find when all credit cards are paid off
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
    // Improved error handling with more specific information
    console.error("Error in generateRepaymentPlan:", error);
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
