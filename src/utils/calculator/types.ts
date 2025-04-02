
/**
 * Types for debt calculation
 */

// Debt item interface
export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type?: string;
  additionalPayment?: number;
}

// Payment strategy types
export type PaymentStrategy = 'avalanche' | 'snowball' | 'custom';

// Monthly payment for a specific debt
export interface DebtPayment {
  debtId: string;
  amount: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
}

// Monthly payment plan for all debts
export interface MonthlyPaymentPlan {
  month: number;
  date: string;
  payments: DebtPayment[];
  totalPaid: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalRemainingBalance: number;
  debtsCompleted: string[];
}

// Complete payment plan
export interface PaymentPlan {
  monthlyPlans: MonthlyPaymentPlan[];
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  payoffDate: string;
  strategy: PaymentStrategy;
  monthlyPayment: number;
}

// What-if scenario
export interface Scenario {
  id: string;
  name: string;
  additionalMonthlyPayment: number;
  strategy: PaymentStrategy;
  customPaymentOrder?: string[];
  oneTimePayment?: {
    amount: number;
    debtId: string;
    month: number;
  };
  interestRateChanges?: {
    debtId: string;
    newRate: number;
  }[];
}

// Comparison result between scenarios
export interface ScenarioComparison {
  scenarioId: string;
  scenarioName: string;
  totalMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  payoffDate: string;
  monthsSaved: number;
  interestSaved: number;
  moneySaved: number;
}

// Debt consolidation option
export interface ConsolidationOption {
  id: string;
  name: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalPaid: number;
  payoffDate: string;
  interestSaved: number;
  moneySaved: number;
  monthsSaved: number;
}

// Extra payment impact
export interface ExtraPaymentImpact {
  amount: number;
  monthsSaved: number;
  interestSaved: number;
  newPayoffDate: string;
}
