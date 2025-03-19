
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
  // Calculate total minimum payments
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
  
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
  const prioritizedDebts = prioritizeDebts(debts, method);
  
  // Initialize repayment plan
  const monthlyAllocation = debts.map(debt => ({
    id: debt.id,
    name: debt.name,
    type: debt.type,
    minPayment: debt.minPayment,
    extraPayment: 0,
    totalPayment: debt.minPayment
  }));
  
  // Allocate extra budget to highest priority debt
  if (prioritizedDebts.length > 0 && extraBudget > 0) {
    const highestPriorityDebtId = prioritizedDebts[0].id;
    const allocation = monthlyAllocation.find(a => a.id === highestPriorityDebtId);
    if (allocation) {
      allocation.extraPayment = extraBudget;
      allocation.totalPayment = allocation.minPayment + extraBudget;
    }
  }
  
  // Simulate repayment over time
  const timeline = simulateRepayment(debts, monthlyAllocation, method);
  
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
 * Simulates debt repayment month by month
 */
const simulateRepayment = (
  initialDebts: DebtItem[],
  initialAllocation: RepaymentPlan['monthlyAllocation'],
  method: PrioritizationMethod
): RepaymentPlan['timeline'] => {
  // Deep clone debts to avoid mutating the original
  let currentDebts = initialDebts.map(debt => ({...debt}));
  let currentAllocation = [...initialAllocation];
  const timeline: RepaymentPlan['timeline'] = [];
  
  // Simulate until all debts are paid off
  let month = 1;
  const MAX_MONTHS = 1200; // 100 years safety limit
  
  while (currentDebts.some(debt => debt.balance > 0) && month < MAX_MONTHS) {
    const monthData = {
      month,
      debts: [] as { id: string; name: string; remainingBalance: number; payment: number; interestPaid: number; }[],
      totalRemaining: 0,
      totalPaid: 0,
      totalInterestPaid: 0
    };
    
    // Apply payments to each debt
    currentDebts.forEach(debt => {
      if (debt.balance <= 0) {
        // Already paid off
        monthData.debts.push({
          id: debt.id,
          name: debt.name,
          remainingBalance: 0,
          payment: 0,
          interestPaid: 0
        });
        return;
      }
      
      // Get allocation for this debt
      const allocation = currentAllocation.find(a => a.id === debt.id);
      if (!allocation) return;
      
      // Calculate monthly interest
      const monthlyInterestRate = debt.interestRate / 100 / 12;
      const interestForMonth = debt.balance * monthlyInterestRate;
      
      // Apply payment
      const effectivePayment = Math.min(allocation.totalPayment, debt.balance + interestForMonth);
      const principalPayment = effectivePayment - interestForMonth;
      
      // Update debt balance
      debt.balance = Math.max(0, debt.balance - principalPayment);
      
      // Add to month data
      monthData.debts.push({
        id: debt.id,
        name: debt.name,
        remainingBalance: debt.balance,
        payment: effectivePayment,
        interestPaid: interestForMonth
      });
      
      monthData.totalPaid += effectivePayment;
      monthData.totalInterestPaid += interestForMonth;
    });
    
    // Handle snowball effect - if any debt was paid off this month,
    // reallocate its payment to the highest priority remaining debt
    const paidOffDebts = currentDebts.filter(debt => 
      debt.balance === 0 && 
      monthData.debts.find(d => d.id === debt.id)?.payment !== 0
    );
    
    if (paidOffDebts.length > 0) {
      // Total amount freed up by paid off debts
      const freedUpAmount = paidOffDebts.reduce((sum, debt) => {
        const allocation = currentAllocation.find(a => a.id === debt.id);
        return sum + (allocation?.totalPayment || 0);
      }, 0);
      
      // Find remaining debts and prioritize them
      const remainingDebts = currentDebts.filter(debt => debt.balance > 0);
      const prioritizedRemainingDebts = prioritizeDebts(remainingDebts, method);
      
      // Allocate freed up amount to highest priority remaining debt
      if (prioritizedRemainingDebts.length > 0) {
        const nextDebtId = prioritizedRemainingDebts[0].id;
        const nextDebtAllocation = currentAllocation.find(a => a.id === nextDebtId);
        
        if (nextDebtAllocation) {
          nextDebtAllocation.extraPayment += freedUpAmount;
          nextDebtAllocation.totalPayment = nextDebtAllocation.minPayment + nextDebtAllocation.extraPayment;
        }
      }
    }
    
    // Update total remaining balance
    monthData.totalRemaining = currentDebts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Add month to timeline
    timeline.push(monthData);
    
    // Check if all debts are paid off
    if (monthData.totalRemaining <= 0) {
      break;
    }
    
    month++;
  }
  
  return timeline;
};
