
export type DebtType = 'loan' | 'credit-card';
export type PaymentStrategy = 'avalanche' | 'snowball' | 'equal';

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type?: DebtType;
}

export interface Payment {
  debtId: string;
  amount: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
}

export interface MonthlyPaymentPlan {
  month: number;
  date: string;
  payments: Payment[];
  totalPaid: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalRemainingBalance: number;
  debtsCompleted: string[];
}

export interface PaymentPlan {
  strategy: PaymentStrategy;
  totalMonths: number;
  totalPaid: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  monthlyPlans: MonthlyPaymentPlan[];
  payoffDate: string;
  monthlyPayment: number;
}

export interface ExtraPaymentImpact {
  originalPayoffDate: string;
  newPayoffDate: string;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
}

export interface ConsolidationOption {
  id: string;
  name: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  payoffDate: string;
  interestSaved: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  additionalMonthlyPayment: number;
  strategy: PaymentStrategy;
}

export interface ScenarioComparison {
  scenarioId: string;
  scenarioName: string;
  totalMonths: number;
  totalPaid: number;
  totalInterestPaid: number;
  monthlyPayment: number;
  payoffDate: string;
  interestSaved: number;
}
