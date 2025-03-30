
import { Loan } from '../loanCalculations';
import { CreditCard } from '../creditCardCalculations';

export type DebtType = 'loan' | 'credit-card';
export type PrioritizationMethod = 'avalanche' | 'snowball' | 'equal';

export interface DebtItem {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  interestRate: number;
  minPayment: number;
  remainingTerm?: number; // for loans
  isActive: boolean;
  monthlyFee?: number; // Added monthly fee field
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
  creditCardFreeMonth?: number; // Added property for the credit card free month
}
