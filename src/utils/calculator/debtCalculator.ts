import { Debt, PaymentStrategy, PaymentPlan, MonthlyPaymentPlan, DebtPayment } from './types';

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
  
  // Continue until all debts are paid off
  while (workingDebts.some(debt => debt.remainingBalance > 0)) {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + currentMonth);
    
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
    
    // Calculate required minimum payments first
    let availablePayment = totalMonthlyPayment;
    const minimumPayments = workingDebts
      .filter(debt => debt.remainingBalance > 0)
      .reduce((total, debt) => total + Math.min(debt.minimumPayment, debt.remainingBalance), 0);
    
    // Ensure we have enough for minimum payments
    if (availablePayment < minimumPayments) {
      throw new Error('Insufficient monthly payment to cover minimum payments');
    }
    
    // Sort active debts by strategy
    const activeDebts = workingDebts
      .filter(debt => debt.remainingBalance > 0)
      .sort((a, b) => {
        if (strategy === 'avalanche') {
          const interestDiff = b.interestRate - a.interestRate;
          return Math.abs(interestDiff) < 0.001 ? a.remainingBalance - b.remainingBalance : interestDiff;
        } else if (strategy === 'snowball') {
          const balanceDiff = a.remainingBalance - b.remainingBalance;
          return Math.abs(balanceDiff) < 0.001 ? b.interestRate - a.interestRate : balanceDiff;
        } else if (strategy === 'custom' && customOrder) {
          return customOrder.indexOf(a.id) - customOrder.indexOf(b.id);
        }
        return b.interestRate - a.interestRate;
      });
    
    const payments: DebtPayment[] = [];
    
    // Process each active debt
    for (const debt of activeDebts) {
      // Calculate interest for this month
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestAmount = debt.remainingBalance * monthlyInterestRate;
      
      // Calculate minimum required payment
      const requiredPayment = Math.min(
        debt.minimumPayment,
        debt.remainingBalance + interestAmount
      );
      
      // Start with minimum payment
      let paymentAmount = requiredPayment;
      availablePayment -= requiredPayment;
      
      // If this is the highest priority debt and we have extra money, add it
      if (debt.id === activeDebts[0].id && availablePayment > 0) {
        const maxAdditionalPayment = debt.remainingBalance + interestAmount - requiredPayment;
        const additionalPayment = Math.min(availablePayment, maxAdditionalPayment);
        paymentAmount += additionalPayment;
        availablePayment -= additionalPayment;
      }
      
      // Calculate how much goes to interest vs principal
      const interestPortion = Math.min(interestAmount, paymentAmount);
      const principalPortion = paymentAmount - interestPortion;
      
      // Calculate new remaining balance
      const newRemainingBalance = Math.max(0, debt.remainingBalance - principalPortion);
      
      // Create payment record
      const payment: DebtPayment = {
        debtId: debt.id,
        amount: paymentAmount,
        interestPaid: interestPortion,
        principalPaid: principalPortion,
        remainingBalance: newRemainingBalance
      };
      
      payments.push(payment);
      
      // Update monthly totals
      monthlyPlan.totalPaid += paymentAmount;
      monthlyPlan.totalInterestPaid += interestPortion;
      monthlyPlan.totalPrincipalPaid += principalPortion;
      monthlyPlan.totalRemainingBalance += newRemainingBalance;
      
      // Check if debt is paid off this month
      if (newRemainingBalance === 0) {
        monthlyPlan.debtsCompleted.push(debt.id);
      }
      
      // Update working debt
      debt.remainingBalance = newRemainingBalance;
    }
    
    // Add payments to monthly plan
    monthlyPlan.payments = payments;
    monthlyPlans.push(monthlyPlan);
    
    // Update totals
    totalInterestPaid += monthlyPlan.totalInterestPaid;
    totalPaid += monthlyPlan.totalPaid;
    
    currentMonth++;
    
    // Safety check
    if (currentMonth > 480) { // 40 years
      throw new Error('Payment calculation exceeded maximum number of months');
    }
  }
  
  // Calculate payoff date
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + currentMonth - 1);
  
  return {
    monthlyPlans,
    totalMonths: currentMonth,
    totalInterestPaid,
    totalPaid,
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
) {
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
    monthsSaved: originalPlan.totalMonths - newPlan.totalMonths,
    interestSaved: originalPlan.totalInterestPaid - newPlan.totalInterestPaid,
    newPayoffDate: newPlan.payoffDate,
    originalTotalInterest: originalPlan.totalInterestPaid,
    newTotalInterest: newPlan.totalInterestPaid
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
) {
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
    const monthlyPayment = totalBalance * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, option.termMonths) / 
      (Math.pow(1 + monthlyInterestRate, option.termMonths) - 1);
    
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
) {
  // Check if there are any debts to analyze
  if (!debts.length) {
    throw new Error('No debts provided for scenario comparison');
  }
  
  // Calculate minimum payment sum
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate baseline scenario (minimum payments with avalanche strategy)
  const baselineScenario = calculatePaymentPlan(debts, minimumPaymentSum, 'avalanche');
  
  // Calculate and compare each scenario
  return scenarios.map(scenario => {
    const totalMonthlyPayment = minimumPaymentSum + scenario.additionalMonthlyPayment;
    
    try {
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
    } catch (error) {
      console.error(`Error calculating scenario ${scenario.name}:`, error);
      // Return a fallback object if calculation fails
      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        totalMonths: 0,
        totalInterestPaid: 0,
        totalPaid: 0,
        payoffDate: new Date().toISOString().split('T')[0],
        monthsSaved: 0,
        interestSaved: 0,
        moneySaved: 0
      };
    }
  });
}
