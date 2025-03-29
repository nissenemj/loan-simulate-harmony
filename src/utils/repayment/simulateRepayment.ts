
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
      
      // If we paid off the debt or have excess payment, handle snowball/avalanche logic
      if (debt.balance <= 0 || excessPayment > 0) {
        // Amount to redistribute (excess payment + monthly min payment if debt is paid off)
        let amountToRedistribute = excessPayment;
        
        // If debt is now paid off, add its allocation to redistribution
        if (debt.balance <= 0) {
          // Use allocation.totalPayment (min + extra) for the freed up payment
          amountToRedistribute += allocation.totalPayment - actualPayment;
          
          // Zero out the paid-off debt's allocation for future months
          allocation.minPayment = 0;
          allocation.extraPayment = 0;
          allocation.totalPayment = 0;
        }
        
        // Only redistribute if we have an amount to redistribute
        if (amountToRedistribute > 0.01) { // Use a small threshold to handle floating point
          // Get updated list of debts with balances after this payment
          const updatedRemainingDebts = currentDebts.filter(d => d.balance > 0);
          
          if (equalDistribution && updatedRemainingDebts.length > 0) {
            // For equal distribution, add to pool for immediate redistribution
            const amountPerDebt = amountToRedistribute / updatedRemainingDebts.length;
            
            for (const remainingDebt of updatedRemainingDebts) {
              const remainingAllocation = currentAllocation.find(a => a.id === remainingDebt.id);
              if (remainingAllocation) {
                remainingAllocation.extraPayment += amountPerDebt;
                remainingAllocation.totalPayment = remainingAllocation.minPayment + remainingAllocation.extraPayment;
              }
            }
          } else if (updatedRemainingDebts.length > 0) {
            // For snowball/avalanche, redirect based on new priority order
            const newPrioritizedDebts = prioritizeDebts(updatedRemainingDebts, method);
            
            if (newPrioritizedDebts.length > 0) {
              // Get highest priority debt according to strategy
              const nextDebtId = newPrioritizedDebts[0].id;
              const nextAllocation = currentAllocation.find(a => a.id === nextDebtId);
              
              if (nextAllocation) {
                // Redirect the amount to this debt
                nextAllocation.extraPayment += amountToRedistribute;
                nextAllocation.totalPayment = nextAllocation.minPayment + nextAllocation.extraPayment;
              }
            }
          } else {
            // No debts left with balance, add to pool for next month if any
            extraPaymentPool += amountToRedistribute;
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
