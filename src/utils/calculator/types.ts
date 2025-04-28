/**
 * Types for debt calculation
 */

// Debt item interface with improved documentation
export interface Debt {
  /** Unique identifier for the debt */
  id: string;
  
  /** User-friendly name of the debt */
  name: string;
  
  /** Current balance of the debt in currency units */
  balance: number;
  
  /** Annual interest rate as a percentage (e.g., 5.5 for 5.5%) */
  interestRate: number;
  
  /** Minimum required monthly payment in currency units */
  minimumPayment: number;
  
  /** Optional credit limit for credit cards */
  creditLimit?: number;
  
  /** Optional type of the debt */
  type?: string;
  
  /** Optional additional payment specifically for this debt */
  additionalPayment?: number;
}

/** Payment strategy types with improved documentation */
export type PaymentStrategy = 
  /** Pay highest interest rate debts first (saves the most money) */
  'avalanche' | 
  /** Pay smallest balance debts first (builds momentum) */
  'snowball' | 
  /** Distribute extra payments equally across all debts */
  'equal' |
  /** Custom payment allocation specified by user */
  'custom';

/** Monthly payment for a specific debt with improved documentation */
export interface DebtPayment {
  /** ID of the debt this payment applies to */
  debtId: string;
  
  /** Total payment amount */
  amount: number;
  
  /** Portion of payment that goes to interest */
  interestPaid: number;
  
  /** Portion of payment that goes to principal */
  principalPaid: number;
  
  /** Remaining balance after this payment */
  remainingBalance: number;
}

/** Monthly payment plan for all debts with improved documentation */
export interface MonthlyPaymentPlan {
  /** Month number (0-based) */
  month: number;
  
  /** Date of this payment plan (ISO string) */
  date: string;
  
  /** Array of individual debt payments */
  payments: DebtPayment[];
  
  /** Total amount paid this month across all debts */
  totalPaid: number;
  
  /** Total interest paid this month across all debts */
  totalInterestPaid: number;
  
  /** Total principal paid this month across all debts */
  totalPrincipalPaid: number;
  
  /** Total remaining balance across all debts */
  totalRemainingBalance: number;
  
  /** IDs of debts that were paid off this month */
  debtsCompleted: string[];
}

/** Complete payment plan with improved documentation */
export interface PaymentPlan {
  /** Array of monthly payment plans */
  monthlyPlans: MonthlyPaymentPlan[];
  
  /** Total number of months to pay off all debts */
  totalMonths: number;
  
  /** Total interest paid over the life of all debts */
  totalInterestPaid: number;
  
  /** Total amount paid (principal + interest) over the life of all debts */
  totalPaid: number;
  
  /** Estimated payoff date (ISO string) */
  payoffDate: string;
  
  /** Payment strategy used */
  strategy: PaymentStrategy;
  
  /** Monthly payment amount */
  monthlyPayment: number;
}

/** What-if scenario with improved documentation */
export interface Scenario {
  /** Unique identifier for the scenario */
  id: string;
  
  /** User-friendly name of the scenario */
  name: string;
  
  /** Additional monthly payment amount */
  additionalMonthlyPayment: number;
  
  /** Payment strategy to use */
  strategy: PaymentStrategy;
  
  /** Optional custom payment order (debt IDs) */
  customPaymentOrder?: string[];
  
  /** Optional one-time payment details */
  oneTimePayment?: {
    /** Amount of the one-time payment */
    amount: number;
    
    /** Which debt to apply the payment to */
    debtId: string;
    
    /** When to apply the payment (month number) */
    month: number;
  };
  
  /** Optional interest rate changes */
  interestRateChanges?: {
    /** Which debt to change the rate for */
    debtId: string;
    
    /** New interest rate */
    newRate: number;
  }[];
}

/** Comparison result between scenarios with improved documentation */
export interface ScenarioComparison {
  /** ID of the scenario being compared */
  scenarioId: string;
  
  /** Name of the scenario being compared */
  scenarioName: string;
  
  /** Total months to payoff under this scenario */
  totalMonths: number;
  
  /** Total interest paid under this scenario */
  totalInterestPaid: number;
  
  /** Total amount paid under this scenario */
  totalPaid: number;
  
  /** Estimated payoff date under this scenario */
  payoffDate: string;
  
  /** Months saved compared to baseline */
  monthsSaved: number;
  
  /** Interest saved compared to baseline */
  interestSaved: number;
  
  /** Total money saved compared to baseline */
  moneySaved: number;
}

/** Debt consolidation option with improved documentation */
export interface ConsolidationOption {
  /** Unique identifier for this option */
  id: string;
  
  /** Description of this consolidation option */
  name: string;
  
  /** Interest rate for the consolidated loan */
  interestRate: number;
  
  /** Term length in months */
  termMonths: number;
  
  /** Monthly payment for the consolidated loan */
  monthlyPayment: number;
  
  /** Total interest paid over the life of the consolidated loan */
  totalInterestPaid: number;
  
  /** Total amount paid over the life of the consolidated loan */
  totalPaid: number;
  
  /** Estimated payoff date for the consolidated loan */
  payoffDate: string;
  
  /** Interest saved compared to current debts */
  interestSaved: number;
  
  /** Total money saved compared to current debts */
  moneySaved: number;
  
  /** Months saved compared to current debts */
  monthsSaved: number;
}

/** Extra payment impact analysis with improved documentation */
export interface ExtraPaymentImpact {
  /** Amount of extra payment */
  amount: number;
  
  /** Months saved due to extra payment */
  monthsSaved: number;
  
  /** Interest saved due to extra payment */
  interestSaved: number;
  
  /** New estimated payoff date */
  newPayoffDate: string;
  
  /** Original total interest without extra payment */
  originalTotalInterest: number;
  
  /** New total interest with extra payment */
  newTotalInterest: number;
}
