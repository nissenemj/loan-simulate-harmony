import { Debt, PaymentStrategy, PaymentPlan, MonthlyPaymentPlan, Payment, ExtraPaymentImpact, ConsolidationOption, ScenarioDefinition, ScenarioComparison } from './types';
import { addMonths, format } from 'date-fns';

/**
 * Calculate payment plan for a list of debts
 * 
 * @param debts List of debts
 * @param totalMonthlyPayment Total monthly payment amount
 * @param strategy Payment strategy (avalanche, snowball)
 * @returns Payment plan details
 */
export function calculatePaymentPlan(
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: PaymentStrategy
): PaymentPlan {
  // Validate input
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  if (totalMonthlyPayment < totalMinimumPayment) {
    throw new Error('Total monthly payment must be at least equal to the sum of minimum payments');
  }
  
  // Create a copy of debts to work with
  let workingDebts = debts.map(debt => ({
    ...debt,
    remainingBalance: debt.balance
  }));
  
  // Sort debts based on strategy
  if (strategy === 'avalanche') {
    // Sort by interest rate (highest first)
    workingDebts.sort((a, b) => b.interestRate - a.interestRate);
  } else if (strategy === 'snowball') {
    // Sort by balance (lowest first)
    workingDebts.sort((a, b) => a.balance - b.balance);
  }
  
  const today = new Date();
  let currentDate = today;
  let month = 0;
  let totalPaid = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  const monthlyPlans: MonthlyPaymentPlan[] = [];
  
  // Continue until all debts are paid off
  while (workingDebts.some(debt => debt.remainingBalance > 0)) {
    let monthlyPayment = totalMonthlyPayment;
    let payments: Payment[] = [];
    let debtsCompleted: string[] = [];
    
    // Make minimum payments on all debts
    for (const debt of workingDebts) {
      if (debt.remainingBalance <= 0) continue;
      
      const payment = Math.min(debt.minimumPayment, debt.remainingBalance + (debt.remainingBalance * debt.interestRate / 1200));
      monthlyPayment -= payment;
      
      // Calculate interest for this month
      const interestAmount = debt.remainingBalance * (debt.interestRate / 100 / 12);
      const principalAmount = payment - interestAmount;
      
      // Update debt remaining balance
      debt.remainingBalance = Math.max(0, debt.remainingBalance - principalAmount);
      
      // Record payment
      payments.push({
        debtId: debt.id,
        amount: payment,
        interestPaid: interestAmount,
        principalPaid: principalAmount,
        remainingBalance: debt.remainingBalance
      });
      
      // Check if debt is paid off
      if (debt.remainingBalance === 0) {
        debtsCompleted.push(debt.id);
      }
      
      // Update totals
      totalPaid += payment;
      totalInterestPaid += interestAmount;
      totalPrincipalPaid += principalAmount;
    }
    
    // Apply any remaining payment to the highest priority debt
    if (monthlyPayment > 0) {
      const unpaidDebts = workingDebts.filter(debt => debt.remainingBalance > 0);
      
      if (unpaidDebts.length > 0) {
        const targetDebt = unpaidDebts[0]; // First debt in the sorted list
        const existingPayment = payments.find(p => p.debtId === targetDebt.id);
        
        if (existingPayment) {
          const additionalInterest = 0; // No additional interest for extra payments
          const additionalPrincipal = monthlyPayment;
          
          // Update remaining balance
          targetDebt.remainingBalance = Math.max(0, targetDebt.remainingBalance - additionalPrincipal);
          
          // Update payment
          existingPayment.amount += monthlyPayment;
          existingPayment.principalPaid += additionalPrincipal;
          existingPayment.remainingBalance = targetDebt.remainingBalance;
          
          // Check if debt is now paid off
          if (targetDebt.remainingBalance === 0 && !debtsCompleted.includes(targetDebt.id)) {
            debtsCompleted.push(targetDebt.id);
          }
          
          // Update totals
          totalPaid += monthlyPayment;
          totalInterestPaid += additionalInterest;
          totalPrincipalPaid += additionalPrincipal;
        }
      }
    }
    
    // Increment month
    month++;
    currentDate = addMonths(today, month);
    
    // Add monthly plan
    monthlyPlans.push({
      month,
      date: format(currentDate, 'yyyy-MM-dd'),
      payments,
      totalPaid: payments.reduce((sum, p) => sum + p.amount, 0),
      totalInterestPaid: payments.reduce((sum, p) => sum + p.interestPaid, 0),
      totalPrincipalPaid: payments.reduce((sum, p) => sum + p.principalPaid, 0),
      totalRemainingBalance: workingDebts.reduce((sum, d) => sum + d.remainingBalance, 0),
      debtsCompleted
    });
    
    // Break if taking too long (prevent infinite loops)
    if (month > 1200) { // 100 years
      break;
    }
  }
  
  // Calculate payoff date
  const payoffDate = format(addMonths(today, month), 'yyyy-MM-dd');
  
  return {
    strategy,
    totalMonths: month,
    totalPaid,
    totalInterestPaid,
    totalPrincipalPaid,
    monthlyPlans,
    payoffDate,
    monthlyPayment: totalMonthlyPayment
  };
}

/**
 * Calculate the impact of an extra payment on a specific debt
 * 
 * @param debts List of debts
 * @param extraAmount Extra payment amount
 * @param targetDebtId ID of the debt to apply extra payment to
 * @param strategy Payment strategy
 * @returns Impact details showing savings in time and interest
 */
export function calculateExtraPaymentImpact(
  debts: Debt[],
  extraAmount: number,
  targetDebtId: string,
  strategy: PaymentStrategy
): ExtraPaymentImpact {
  // Validate inputs
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  if (extraAmount <= 0) {
    throw new Error('Extra payment amount must be greater than zero');
  }
  
  const targetDebt = debts.find(debt => debt.id === targetDebtId);
  if (!targetDebt) {
    throw new Error('Target debt not found');
  }
  
  // Calculate total minimum payment
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate original plan
  const originalPlan = calculatePaymentPlan(debts, totalMinimumPayment, strategy);
  
  // Create modified debts with extra payment for target debt
  const modifiedDebts = debts.map(debt => {
    if (debt.id === targetDebtId) {
      return {
        ...debt,
        minimumPayment: debt.minimumPayment + extraAmount
      };
    }
    return debt;
  });
  
  // Calculate new plan
  const newPlan = calculatePaymentPlan(modifiedDebts, totalMinimumPayment + extraAmount, strategy);
  
  return {
    originalPayoffDate: originalPlan.payoffDate,
    newPayoffDate: newPlan.payoffDate,
    originalTotalInterest: originalPlan.totalInterestPaid,
    newTotalInterest: newPlan.totalInterestPaid,
    interestSaved: originalPlan.totalInterestPaid - newPlan.totalInterestPaid,
    monthsSaved: originalPlan.totalMonths - newPlan.totalMonths
  };
}

/**
 * Calculate debt consolidation options
 * 
 * @param debts List of debts
 * @param options Consolidation options with terms
 * @returns List of consolidation options with calculated impact
 */
export function calculateConsolidationOptions(
  debts: Debt[],
  options: { name: string; interestRate: number; termMonths: number }[]
): ConsolidationOption[] {
  // Validate inputs
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  if (options.length === 0) {
    throw new Error('No consolidation options provided');
  }
  
  // Calculate total debt amount
  const totalDebtAmount = debts.reduce((sum, debt) => sum + debt.balance, 0);
  
  // Calculate original payments and interest
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const originalPlan = calculatePaymentPlan(debts, totalMinimumPayment, 'avalanche');
  
  const today = new Date();
  
  // Calculate consolidation options
  return options.map(option => {
    // Calculate monthly payment for consolidation loan
    const monthlyInterestRate = option.interestRate / 100 / 12;
    const monthlyPayment = monthlyInterestRate === 0
      ? totalDebtAmount / option.termMonths // For 0% options like balance transfers
      : (totalDebtAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -option.termMonths));
    
    // Calculate total interest paid
    const totalInterestPaid = (monthlyPayment * option.termMonths) - totalDebtAmount;
    
    // Calculate payoff date
    const payoffDate = format(addMonths(today, option.termMonths), 'yyyy-MM-dd');
    
    // Calculate interest savings compared to current plan
    const interestSaved = originalPlan.totalInterestPaid - totalInterestPaid;
    
    return {
      id: `option-${option.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: option.name,
      interestRate: option.interestRate,
      termMonths: option.termMonths,
      monthlyPayment,
      totalInterestPaid,
      payoffDate,
      interestSaved
    };
  });
}

/**
 * Compare different debt payoff scenarios
 * 
 * @param debts List of debts
 * @param scenarios Different scenarios to compare
 * @returns Comparison results for each scenario
 */
export function compareScenarios(
  debts: Debt[],
  scenarios: ScenarioDefinition[]
): ScenarioComparison[] {
  // Validate inputs
  if (debts.length === 0) {
    throw new Error('No debts provided');
  }
  
  if (scenarios.length === 0) {
    throw new Error('No scenarios provided');
  }
  
  // Calculate total minimum payment
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Create a baseline plan for comparison (minimum payments with avalanche strategy)
  const baselinePlan = calculatePaymentPlan(debts, totalMinimumPayment, 'avalanche');
  
  // Calculate results for each scenario
  return scenarios.map(scenario => {
    const totalPayment = totalMinimumPayment + scenario.additionalMonthlyPayment;
    const plan = calculatePaymentPlan(debts, totalPayment, scenario.strategy);
    
    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      totalMonths: plan.totalMonths,
      totalPaid: plan.totalPaid,
      totalInterestPaid: plan.totalInterestPaid,
      monthlyPayment: plan.monthlyPayment,
      payoffDate: plan.payoffDate,
      interestSaved: baselinePlan.totalInterestPaid - plan.totalInterestPaid
    };
  });
}
