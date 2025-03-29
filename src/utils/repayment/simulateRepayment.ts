
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
  
  // Track extra payment amount available for redistribution
  let extraPaymentPool = 0;
  
  while (currentDebts.some(debt => debt.balance > 0) && month <= MAX_MONTHS) {
    const monthData = {
      month,
      debts: [] as { id: string; name: string; remainingBalance: number; payment: number; interestPaid: number; }[],
      totalRemaining: 0,
      totalPaid: 0,
      totalInterestPaid: 0,
      strategy: method // Add strategy information to monthly data
    };
    
    // Get debts that still have balance
    let remainingDebts = currentDebts.filter(debt => debt.balance > 0);
    
    // Re-prioritize every month to handle changing balances (especially important for snowball)
    let prioritizedRemainingDebts = prioritizeDebts(remainingDebts, method);
    
    // Apply extra payment from the pool according to the chosen strategy
    if (extraPaymentPool > 0 && prioritizedRemainingDebts.length > 0) {
      if (equalDistribution) {
        // Distribute equally among remaining debts
        const extraPerDebt = extraPaymentPool / prioritizedRemainingDebts.length;
        
        for (const debt of prioritizedRemainingDebts) {
          const allocation = currentAllocation.find(a => a.id === debt.id);
          if (allocation) {
            allocation.extraPayment += extraPerDebt;
            allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
          }
        }
      } else {
        // Follow strategy - put all extra to highest priority debt
        const highestPriorityDebtId = prioritizedRemainingDebts[0].id;
        const allocation = currentAllocation.find(a => a.id === highestPriorityDebtId);
        
        if (allocation) {
          allocation.extraPayment += extraPaymentPool;
          allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
        }
      }
      
      extraPaymentPool = 0; // Reset pool after allocation
    }
    
    // Process debts in order of priority (important for snowball/avalanche methods)
    for (let priorityIndex = 0; priorityIndex < prioritizedRemainingDebts.length; priorityIndex++) {
      const debt = prioritizedRemainingDebts[priorityIndex];
      
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
      
      // Improved interest handling
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
      
      // Key improvement: Immediately redirect excess payment
      // if this debt is now paid off and we have an excess payment
      if (debt.balance <= 0 && (excessPayment > 0 || allocation.minPayment > 0)) {
        if (equalDistribution) {
          // Equal distribution: add to pool for next redistribution
          extraPaymentPool += excessPayment + allocation.minPayment;
        } else {
          // Snowball/Avalanche: redirect to next debt in priority
          const nextDebts = prioritizedRemainingDebts.slice(priorityIndex + 1);
          
          if (nextDebts.length > 0) {
            // Get the next highest priority debt with balance
            const nextDebtId = nextDebts[0].id;
            const nextAllocation = currentAllocation.find(a => a.id === nextDebtId);
            
            if (nextAllocation) {
              // Add the excess payment to the next debt's extra payment
              if (excessPayment > 0) {
                nextAllocation.extraPayment += excessPayment;
                nextAllocation.totalPayment = nextAllocation.minPayment + nextAllocation.extraPayment;
              }
              
              // Also add the base monthly payment from the paid-off debt
              nextAllocation.extraPayment += allocation.minPayment;
              nextAllocation.totalPayment = nextAllocation.minPayment + nextAllocation.extraPayment;
            }
          } else {
            // No next debt, add to pool for next month
            extraPaymentPool += excessPayment + allocation.minPayment;
          }
        }
        
        // Zero out the current allocation since it's paid off
        allocation.extraPayment = 0;
        allocation.totalPayment = 0;
        allocation.minPayment = 0;
      }
    }
    
    // Calculate total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
    
    // Add month to timeline
    timeline.push(monthData);
    
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
    finalAllocation: currentAllocation
  };
};
