
import { Debt, PaymentStrategy, PaymentPlan, MonthlyPaymentPlan, ExtraPaymentImpact, Payment, ConsolidationOption } from './types';

/**
 * Calculate a complete debt payment plan
 */
export const calculatePaymentPlan = (
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: PaymentStrategy = 'avalanche'
): PaymentPlan => {
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }

  // Validate input
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  if (totalMonthlyPayment < totalMinPayment) {
    throw new Error(`Total monthly payment must be at least ${totalMinPayment.toFixed(2)}`);
  }

  // Deep clone debts to avoid mutating original array
  const workingDebts = JSON.parse(JSON.stringify(debts));
  
  // Sort debts based on strategy
  sortDebtsByStrategy(workingDebts, strategy);

  // Initialize monthly plans
  const monthlyPlans: MonthlyPaymentPlan[] = [];
  let month = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let currentDate = new Date();
  let allPaidOff = false;

  while (!allPaidOff && month < 600) { // Set max to 50 years (600 months) as a safety
    month++;
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    // Create monthly plan
    const monthlyPlan: MonthlyPaymentPlan = {
      month,
      date: currentDate.toISOString(),
      payments: [],
      totalPaid: 0,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      totalRemainingBalance: 0,
      debtsCompleted: []
    };

    // Allocate monthly payment
    let remainingPayment = totalMonthlyPayment;
    
    // First, allocate minimum payments to all debts
    for (const debt of workingDebts) {
      if (debt.balance <= 0) continue;

      // Calculate interest for this month
      const monthlyInterest = debt.balance * (debt.interestRate / 100 / 12);
      let paymentAmount = Math.min(debt.minimumPayment, debt.balance + monthlyInterest);
      
      remainingPayment -= paymentAmount;
      
      // Calculate principal and interest portions
      const interestPortion = Math.min(monthlyInterest, paymentAmount);
      const principalPortion = paymentAmount - interestPortion;
      
      // Update debt balance
      debt.balance = Math.max(0, debt.balance - principalPortion);
      
      // Record payment
      monthlyPlan.payments.push({
        debtId: debt.id,
        amount: paymentAmount,
        interestPaid: interestPortion,
        principalPaid: principalPortion,
        remainingBalance: debt.balance
      });
      
      // Check if debt is paid off this month
      if (debt.balance === 0) {
        monthlyPlan.debtsCompleted.push(debt.id);
      }
    }
    
    // Then, allocate any remaining payment to highest priority debt with balance
    if (remainingPayment > 0) {
      // Re-sort debts based on strategy in case priorities changed
      sortDebtsByStrategy(workingDebts, strategy);
      
      for (const debt of workingDebts) {
        if (debt.balance <= 0 || remainingPayment <= 0) continue;
        
        // Calculate how much more we can allocate to this debt
        const additionalPayment = Math.min(remainingPayment, debt.balance);
        remainingPayment -= additionalPayment;
        
        // Find the payment record for this debt
        const paymentRecord = monthlyPlan.payments.find(p => p.debtId === debt.id);
        
        if (paymentRecord) {
          // Update the payment record
          paymentRecord.amount += additionalPayment;
          paymentRecord.principalPaid += additionalPayment;
          paymentRecord.remainingBalance = Math.max(0, paymentRecord.remainingBalance - additionalPayment);
          
          // Check if debt is now paid off
          if (paymentRecord.remainingBalance === 0 && !monthlyPlan.debtsCompleted.includes(debt.id)) {
            monthlyPlan.debtsCompleted.push(debt.id);
          }
        } else {
          // This is a safety case that shouldn't happen if the logic is correct
          debt.balance = Math.max(0, debt.balance - additionalPayment);
          
          monthlyPlan.payments.push({
            debtId: debt.id,
            amount: additionalPayment,
            interestPaid: 0,
            principalPaid: additionalPayment,
            remainingBalance: debt.balance
          });
          
          if (debt.balance === 0) {
            monthlyPlan.debtsCompleted.push(debt.id);
          }
        }
      }
    }
    
    // Calculate monthly totals
    monthlyPlan.totalPaid = monthlyPlan.payments.reduce((sum, p) => sum + p.amount, 0);
    monthlyPlan.totalInterestPaid = monthlyPlan.payments.reduce((sum, p) => sum + p.interestPaid, 0);
    monthlyPlan.totalPrincipalPaid = monthlyPlan.payments.reduce((sum, p) => sum + p.principalPaid, 0);
    monthlyPlan.totalRemainingBalance = monthlyPlan.payments.reduce((sum, p) => sum + p.remainingBalance, 0);
    
    // Update running totals
    totalInterestPaid += monthlyPlan.totalInterestPaid;
    totalPrincipalPaid += monthlyPlan.totalPrincipalPaid;
    
    // Add to plans array
    monthlyPlans.push(monthlyPlan);
    
    // Check if all debts are paid off
    allPaidOff = workingDebts.every(debt => debt.balance === 0);
  }
  
  // Create payment plan
  const paymentPlan: PaymentPlan = {
    strategy,
    totalMonths: month,
    totalPaid: totalInterestPaid + totalPrincipalPaid,
    totalInterestPaid,
    totalPrincipalPaid,
    monthlyPlans,
    payoffDate: currentDate.toISOString(),
    monthlyPayment: totalMonthlyPayment
  };
  
  return paymentPlan;
};

/**
 * Calculate the impact of an extra payment on the debt payoff timeline
 */
export const calculateExtraPaymentImpact = (
  debts: Debt[],
  extraPaymentAmount: number,
  targetDebtId: string,
  strategy: PaymentStrategy = 'avalanche'
): ExtraPaymentImpact => {
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  if (extraPaymentAmount <= 0) {
    throw new Error('Extra payment amount must be greater than zero');
  }
  
  // Calculate baseline payment plan
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const baselinePlan = calculatePaymentPlan(debts, totalMinPayment, strategy);
  
  // Calculate modified plan with extra payment
  // Find the target debt
  const targetDebtIndex = debts.findIndex(d => d.id === targetDebtId);
  if (targetDebtIndex === -1) {
    throw new Error('Target debt not found');
  }
  
  // Clone the debts array
  const modifiedDebts = JSON.parse(JSON.stringify(debts));
  
  // Apply one-time extra payment to target debt's balance
  modifiedDebts[targetDebtIndex].balance = Math.max(0, modifiedDebts[targetDebtIndex].balance - extraPaymentAmount);
  
  // Calculate new payment plan
  const modifiedPlan = calculatePaymentPlan(modifiedDebts, totalMinPayment, strategy);
  
  // Calculate the impact
  const impact: ExtraPaymentImpact = {
    originalPayoffDate: baselinePlan.payoffDate,
    newPayoffDate: modifiedPlan.payoffDate,
    originalTotalInterest: baselinePlan.totalInterestPaid,
    newTotalInterest: modifiedPlan.totalInterestPaid,
    interestSaved: baselinePlan.totalInterestPaid - modifiedPlan.totalInterestPaid,
    monthsSaved: baselinePlan.totalMonths - modifiedPlan.totalMonths
  };
  
  return impact;
};

/**
 * Calculate consolidation options for the provided debts
 */
export const calculateConsolidationOptions = (
  debts: Debt[],
  options: { name: string; interestRate: number; termMonths: number }[]
): ConsolidationOption[] => {
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  // Calculate total debt amount
  const totalDebtAmount = debts.reduce((sum, debt) => sum + debt.balance, 0);
  
  // Current debt scenario
  const currentTotalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const currentPaymentPlan = calculatePaymentPlan(debts, currentTotalMinPayment, 'avalanche');
  
  // Calculate options
  return options.map((option, index) => {
    // Calculate monthly payment for this option using the formula for monthly loan payment
    const monthlyInterestRate = option.interestRate / 100 / 12;
    
    let monthlyPayment;
    if (monthlyInterestRate === 0) {
      // For 0% interest (like balance transfers)
      monthlyPayment = totalDebtAmount / option.termMonths;
    } else {
      // For regular loans with interest
      monthlyPayment = 
        (totalDebtAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, option.termMonths)) / 
        (Math.pow(1 + monthlyInterestRate, option.termMonths) - 1);
    }
    
    // Calculate total interest
    const totalPayments = monthlyPayment * option.termMonths;
    const totalInterestPaid = totalPayments - totalDebtAmount;
    
    // Calculate payoff date
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + option.termMonths);
    
    // Compare to current scenario
    const interestSaved = currentPaymentPlan.totalInterestPaid - totalInterestPaid;
    
    return {
      id: `option-${index}`,
      name: option.name,
      interestRate: option.interestRate,
      termMonths: option.termMonths,
      monthlyPayment,
      totalInterestPaid,
      payoffDate: payoffDate.toISOString(),
      interestSaved
    };
  });
};

/**
 * Helper function to sort debts based on the selected strategy
 */
function sortDebtsByStrategy(debts: Debt[], strategy: PaymentStrategy): void {
  if (strategy === 'avalanche') {
    // Sort by highest interest rate first
    debts.sort((a, b) => {
      // Primary sort: interest rate (descending)
      if (b.interestRate !== a.interestRate) {
        return b.interestRate - a.interestRate;
      }
      // Secondary sort: balance (ascending)
      return a.balance - b.balance;
    });
  } else if (strategy === 'snowball') {
    // Sort by lowest balance first
    debts.sort((a, b) => {
      // Primary sort: balance (ascending)
      if (a.balance !== b.balance) {
        return a.balance - b.balance;
      }
      // Secondary sort: interest rate (descending)
      return b.interestRate - a.interestRate;
    });
  }
  // For 'equal' strategy, order doesn't matter
}
