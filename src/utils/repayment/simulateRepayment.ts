
import { DebtItem, PrioritizationMethod, RepaymentPlan } from './types';
import { prioritizeDebts } from './prioritization';

/**
 * Simulates debt repayment month by month with improved interest calculation
 * and proper implementation of snowball/avalanche prioritization
 */
export const simulateRepayment = (
  initialDebts: DebtItem[],
  initialAllocation: RepaymentPlan['monthlyAllocation'],
  method: PrioritizationMethod
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
  
  console.log('Starting debt simulation with method:', method);
  console.log('Initial debts:', JSON.stringify(currentDebts.map(d => ({ id: d.id, name: d.name, balance: d.balance }))));
  console.log('Initial allocation:', JSON.stringify(currentAllocation));
  
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
    const remainingDebts = currentDebts.filter(debt => debt.balance > 0);
    
    // Re-prioritize every month to handle changing balances (especially important for snowball)
    const prioritizedRemainingDebts = prioritizeDebts(remainingDebts, method);
    
    if (month % 12 === 0 || month === 1) {
      console.log(`Month ${month} - Prioritized debts:`, 
        prioritizedRemainingDebts.map(d => ({ id: d.id, name: d.name, balance: d.balance, interest: d.interestRate }))
      );
    }
    
    // Add any extra payment from the pool to the highest priority debt
    if (extraPaymentPool > 0 && prioritizedRemainingDebts.length > 0) {
      const highestPriorityDebtId = prioritizedRemainingDebts[0].id;
      const allocation = currentAllocation.find(a => a.id === highestPriorityDebtId);
      
      if (allocation) {
        if (month % 12 === 0 || month === 1) {
          console.log(`Month ${month} - Adding extra payment ${extraPaymentPool.toFixed(2)} to debt ${highestPriorityDebtId}`);
        }
        allocation.extraPayment += extraPaymentPool;
        allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
        extraPaymentPool = 0; // Reset pool after allocation
      }
    }
    
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
      
      // Improved interest handling - check if payment covers interest
      let principalPayment;
      let actualInterestPaid;
      
      if (totalPayment < interestForMonth) {
        // If payment doesn't cover interest, increase balance
        principalPayment = 0;
        actualInterestPaid = totalPayment; // All payment goes to interest
        debt.balance += (interestForMonth - totalPayment);
      } else {
        // Calculate principal payment (payment minus interest)
        principalPayment = totalPayment - interestForMonth;
        actualInterestPaid = interestForMonth;
      }
      
      // Ensure principal payment doesn't exceed the balance
      principalPayment = Math.min(principalPayment, debt.balance);
      
      // Calculate actual payment (interest + principal)
      const actualPayment = principalPayment + actualInterestPaid;
      
      // Check if debt is being paid off this month
      const isPaidOff = principalPayment >= debt.balance;
      
      // If payment exceeds what's needed to pay off, add remainder to extra payment pool
      if (isPaidOff && principalPayment > debt.balance) {
        const excess = principalPayment - debt.balance;
        if (excess > 0.01) { // Only consider significant amounts
          extraPaymentPool += excess;
          if (month % 12 === 0 || month === 1) {
            console.log(`Month ${month} - Debt ${debt.id} paid off, adding ${excess.toFixed(2)} to extra payment pool`);
          }
          principalPayment = debt.balance;
        }
      }
      
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
    }
    
    // Calculate total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Add month to timeline
    timeline.push(monthData);
    
    // Handle snowball/avalanche logic - identify debts that were just paid off this month
    const justPaidOffDebts = monthData.debts.filter(debt => debt.remainingBalance === 0);
    
    // For each paid off debt, redistribute its payment to the highest priority remaining debt
    if (justPaidOffDebts.length > 0) {
      // Get the remaining debts with balance > 0
      const remainingDebtsWithBalance = currentDebts.filter(debt => debt.balance > 0);
      
      if (month % 12 === 0 || month === 1 || justPaidOffDebts.length > 0) {
        console.log(`Month ${month} - Debts paid off:`, justPaidOffDebts.map(d => d.id));
        console.log(`Month ${month} - Remaining debts:`, remainingDebtsWithBalance.map(d => d.id));
      }
      
      // If there are remaining debts with balance, prioritize them
      if (remainingDebtsWithBalance.length > 0) {
        // Reprioritize debts (important for snowball method which depends on current balances)
        const updatedPrioritizedDebts = prioritizeDebts(remainingDebtsWithBalance, method);
        
        // For each paid off debt, redirect its payment
        for (const paidOffDebt of justPaidOffDebts) {
          // Find the paid off debt's allocation
          const paidOffAllocation = currentAllocation.find(a => a.id === paidOffDebt.id);
          if (!paidOffAllocation) continue;
          
          // Get the amount to redistribute (total payment)
          const amountToRedistribute = paidOffAllocation.totalPayment;
          
          // Find the highest priority remaining debt
          if (updatedPrioritizedDebts.length > 0) {
            const targetDebtId = updatedPrioritizedDebts[0].id;
            const targetAllocation = currentAllocation.find(a => a.id === targetDebtId);
            
            if (targetAllocation) {
              // Add the payment to the target debt
              if (month % 12 === 0 || month === 1 || justPaidOffDebts.length > 0) {
                console.log(`Month ${month} - Redistributing ${amountToRedistribute.toFixed(2)} from debt ${paidOffDebt.id} to debt ${targetDebtId}`);
              }
              targetAllocation.extraPayment += amountToRedistribute;
              targetAllocation.totalPayment = targetAllocation.minPayment + targetAllocation.extraPayment;
            }
          } else {
            // If no debts remaining, add to extra payment pool for future use
            extraPaymentPool += amountToRedistribute;
            if (month % 12 === 0 || month === 1 || justPaidOffDebts.length > 0) {
              console.log(`Month ${month} - No remaining debts, adding ${amountToRedistribute.toFixed(2)} to extra payment pool`);
            }
          }
          
          // Set the paid off debt's allocation to zero
          paidOffAllocation.extraPayment = 0;
          paidOffAllocation.totalPayment = 0;
          paidOffAllocation.minPayment = 0; // Also zero out min payment for paid debts
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
  
  console.log('Debt simulation completed. Total months:', month);
  
  return {
    timeline,
    finalAllocation: currentAllocation
  };
};
