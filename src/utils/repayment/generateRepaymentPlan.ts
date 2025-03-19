import { DebtItem, PrioritizationMethod, RepaymentPlan } from './types';
import { prioritizeDebts } from './prioritization';

/**
 * Simulates debt repayment month by month with improved interest calculation
 * and proper implementation of the snowball effect
 */
export const simulateRepayment = (
  initialDebts: DebtItem[],
  initialAllocation: RepaymentPlan['monthlyAllocation'],
  method: PrioritizationMethod
): { timeline: RepaymentPlan['timeline']; finalAllocation: RepaymentPlan['monthlyAllocation'] } => {
  // Deep clone debts to avoid mutating the original
  let currentDebts = initialDebts.map(debt => ({ ...debt }));

  // Initialize allocation by copying the initial allocation
  let currentAllocation = [...initialAllocation];

  const timeline: RepaymentPlan['timeline'] = [];

  // Simulate until all debts are paid off
  let month = 1;
  const MAX_MONTHS = 1200; // 100 years safety limit

  while (currentDebts.some(debt => debt.balance > 0) && month <= MAX_MONTHS) {
    const monthData = {
      month,
      debts: [] as { id: string; name: string; remainingBalance: number; payment: number; interestPaid: number }[],
      totalRemaining: 0,
      totalPaid: 0,
      totalInterestPaid: 0,
    };

    // Get debts that still have balance
    const remainingDebts = currentDebts.filter(debt => debt.balance > 0);

    // Apply payments to each debt
    for (const debt of remainingDebts) {
      // Get allocation for this debt
      const allocation = currentAllocation.find(a => a.id === debt.id);
      if (!allocation) continue;

      // Calculate monthly interest
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestForMonth = debt.balance * monthlyInterestRate;

      // Calculate principal payment
      const totalPayment = allocation.totalPayment;
      let principalPayment = totalPayment - interestForMonth;

      // If payment doesn't cover interest, increase balance
      if (totalPayment < interestForMonth) {
        debt.balance += (interestForMonth - totalPayment);
        principalPayment = 0;
      } else {
        // Ensure principal payment doesn't exceed the balance
        principalPayment = Math.min(principalPayment, debt.balance);
        debt.balance = Math.max(0, debt.balance - principalPayment);
      }

      // Calculate actual payment (interest + principal)
      const actualPayment = principalPayment + interestForMonth;

      // Add to month data
      monthData.debts.push({
        id: debt.id,
        name: debt.name,
        remainingBalance: debt.balance,
        payment: actualPayment,
        interestPaid: interestForMonth,
      });

      monthData.totalPaid += actualPayment;
      monthData.totalInterestPaid += interestForMonth;
    }

    // Calculate total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + debt.balance, 0);

    // Add month to timeline
    timeline.push(monthData);

    // Handle snowball effect - identify debts that were just paid off this month
    const justPaidOffDebts = monthData.debts.filter(debt => debt.remainingBalance === 0);

    // For each paid off debt, redistribute its payment to the highest priority remaining debt
    if (justPaidOffDebts.length > 0) {
      // Get the remaining debts with balance > 0
      const remainingDebtsWithBalance = currentDebts.filter(debt => debt.balance > 0);

      // If there are remaining debts with balance, prioritize them
      if (remainingDebtsWithBalance.length > 0) {
        const prioritizedRemainingDebts = prioritizeDebts(remainingDebtsWithBalance, method);

        // For each paid off debt, redirect its payment
        for (const paidOffDebt of justPaidOffDebts) {
          // Find the paid off debt's allocation
          const paidOffAllocation = currentAllocation.find(a => a.id === paidOffDebt.id);
          if (!paidOffAllocation) continue;

          // Get the amount to redistribute (total payment)
          const amountToRedistribute = paidOffAllocation.totalPayment;

          // Find the highest priority remaining debt
          if (prioritizedRemainingDebts.length > 0) {
            const targetDebtId = prioritizedRemainingDebts[0].id;
            const targetAllocation = currentAllocation.find(a => a.id === targetDebtId);

            if (targetAllocation) {
              // Add the payment to the target debt
              targetAllocation.extraPayment += amountToRedistribute;
              targetAllocation.totalPayment = targetAllocation.minPayment + targetAllocation.extraPayment;
            }
          }

          // Set the paid off debt's allocation to zero
          paidOffAllocation.extraPayment = 0;
          paidOffAllocation.totalPayment = 0;
        }
      }
    }

    // Check if all debts are paid off
    if (monthData.totalRemaining <= 0) {
      break;
    }

    month++;
  }

  // Handle case where repayment takes too long
  if (month > MAX_MONTHS) {
    console.warn('Repayment plan calculation hit maximum months limit');
  }

  return {
    timeline,
    finalAllocation: currentAllocation, // Return the updated allocation
  };
};
