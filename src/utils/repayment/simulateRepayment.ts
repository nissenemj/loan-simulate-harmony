
import { DebtItem, PrioritizationMethod, RepaymentPlan } from './types';
import { prioritizeDebts } from './prioritization';

/**
 * Simulates debt repayment month by month with improved interest calculation
 * and proper implementation of snowball/avalanche prioritization
 */
export const simulateRepayment = (
  initialDebts: DebtItem[],
  initialAllocation: RepaymentPlan['monthlyAllocation'],
  method: PrioritizationMethod,
  equalDistribution: boolean = false
): {
  timeline: RepaymentPlan['timeline'];
  finalAllocation: RepaymentPlan['monthlyAllocation'];
} => {
  // Deep clone debts to avoid mutating the original
  let currentDebts = initialDebts.map(debt => ({...debt}));
  
  // Initialize allocation by creating a deep copy of the initial allocation
  let currentAllocation = initialAllocation.map(alloc => ({...alloc}));
  
  const timeline: RepaymentPlan['timeline'] = [];
  
  // Simulate until all debts are paid off
  let month = 1;
  const MAX_MONTHS = 3600; // 300 years safety limit
  
  while (currentDebts.some(debt => debt.balance > 0) && month <= MAX_MONTHS) {
    // Get debts that still have balance
    let remainingDebts = currentDebts.filter(debt => debt.balance > 0);
    
    // Re-prioritize every month to handle changing balances
    let prioritizedRemainingDebts = prioritizeDebts(remainingDebts, method);
    
    const monthData = {
      month,
      debts: [] as { id: string; name: string; remainingBalance: number; payment: number; interestPaid: number; }[],
      totalRemaining: 0,
      totalPaid: 0,
      totalInterestPaid: 0,
      strategy: method 
    };
    
    // Extra payment pool to collect freed-up payments
    let extraPaymentPool = 0;
    
    // Process each debt to calculate interest and apply payments
    for (const debt of remainingDebts) {
      // Skip debts with zero balance
      if (debt.balance <= 0) continue;
      
      // Get allocation for this debt
      const allocation = currentAllocation.find(a => a.id === debt.id);
      if (!allocation) continue;
      
      // Calculate monthly interest
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestForMonth = debt.balance * monthlyInterestRate;
      
      // Calculate available payment
      let availablePayment = allocation.totalPayment;
      
      // Calculate principal payment (payment minus interest)
      let principalPayment;
      let actualInterestPaid;
      
      if (availablePayment < interestForMonth) {
        // If payment doesn't cover interest, increase balance
        principalPayment = 0;
        actualInterestPaid = availablePayment; // All payment goes to interest
        debt.balance += (interestForMonth - availablePayment);
      } else {
        // Calculate principal payment (payment minus interest)
        principalPayment = availablePayment - interestForMonth;
        actualInterestPaid = interestForMonth;
      }
      
      // Ensure principal payment doesn't exceed the balance
      const excessPayment = principalPayment > debt.balance ? principalPayment - debt.balance : 0;
      principalPayment = Math.min(principalPayment, debt.balance);
      
      // Calculate actual payment (interest + principal)
      const actualPayment = principalPayment + actualInterestPaid;
      
      // Update debt balance
      const previousBalance = debt.balance;
      debt.balance = Math.max(0, debt.balance - principalPayment);
      
      // Add to month data
      monthData.debts.push({
        id: debt.id,
        name: debt.name,
        remainingBalance: debt.balance,
        payment: actualPayment,
        interestPaid: actualInterestPaid
      });
      
      monthData.totalPaid += actualPayment;
      monthData.totalInterestPaid += actualInterestPaid;
      
      // If debt is paid off or we have excess payment, handle redistribution
      if (debt.balance <= 0 || excessPayment > 0) {
        // Add excess payment and any freed allocation to pool
        if (debt.balance <= 0) {
          // If debt is fully paid off, free up its entire allocation for future months
          extraPaymentPool += allocation.totalPayment - actualPayment;
          
          // Update allocation for future months - debt is paid off
          allocation.minPayment = 0;
          allocation.extraPayment = 0;
          allocation.totalPayment = 0;
        } else if (excessPayment > 0) {
          extraPaymentPool += excessPayment;
        }
      }
    }
    
    // After processing all debts, redistribute the extra payment pool for next month
    if (extraPaymentPool > 0) {
      // Get updated debts that still have balances
      const debtsWithBalance = currentDebts.filter(d => d.balance > 0);
      
      if (debtsWithBalance.length > 0) {
        // Apply different redistribution strategies
        if (equalDistribution) {
          // Equal distribution: split extra among all remaining debts
          const extraPerDebt = extraPaymentPool / debtsWithBalance.length;
          
          for (const debt of debtsWithBalance) {
            const allocation = currentAllocation.find(a => a.id === debt.id);
            if (allocation) {
              allocation.extraPayment += extraPerDebt;
              allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
            }
          }
        } else {
          // Follow prioritization strategy for redistribution
          const prioritizedDebts = prioritizeDebts(debtsWithBalance, method);
          if (prioritizedDebts.length > 0) {
            // Add all extra to highest priority debt
            const topPriorityDebt = prioritizedDebts[0];
            const allocation = currentAllocation.find(a => a.id === topPriorityDebt.id);
            
            if (allocation) {
              allocation.extraPayment += extraPaymentPool;
              allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
            }
          }
        }
      }
    }
    
    // Calculate total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
    
    // Add month to timeline
    timeline.push(monthData);
    
    // Check if all debts are paid off
    if (monthData.totalRemaining <= 0.01) { // Use small threshold for floating point comparison
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
    finalAllocation: currentAllocation
  };
};
