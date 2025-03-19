
import { Loan, calculateLoan } from '../loanCalculations';
import { CreditCard, calculateEffectiveMinPayment } from '../creditCardCalculations';
import { DebtItem } from './types';

/**
 * Convert a loan to a DebtItem
 */
export const convertLoanToDebtItem = (loan: Loan): DebtItem => {
  const calculation = calculateLoan(loan);
  
  // Include the monthly fee in the minimum payment when creating debt items
  const minPayment = calculation.monthlyPayment;
  
  return {
    id: loan.id,
    name: loan.name,
    type: 'loan',
    balance: loan.amount,
    interestRate: loan.interestRate,
    minPayment: minPayment,
    remainingTerm: loan.termYears * 12,
    isActive: loan.isActive,
    monthlyFee: loan.monthlyFee
  };
};

/**
 * Convert a credit card to a DebtItem
 */
export const convertCreditCardToDebtItem = (card: CreditCard): DebtItem => {
  const minPayment = card.fullPayment
    ? card.balance + (card.balance * (card.apr / 100 / 12))  // Full payment + this month's interest
    : calculateEffectiveMinPayment(card.balance, card.minPayment, card.minPaymentPercent);

  return {
    id: card.id,
    name: card.name,
    type: 'credit-card',
    balance: card.balance,
    interestRate: card.apr,
    minPayment: minPayment,
    isActive: card.isActive
  };
};

/**
 * Combine loans and credit cards into a single array of DebtItems
 */
export const combineDebts = (
  loans: Loan[], 
  creditCards: CreditCard[]
): DebtItem[] => {
  const loanItems = loans.map(convertLoanToDebtItem);
  const cardItems = creditCards.map(convertCreditCardToDebtItem);
  
  return [...loanItems, ...cardItems];
};
