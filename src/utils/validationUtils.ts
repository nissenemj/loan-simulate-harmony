
/**
 * Utility functions for validating user inputs
 */

/**
 * Validates a number to ensure it's within a realistic range
 * @param value The value to validate
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 * @param defaultValue Default value to return if validation fails
 * @returns A validated number within the specified range
 */
export const validateNumberInput = (
  value: number | string,
  min: number,
  max: number,
  defaultValue: number
): number => {
  // Parse the value to a number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return defaultValue;
  }
  
  // Check if it's within the specified range
  if (numValue < min) {
    return min;
  }
  
  if (numValue > max) {
    return max;
  }
  
  return numValue;
};

/**
 * Validates a loan amount to ensure it's realistic
 * @param amount The loan amount to validate
 * @returns A validated loan amount
 */
export const validateLoanAmount = (amount: number | string): number => {
  return validateNumberInput(amount, 0, 10000000, 0); // Max 10 million
};

/**
 * Validates an interest rate to ensure it's realistic
 * @param rate The interest rate to validate
 * @returns A validated interest rate
 */
export const validateInterestRate = (rate: number | string): number => {
  return validateNumberInput(rate, 0, 30, 0); // Max 30%
};

/**
 * Validates a loan term to ensure it's realistic
 * @param termYears The loan term in years to validate
 * @returns A validated loan term
 */
export const validateLoanTerm = (termYears: number | string): number => {
  return validateNumberInput(termYears, 0.5, 40, 1); // Min 6 months, max 40 years
};

/**
 * Validates a monthly payment to ensure it's realistic
 * @param payment The monthly payment to validate
 * @param minPayment The minimum required payment
 * @returns A validated monthly payment
 */
export const validateMonthlyPayment = (payment: number | string, minPayment: number): number => {
  return validateNumberInput(payment, minPayment, minPayment * 10, minPayment);
};

/**
 * Validates a credit card balance to ensure it's realistic
 * @param balance The credit card balance to validate
 * @returns A validated credit card balance
 */
export const validateCreditCardBalance = (balance: number | string): number => {
  return validateNumberInput(balance, 0, 100000, 0); // Max 100,000
};

/**
 * Validates a credit card APR to ensure it's realistic
 * @param apr The credit card APR to validate
 * @returns A validated credit card APR
 */
export const validateCreditCardAPR = (apr: number | string): number => {
  return validateNumberInput(apr, 0, 40, 0); // Max 40% APR
};

/**
 * Validates a minimum payment percentage to ensure it's realistic
 * @param percentage The minimum payment percentage to validate
 * @returns A validated minimum payment percentage
 */
export const validateMinPaymentPercentage = (percentage: number | string): number => {
  return validateNumberInput(percentage, 1, 10, 2); // Between 1% and 10%, default 2%
};
