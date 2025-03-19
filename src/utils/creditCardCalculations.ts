
import { formatCurrency, formatPercentage } from './loanCalculations';

export interface CreditCard {
  id: string;
  name: string;
  balance: number;
  limit: number;
  apr: number;
  minPayment: number;
  minPaymentPercent: number;
  fullPayment: boolean;
  isActive: boolean;
}

export interface CreditCardCalculationResult {
  monthlyInterest: number;
  totalInterest: number;
  payoffMonths: number | null;
  utilizationRate: number;
  effectivePayment: number;
}

/**
 * Calculate the monthly interest on the credit card balance
 */
export const calculateMonthlyInterest = (balance: number, apr: number): number => {
  return balance * (apr / 100) / 12;
};

/**
 * Calculate the effective minimum payment (greater of fixed amount or percentage)
 */
export const calculateEffectiveMinPayment = (
  balance: number, 
  minPayment: number, 
  minPaymentPercent: number
): number => {
  const percentPayment = balance * (minPaymentPercent / 100);
  return Math.max(minPayment, percentPayment);
};

/**
 * Calculate how long it would take to pay off a credit card with minimum payments
 */
export const calculatePayoffTime = (
  balance: number, 
  apr: number, 
  minPayment: number,
  minPaymentPercent: number
): number | null => {
  if (balance <= 0) return 0;
  
  const monthlyRate = apr / 100 / 12;
  let remainingBalance = balance;
  let months = 0;
  const maxMonths = 1200; // 100 years as safety limit
  
  while (remainingBalance > 1 && months < maxMonths) {
    // Calculate interest for this month
    const interest = remainingBalance * monthlyRate;
    
    // Calculate payment for this month (using the greater of fixed or percentage)
    const effectiveMinPayment = calculateEffectiveMinPayment(
      remainingBalance,
      minPayment,
      minPaymentPercent
    );
    
    // If payment doesn't cover monthly interest, debt will never be paid off
    if (effectiveMinPayment <= interest) {
      return null;
    }
    
    // Apply payment and calculate new balance
    remainingBalance = remainingBalance + interest - effectiveMinPayment;
    months++;
  }
  
  return months < maxMonths ? months : null;
};

/**
 * Calculate the total interest paid over the life of the credit card
 */
export const calculateTotalInterest = (
  balance: number, 
  apr: number, 
  minPayment: number,
  minPaymentPercent: number,
  fullPayment: boolean
): number => {
  if (fullPayment || balance <= 0) return 0;
  
  const monthlyRate = apr / 100 / 12;
  let remainingBalance = balance;
  let totalInterest = 0;
  const maxMonths = 1200; // 100 years as safety limit
  let months = 0;
  
  while (remainingBalance > 1 && months < maxMonths) {
    // Calculate interest for this month
    const interest = remainingBalance * monthlyRate;
    totalInterest += interest;
    
    // Calculate payment for this month
    const effectiveMinPayment = calculateEffectiveMinPayment(
      remainingBalance,
      minPayment,
      minPaymentPercent
    );
    
    // If payment doesn't cover monthly interest, return infinity
    if (effectiveMinPayment <= interest) {
      return Infinity;
    }
    
    // Apply payment and calculate new balance
    remainingBalance = remainingBalance + interest - effectiveMinPayment;
    months++;
  }
  
  return months < maxMonths ? totalInterest : Infinity;
};

/**
 * Calculate credit card utilization rate (balance / limit)
 */
export const calculateUtilizationRate = (balance: number, limit: number): number => {
  if (limit <= 0) return 0;
  return balance / limit;
};

/**
 * Get comprehensive credit card calculations
 */
export const calculateCreditCard = (card: CreditCard): CreditCardCalculationResult => {
  const monthlyInterest = calculateMonthlyInterest(card.balance, card.apr);
  
  const effectivePayment = card.fullPayment 
    ? card.balance + monthlyInterest 
    : calculateEffectiveMinPayment(card.balance, card.minPayment, card.minPaymentPercent);
  
  return {
    monthlyInterest,
    totalInterest: calculateTotalInterest(
      card.balance, 
      card.apr, 
      card.minPayment, 
      card.minPaymentPercent, 
      card.fullPayment
    ),
    payoffMonths: card.fullPayment 
      ? 1 
      : calculatePayoffTime(card.balance, card.apr, card.minPayment, card.minPaymentPercent),
    utilizationRate: calculateUtilizationRate(card.balance, card.limit),
    effectivePayment
  };
};

/**
 * Calculate a summary of all credit cards
 */
export const calculateCreditCardSummary = (cards: CreditCard[]): {
  totalBalance: number;
  totalLimit: number;
  totalUtilization: number;
  totalMinPayment: number;
  totalMonthlyInterest: number;
} => {
  const activeCards = cards.filter(card => card.isActive);
  
  let totalBalance = 0;
  let totalLimit = 0;
  let totalMinPayment = 0;
  let totalMonthlyInterest = 0;
  
  activeCards.forEach(card => {
    const result = calculateCreditCard(card);
    totalBalance += card.balance;
    totalLimit += card.limit;
    totalMinPayment += result.effectivePayment;
    totalMonthlyInterest += result.monthlyInterest;
  });
  
  const totalUtilization = totalLimit > 0 ? totalBalance / totalLimit : 0;
  
  return {
    totalBalance,
    totalLimit,
    totalUtilization,
    totalMinPayment,
    totalMonthlyInterest
  };
};

/**
 * Format a number as a percentage for display
 */
export const formatUtilizationRate = (rate: number): string => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(rate);
};

/**
 * Format payoff time in months for display
 */
export const formatPayoffTime = (months: number | null, t: (key: string) => string): string => {
  if (months === null) {
    return "Never";
  }
  
  if (months === 0) {
    return "Paid";
  }
  
  if (months === 1) {
    return "1 month";
  }
  
  if (months < 12) {
    return `${months} months`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? t("table.year") : t("table.years")}`;
  }
  
  return `${years} ${t("table.years")} ${remainingMonths} ${t("form.months")}`;
};
