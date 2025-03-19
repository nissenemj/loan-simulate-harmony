
import { Loan, calculateLoan } from './loanCalculations';
import { CreditCard, calculateCreditCard } from './creditCardCalculations';

export type DebtType = 'loan' | 'credit-card';
export type PrioritizationMethod = 'avalanche' | 'snowball';

export interface DebtItem {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  interestRate: number;
  minPayment: number;
  remainingTerm?: number; // for loans
  isActive: boolean;
}

export interface RepaymentPlan {
  monthlyAllocation: {
    id: string;
    name: string;
    type: DebtType;
    minPayment: number;
    extraPayment: number;
    totalPayment: number;
  }[];
  timeline: {
    month: number;
    debts: {
      id: string;
      name: string;
      remainingBalance: number;
      payment: number;
      interestPaid: number;
    }[];
    totalRemaining: number;
    totalPaid: number;
    totalInterestPaid: number;
  }[];
  totalMonths: number;
  totalInterestPaid: number;
  isViable: boolean;
  insufficientBudgetMessage?: string;
}

/**
 * Converts Loan objects to DebtItem format
 */
export const convertLoansToDebtItems = (loans: Loan[]): DebtItem[] => {
  return loans.filter(loan => loan.isActive).map(loan => {
    const calculation = calculateLoan(loan);
    return {
      id: loan.id,
      name: loan.name,
      type: 'loan',
      balance: loan.amount,
      interestRate: loan.interestRate,
      minPayment: calculation.monthlyPayment,
      remainingTerm: loan.termYears * 12,
      isActive: loan.isActive
    };
  });
};

/**
 * Converts CreditCard objects to DebtItem format
 */
export const convertCreditCardsToDebtItems = (cards: CreditCard[]): DebtItem[] => {
  return cards.filter(card => card.isActive).map(card => {
    const calculation = calculateCreditCard(card);
    return {
      id: card.id,
      name: card.name,
      type: 'credit-card',
      balance: card.balance,
      interestRate: card.apr,
      minPayment: calculation.effectivePayment,
      isActive: card.isActive
    };
  });
};

/**
 * Combines loans and credit cards into a single list of debt items
 */
export const combineDebts = (loans: Loan[], creditCards: CreditCard[]): DebtItem[] => {
  const loanItems = convertLoansToDebtItems(loans);
  const cardItems = convertCreditCardsToDebtItems(creditCards);
  return [...loanItems, ...cardItems];
};

/**
 * Prioritizes debts according to the selected method
 */
export const prioritizeDebts = (
  debts: DebtItem[],
  method: PrioritizationMethod = 'avalanche'
): DebtItem[] => {
  if (debts.length === 0) return [];
  
  const activeDebts = debts.filter(debt => debt.isActive && debt.balance > 0);
  
  return [...activeDebts].sort((a, b) => {
    if (method === 'avalanche') {
      // Highest interest rate first
      return b.interestRate - a.interestRate;
    } else {
      // Smallest balance first
      return a.balance - b.balance;
    }
  });
};

/**
 * Generates a repayment plan based on debts and monthly budget
 */
export const generateRepaymentPlan = (
  debts: DebtItem[],
  monthlyBudget: number,
  method: PrioritizationMethod = 'avalanche'
): RepaymentPlan => {
  // Filter only active debts with positive balances
  const activeDebts = debts.filter(debt => debt.isActive && debt.balance > 0);
  
  // Calculate total minimum payments
  const totalMinPayments = activeDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  
  // Check if budget is sufficient
  if (monthlyBudget < totalMinPayments) {
    return {
      monthlyAllocation: [],
      timeline: [],
      totalMonths: 0,
      totalInterestPaid: 0,
      isViable: false,
      insufficientBudgetMessage: `Budget is insufficient. You need at least ${totalMinPayments.toFixed(2)} € to cover minimum payments.`
    };
  }
  
  // Calculate extra budget available after minimum payments
  const extraBudget = monthlyBudget - totalMinPayments;
  
  // Prioritize debts
  const prioritizedDebts = prioritizeDebts(activeDebts, method);
  
  // Initialize monthly allocation with minimum payments for all debts
  const monthlyAllocation = activeDebts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));
  
  // Allocate extra budget to highest priority debts
  let remainingExtra = extraBudget;
  
  // Loop through prioritized debts and allocate extra payments
  for (const priorityDebt of prioritizedDebts) {
    if (remainingExtra <= 0) break;
    
    const allocation = monthlyAllocation.find(a => a.id === priorityDebt.id);
    if (allocation) {
      allocation.extraPayment = remainingExtra;
      allocation.totalPayment = allocation.minPayment + allocation.extraPayment;
      // All remaining budget goes to the highest priority debt
      remainingExtra = 0;
    }
  }
  
  // Simulate repayment over time with accurate interest calculation
  const timeline = simulateRepayment(activeDebts, monthlyAllocation, method);
  
  // Calculate totals
  const totalMonths = timeline.length;
  const totalInterestPaid = timeline.reduce((sum, month) => 
    sum + month.debts.reduce((monthSum, debt) => monthSum + debt.interestPaid, 0), 0);
  
  return {
    monthlyAllocation,
    timeline,
    totalMonths,
    totalInterestPaid,
    isViable: true
  };
};

/**
 * Simulates debt repayment month by month with improved interest calculation
 * and proper implementation of the snowball effect
 */
const simulateRepayment = (
  initialDebts: DebtItem[],
  initialAllocation: RepaymentPlan['monthlyAllocation'],
  method: PrioritizationMethod
): RepaymentPlan['timeline'] => {
  // Deep clone debts to avoid mutating the original
  let currentDebts = initialDebts.map(debt => ({...debt}));
  
  // Initialize allocation by copying the initial allocation
  let currentAllocation = [...initialAllocation];
  
  const timeline: RepaymentPlan['timeline'] = [];
  
  // Simulate until all debts are paid off
  let month = 1;
  const MAX_MONTHS = 1200; // 100 years safety limit
  
  while (currentDebts.some(debt => debt.balance > 0) && month <= MAX_MONTHS) {
    const monthData = {
      month,
      debts: [] as { id: string; name: string; remainingBalance: number; payment: number; interestPaid: number; }[],
      totalRemaining: 0,
      totalPaid: 0,
      totalInterestPaid: 0
    };
    
    // Get debts that still have balance
    const remainingDebts = currentDebts.filter(debt => debt.balance > 0);
    
    // Apply payments to each debt
    for (const debt of remainingDebts) {
      // Get allocation for this debt
      const allocation = currentAllocation.find(a => a.id === debt.id);
      if (!allocation) continue;
      
      // Calculate monthly interest - critical fix for correct interest calculation
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestForMonth = debt.balance * monthlyInterestRate;
      
      // Calculate principal payment
      const totalPayment = allocation.totalPayment;
      let principalPayment = totalPayment - interestForMonth;
      
      // Ensure principal payment doesn't exceed the balance
      principalPayment = Math.min(principalPayment, debt.balance);
      
      // Calculate actual payment (interest + principal)
      const actualPayment = principalPayment + interestForMonth;
      
      // Update debt balance
      debt.balance = Math.max(0, debt.balance - principalPayment);
      
      // Add to month data
      monthData.debts.push({
        id: debt.id,
        name: debt.name,
        remainingBalance: debt.balance,
        payment: actualPayment,
        interestPaid: interestForMonth
      });
      
      monthData.totalPaid += actualPayment;
      monthData.totalInterestPaid += interestForMonth;
    }
    
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
    
    // Calculate total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
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
  
  return timeline;
};
