
import { Loan, calculateLoan } from '../loanCalculations';
import { CreditCard, calculateCreditCard } from '../creditCardCalculations';
import { DebtItem } from './types';

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
