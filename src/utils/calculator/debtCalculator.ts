
import { Debt, PaymentStrategy, PaymentPlan, MonthlyPaymentPlan, DebtPayment, ConsolidationOption, ScenarioComparison, ExtraPaymentImpact } from './types';
import { addMonths, format } from 'date-fns';

/**
 * Calculate a complete debt payment plan based on the provided debts and strategy
 * 
 * @param debts - Array of debt objects
 * @param totalMonthlyPayment - Total amount to pay each month across all debts
 * @param strategy - Payment strategy (avalanche, snowball, or custom)
 * @param customOrder - Custom order of debt IDs (only used with custom strategy)
 * @returns Complete payment plan with monthly breakdown
 */
export function calculatePaymentPlan(
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: PaymentStrategy,
  customOrder?: string[]
): PaymentPlan {
  // Validate inputs
  if (!debts.length) {
    throw new Error('No debts provided');
  }
  
  if (totalMonthlyPayment <= 0) {
    throw new Error('Total monthly payment must be greater than zero');
  }
  
  // Calculate minimum payment sum
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Ensure total monthly payment is at least the sum of minimum payments
  if (totalMonthlyPayment < minimumPaymentSum) {
    throw new Error('Total monthly payment must be at least the sum of all minimum payments');
  }
  
  // Sort debts based on strategy
  const sortedDebts = sortDebtsByStrategy(debts, strategy, customOrder);
  
  // Create working copy of debts to track remaining balances
  let workingDebts = sortedDebts.map(debt => ({
    ...debt,
    remainingBalance: debt.balance
  }));
  
  // Initialize payment plan
  const monthlyPlans: MonthlyPaymentPlan[] = [];
  let currentMonth = 0;
  let totalInterestPaid = 0;
  let totalPaid = 0;
  let totalPrincipalPaid = 0;
  
  // Continue until all debts are paid off
  while (workingDebts.some(debt => debt.remainingBalance > 0)) {
    // Calculate date for this month
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + currentMonth);
    
    // Initialize monthly payment plan
    const monthlyPlan: MonthlyPaymentPlan = {
      month: currentMonth,
      date: currentDate.toISOString().split('T')[0],
      payments: [],
      totalPaid: 0,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      totalRemainingBalance: 0,
      debtsCompleted: []
    };
    
    // Calculate how much money is available after minimum payments
    let remainingPayment = totalMonthlyPayment;
    
    // First, make minimum payments on all debts
    workingDebts.forEach(debt => {
      if (debt.remainingBalance > 0) {
        const minimumPayment = Math.min(debt.minimumPayment, debt.remainingBalance);
        remainingPayment -= minimumPayment;
      }
    });
    
    // Then, allocate remaining payment to debts according to strategy
    const payments: DebtPayment[] = [];
    
    // Process each debt
    for (const debt of workingDebts) {
      if (debt.remainingBalance <= 0) {
        // Skip paid off debts
        continue;
      }
      
      // Calculate interest for this month
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestAmount = debt.remainingBalance * monthlyInterestRate;
      
      // Start with minimum payment
      let paymentAmount = Math.min(debt.minimumPayment, debt.remainingBalance + interestAmount);
      
      // Add additional payment if this is the highest priority debt
      if (remainingPayment > 0 && debt.id === sortedDebts[0].id) {
        const additionalPayment = Math.min(remainingPayment, debt.remainingBalance + interestAmount - paymentAmount);
        paymentAmount += additionalPayment;
        remainingPayment -= additionalPayment;
      }
      
      // Calculate principal payment
      const principalAmount = Math.max(0, paymentAmount - interestAmount);
      
      // Update remaining balance
      const newRemainingBalance = Math.max(0, debt.remainingBalance - principalAmount);
      
      // Create payment record
      const payment: DebtPayment = {
        debtId: debt.id,
        amount: paymentAmount,
        interestPaid: interestAmount,
        principalPaid: principalAmount,
        remainingBalance: newRemainingBalance
      };
      
      payments.push(payment);
      
      // Update monthly totals
      monthlyPlan.totalPaid += paymentAmount;
      monthlyPlan.totalInterestPaid += interestAmount;
      monthlyPlan.totalPrincipalPaid += principalAmount;
      monthlyPlan.totalRemainingBalance += newRemainingBalance;
      
      // Check if debt is paid off this month
      if (newRemainingBalance === 0) {
        monthlyPlan.debtsCompleted.push(debt.id);
      }
      
      // Update working debt
      debt.remainingBalance = newRemainingBalance;
    }
    
    // If any debts were paid off, resort the list for next month
    if (monthlyPlan.debtsCompleted.length > 0) {
      workingDebts = workingDebts
        .filter(debt => debt.remainingBalance > 0)
        .sort((a, b) => {
          if (strategy === 'avalanche') {
            return b.interestRate - a.interestRate;
          } else if (strategy === 'snowball') {
            return a.remainingBalance - b.remainingBalance;
          } else if (strategy === 'custom' && customOrder) {
            return customOrder.indexOf(a.id) - customOrder.indexOf(b.id);
          }
          return 0;
        });
    }
    
    // Add payments to monthly plan
    monthlyPlan.payments = payments;
    
    // Add monthly plan to overall plan
    monthlyPlans.push(monthlyPlan);
    
    // Update totals
    totalInterestPaid += monthlyPlan.totalInterestPaid;
    totalPaid += monthlyPlan.totalPaid;
    totalPrincipalPaid += monthlyPlan.totalPrincipalPaid;
    
    // Increment month
    currentMonth++;
    
    // Safety check to prevent infinite loops
    if (currentMonth > 1200) { // 100 years
      throw new Error('Payment calculation exceeded maximum number of months');
    }
  }
  
  // Calculate payoff date
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + currentMonth - 1);
  
  // Return complete payment plan
  return {
    monthlyPlans,
    totalMonths: currentMonth,
    totalInterestPaid,
    totalPaid,
    totalPrincipalPaid,
    payoffDate: payoffDate.toISOString().split('T')[0],
    strategy,
    monthlyPayment: totalMonthlyPayment
  };
}

/**
 * Sort debts based on the selected payment strategy
 * 
 * @param debts - Array of debt objects
 * @param strategy - Payment strategy (avalanche, snowball, or custom)
 * @param customOrder - Custom order of debt IDs (only used with custom strategy)
 * @returns Sorted array of debts
 */
export function sortDebtsByStrategy(
  debts: Debt[],
  strategy: PaymentStrategy,
  customOrder?: string[]
): Debt[] {
  const debtsCopy = [...debts];
  
  if (strategy === 'avalanche') {
    // Sort by interest rate (highest to lowest)
    return debtsCopy.sort((a, b) => b.interestRate - a.interestRate);
  } else if (strategy === 'snowball') {
    // Sort by balance (lowest to highest)
    return debtsCopy.sort((a, b) => a.balance - b.balance);
  } else if (strategy === 'custom' && customOrder) {
    // Sort by custom order
    return debtsCopy.sort((a, b) => {
      const indexA = customOrder.indexOf(a.id);
      const indexB = customOrder.indexOf(b.id);
      return indexA - indexB;
    });
  } else if (strategy === 'equal') {
    // No specific sorting for equal payments
    return debtsCopy;
  }
  
  // Default to avalanche if strategy is invalid
  return debtsCopy.sort((a, b) => b.interestRate - a.interestRate);
}

/**
 * Calculate the impact of an extra payment on a debt
 * 
 * @param debts - Array of debt objects
 * @param extraPayment - Extra payment amount
 * @param debtId - ID of the debt to apply the extra payment to
 * @param strategy - Payment strategy
 * @returns Impact of the extra payment
 */
export function calculateExtraPaymentImpact(
  debts: Debt[],
  extraPayment: number,
  debtId: string,
  strategy: PaymentStrategy
): ExtraPaymentImpact {
  // Calculate minimum payment sum
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate original payment plan
  const originalPlan = calculatePaymentPlan(debts, minimumPaymentSum, strategy);
  
  // Create modified debts with extra payment
  const modifiedDebts = debts.map(debt => {
    if (debt.id === debtId) {
      return {
        ...debt,
        balance: Math.max(0, debt.balance - extraPayment)
      };
    }
    return debt;
  });
  
  // Calculate new payment plan
  const newPlan = calculatePaymentPlan(modifiedDebts, minimumPaymentSum, strategy);
  
  // Calculate impact
  return {
    amount: extraPayment,
    originalPayoffDate: originalPlan.payoffDate,
    newPayoffDate: newPlan.payoffDate,
    originalTotalInterest: originalPlan.totalInterestPaid,
    newTotalInterest: newPlan.totalInterestPaid,
    monthsSaved: originalPlan.totalMonths - newPlan.totalMonths,
    interestSaved: originalPlan.totalInterestPaid - newPlan.totalInterestPaid
  };
}

/**
 * Calculate debt consolidation options
 * 
 * @param debts - Array of debt objects
 * @param consolidationOptions - Array of available consolidation options (interest rate and term)
 * @returns Array of consolidation options with calculated impact
 */
export function calculateConsolidationOptions(
  debts: Debt[],
  consolidationOptions: { name: string; interestRate: number; termMonths: number }[]
): ConsolidationOption[] {
  // Calculate total debt balance
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  
  // Calculate minimum payment sum
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate original payment plan using avalanche strategy
  const originalPlan = calculatePaymentPlan(debts, minimumPaymentSum, 'avalanche');
  
  // Calculate consolidation options
  return consolidationOptions.map(option => {
    // Calculate monthly payment for consolidation loan
    const monthlyInterestRate = option.interestRate / 100 / 12;
    
    // Handle zero interest rate case separately to avoid division by zero
    const monthlyPayment = monthlyInterestRate === 0
      ? totalBalance / option.termMonths
      : (totalBalance * monthlyInterestRate * 
        Math.pow(1 + monthlyInterestRate, option.termMonths) / 
        (Math.pow(1 + monthlyInterestRate, option.termMonths) - 1));
    
    // Calculate total interest paid
    const totalPaid = monthlyPayment * option.termMonths;
    const totalInterestPaid = totalPaid - totalBalance;
    
    // Calculate payoff date
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + option.termMonths);
    
    // Calculate savings compared to original plan
    const interestSaved = originalPlan.totalInterestPaid - totalInterestPaid;
    const moneySaved = originalPlan.totalPaid - totalPaid;
    const monthsSaved = originalPlan.totalMonths - option.termMonths;
    
    return {
      id: `consolidation-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: option.name,
      interestRate: option.interestRate,
      termMonths: option.termMonths,
      monthlyPayment,
      totalInterestPaid,
      totalPaid,
      payoffDate: payoffDate.toISOString().split('T')[0],
      interestSaved,
      moneySaved,
      monthsSaved
    };
  });
}

/**
 * Compare different payment scenarios
 * 
 * @param debts - Array of debt objects
 * @param scenarios - Array of payment scenarios to compare
 * @returns Array of scenario comparison results
 */
export function compareScenarios(
  debts: Debt[],
  scenarios: {
    id: string;
    name: string;
    additionalMonthlyPayment: number;
    strategy: PaymentStrategy;
    customPaymentOrder?: string[];
  }[]
): ScenarioComparison[] {
  // Calculate minimum payment sum
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate baseline scenario (minimum payments with avalanche strategy)
  const baselineScenario = calculatePaymentPlan(debts, minimumPaymentSum, 'avalanche');
  
  // Calculate and compare each scenario
  return scenarios.map(scenario => {
    const totalMonthlyPayment = minimumPaymentSum + scenario.additionalMonthlyPayment;
    
    const scenarioPlan = calculatePaymentPlan(
      debts,
      totalMonthlyPayment,
      scenario.strategy,
      scenario.customPaymentOrder
    );
    
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      totalMonths: scenarioPlan.totalMonths,
      totalInterestPaid: scenarioPlan.totalInterestPaid,
      totalPaid: scenarioPlan.totalPaid,
      payoffDate: scenarioPlan.payoffDate,
      monthsSaved: baselineScenario.totalMonths - scenarioPlan.totalMonths,
      interestSaved: baselineScenario.totalInterestPaid - scenarioPlan.totalInterestPaid,
      moneySaved: baselineScenario.totalPaid - scenarioPlan.totalPaid
    };
  });
}
