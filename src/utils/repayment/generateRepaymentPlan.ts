
import { DebtItem, PrioritizationMethod, RepaymentPlan } from './types';
import { prioritizeDebts } from './prioritization';
import { simulateRepayment } from './simulateRepayment';

/**
 * Generates a repayment plan based on debts and monthly budget
 */
export const generateRepaymentPlan = (
  debts: DebtItem[],
  monthlyBudget: number,
  method: PrioritizationMethod = 'avalanche'
): RepaymentPlan => {
  // Filter only active debts with positive balances
  const activeDebts = debts.filter(debt => debt.isActive && debt.balance > 0);
  
  // Calculate total minimum payments
  const totalMinPayments = activeDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  
  // Check if budget is sufficient
  if (monthlyBudget < totalMinPayments) {
    return {
      monthlyAllocation: [],
      timeline: [],
      totalMonths: 0,
      totalInterestPaid: 0,
      isViable: false,
      insufficientBudgetMessage: `Budget is insufficient. You need at least ${totalMinPayments.toFixed(2)} € to cover minimum payments.`
    };
  }
  
  // Calculate extra budget available after minimum payments
  const extraBudget = monthlyBudget - totalMinPayments;
  
  // Prioritize debts
  const prioritizedDebts = prioritizeDebts(activeDebts, method);
  
  // Initialize monthly allocation with minimum payments for all debts
  const initialAllocation = activeDebts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));
  
  // Allocate extra budget to highest priority debt(s) according to the prioritization method
  if (prioritizedDebts.length > 0 && extraBudget > 0) {
    // Get the highest priority debt based on the selected method
    const highestPriorityDebtId = prioritizedDebts[0].id;
    const allocation = initialAllocation.find(a => a.id === highestPriorityDebtId);
    
    if (allocation) {
      // Allocate all extra budget to the highest priority debt
      allocation.extraPayment = extraBudget;
      allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
    }
  }
  
  // Simulate repayment over time with accurate interest calculation
  const { timeline, finalAllocation } = simulateRepayment(activeDebts, initialAllocation, method);
  
  // Calculate totals
  const totalMonths = timeline.length;
  const totalInterestPaid = timeline.reduce((sum, month) => 
    sum + month.debts.reduce((monthSum, debt) => monthSum + debt.interestPaid, 0), 0);
  
  return {
    monthlyAllocation: finalAllocation,  // Use the final allocation after simulation
    timeline,
    totalMonths,
    totalInterestPaid,
    isViable: true
  };
};
