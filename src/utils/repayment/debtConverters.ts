import { Loan, calculateLoan } from "../loanCalculations";
import {
	CreditCard,
	calculateEffectiveMinPayment,
} from "../creditCardCalculations";
import { DebtItem } from "./types";

/**
 * Convert a loan to a DebtItem
 */
export const convertLoanToDebtItem = (loan: Loan): DebtItem => {
	// Use loan.minPayment if it's already defined
	if (loan.minPayment && loan.minPayment > 0) {
		return {
			id: loan.id,
			name: loan.name,
			type: "loan",
			balance: loan.amount,
			interestRate: loan.interestRate,
			minPayment: Math.round(loan.minPayment * 100) / 100, // Round to 2 decimal places
			remainingTerm: loan.termYears * 12,
			isActive: loan.isActive,
			monthlyFee: loan.monthlyFee,
		};
	}

	// Otherwise calculate it
	const calculation = calculateLoan(loan);

	// Include the monthly fee in the minimum payment when creating debt items
	// Make sure the minimum payment is at least the monthly interest plus 1% of principal
	const monthlyInterest = (loan.amount * loan.interestRate) / 100 / 12;
	const principalPortion = loan.amount * 0.01; // 1% of principal
	const calculatedMinPayment = Math.max(
		calculation.monthlyPayment,
		monthlyInterest + principalPortion
	);

	// Round to 2 decimal places for better display
	const minPayment = Math.round(calculatedMinPayment * 100) / 100;

	return {
		id: loan.id,
		name: loan.name,
		type: "loan",
		balance: loan.amount,
		interestRate: loan.interestRate,
		minPayment: minPayment,
		remainingTerm: loan.termYears * 12,
		isActive: loan.isActive,
		monthlyFee: loan.monthlyFee,
	};
};

/**
 * Convert a credit card to a DebtItem
 */
export const convertCreditCardToDebtItem = (card: CreditCard): DebtItem => {
	// Calculate minimum payment based on card settings
	let calculatedMinPayment;

	if (card.fullPayment) {
		// Full payment + this month's interest
		calculatedMinPayment = card.balance + card.balance * (card.apr / 100 / 12);
	} else {
		// Calculate effective minimum payment
		calculatedMinPayment = calculateEffectiveMinPayment(
			card.balance,
			card.minPayment,
			card.minPaymentPercent
		);

		// Ensure minimum payment is at least the monthly interest plus 1% of balance
		const monthlyInterest = card.balance * (card.apr / 100 / 12);
		const principalPortion = card.balance * 0.01; // 1% of balance
		const minimumViablePayment = monthlyInterest + principalPortion;

		calculatedMinPayment = Math.max(calculatedMinPayment, minimumViablePayment);
	}

	// Round to 2 decimal places for better display
	const minPayment = Math.round(calculatedMinPayment * 100) / 100;

	return {
		id: card.id,
		name: card.name,
		type: "credit-card",
		balance: card.balance,
		interestRate: card.apr,
		minPayment: minPayment,
		isActive: card.isActive,
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
