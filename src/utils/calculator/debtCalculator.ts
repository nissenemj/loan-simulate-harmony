import { Debt, PaymentStrategy, PaymentPlan, MonthlyPaymentPlan, DebtPayment } from './types';

// Optimized helper function to calculate monthly interest
const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
  return balance * (annualRate / 100 / 12);
};

export function calculatePaymentPlan(
  debts: Debt[],
  totalMonthlyPayment: number,
  strategy: PaymentStrategy,
  customOrder?: string[]
): PaymentPlan {
  // Validation and early returns
  if (!debts.length) throw new Error('No debts provided');
  if (totalMonthlyPayment <= 0) throw new Error('Total monthly payment must be greater than zero');

  // Calculate minimum payment sum once
  const minimumPaymentSum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  if (totalMonthlyPayment < minimumPaymentSum) {
    throw new Error('Total monthly payment must be at least the sum of all minimum payments');
  }

  // Create optimized working copy of debts - changed from let to const
  const workingDebts = sortDebtsByStrategy(debts, strategy, customOrder).map(debt => ({
    id: debt.id,
    minimumPayment: debt.minimumPayment,
    interestRate: debt.interestRate,
    remainingBalance: debt.balance
  }));

  const monthlyPlans: MonthlyPaymentPlan[] = [];
  let currentMonth = 0;
  let totalInterestPaid = 0;
  let totalPaid = 0;

  // Pre-calculate start date
  const startDate = new Date();

  while (workingDebts.some(debt => debt.remainingBalance > 0) && currentMonth < 480) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + currentMonth);

    const monthlyPlan: MonthlyPaymentPlan = {
      month: currentMonth,
      date: monthDate.toISOString().split('T')[0],
      payments: [],
      totalPaid: 0,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      totalRemainingBalance: 0,
      debtsCompleted: []
    };

    let availablePayment = totalMonthlyPayment;
    const activeDebts = workingDebts.filter(debt => debt.remainingBalance > 0);

    // Process each active debt with new logic that distributes all available payment
    for (const debt of activeDebts) {
      const interestAmount = calculateMonthlyInterest(debt.remainingBalance, debt.interestRate);
      const requiredPayment = Math.min(debt.minimumPayment, debt.remainingBalance + interestAmount);
      
      if (availablePayment < requiredPayment) {
        // Guard, ettei maksujen summa mene negatiiviseksi
        throw new Error('Available payment became negative');
      }

      let paymentAmount = requiredPayment;
      availablePayment -= requiredPayment;

      // Käytä jäljellä oleva budjetti nykyiseen velkaan
      if (availablePayment > 0) {
        const maxExtraPayment = debt.remainingBalance + interestAmount - requiredPayment;
        const extraPayment = Math.min(availablePayment, maxExtraPayment);
        paymentAmount += extraPayment;
        availablePayment -= extraPayment;
      }

      const interestPortion = Math.min(interestAmount, paymentAmount);
      const principalPortion = paymentAmount - interestPortion;
      const newBalance = Math.max(0, debt.remainingBalance - principalPortion);

      monthlyPlan.payments.push({
        debtId: debt.id,
        amount: paymentAmount,
        interestPaid: interestPortion,
        principalPaid: principalPortion,
        remainingBalance: newBalance
      });

      // Update totals
      monthlyPlan.totalPaid += paymentAmount;
      monthlyPlan.totalInterestPaid += interestPortion;
      monthlyPlan.totalPrincipalPaid += principalPortion;
      monthlyPlan.totalRemainingBalance += newBalance;

      if (newBalance === 0) {
        monthlyPlan.debtsCompleted.push(debt.id);
      }

      debt.remainingBalance = newBalance;
    }

    monthlyPlans.push(monthlyPlan);
    totalInterestPaid += monthlyPlan.totalInterestPaid;
    totalPaid += monthlyPlan.totalPaid;
    currentMonth++;
  }

  const payoffDate = new Date(startDate);
  payoffDate.setMonth(startDate.getMonth() + currentMonth - 1);

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
    // Calculate monthly payment for consolidation loan - updated to handle 0% interest
    const monthlyInterestRate = option.interestRate / 100 / 12;
    const monthlyPayment =
      monthlyInterestRate === 0
        ? totalBalance / option.termMonths
        : totalBalance * monthlyInterestRate * 
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
