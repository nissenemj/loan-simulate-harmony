
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
  method: PrioritizationMethod
): RepaymentPlan => {
  if (!debts || debts.length === 0) {
    return {
      isViable: false,
      insufficientBudgetMessage: "No debts provided",
      totalMonths: 0,
      totalInterestPaid: 0,
      timeline: [],
      monthlyAllocation: []
    };
  }

  // Step 1: Calculate minimum payments for all debts
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minPayment, 0);

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
  const prioritizedDebts = prioritizeDebts(debts, method);

  // Step 4: Allocate budget - first cover minimum payments for all debts
  const initialAllocation: RepaymentPlan['monthlyAllocation'] = debts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));

  // Step 5: Allocate extra funds to the highest priority debt
  const extraBudget = monthlyBudget - totalMinPayment;
  if (extraBudget > 0 && prioritizedDebts.length > 0) {
    const highestPriorityDebtId = prioritizedDebts[0].id;
    const allocationForHighestPriority = initialAllocation.find(a => a.id === highestPriorityDebtId);
    
    if (allocationForHighestPriority) {
      allocationForHighestPriority.extraPayment = extraBudget;
      allocationForHighestPriority.totalPayment = allocationForHighestPriority.minPayment + extraBudget;
    }
  }

  // Step 6: Simulate repayment with the allocation
  const { timeline, finalAllocation } = simulateRepayment(debts, initialAllocation, method);

  // Step 7: Calculate total months and interest paid
  const totalMonths = timeline.length;
  const totalInterestPaid = timeline.reduce((sum, month) => sum + month.totalInterestPaid, 0);

  // Return the complete repayment plan
  return {
    isViable: true,
    totalMonths,
    totalInterestPaid,
    timeline,
    monthlyAllocation: initialAllocation
  };
};
