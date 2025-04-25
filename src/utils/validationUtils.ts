
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

/**
 * Checks if a minimum payment is sufficient to cover the interest on a debt
 * @param balance The current balance of the debt
 * @param apr The annual percentage rate (APR) of the debt
 * @param minPayment The minimum payment amount
 * @returns True if the minimum payment covers at least the monthly interest, false otherwise
 */
export const isMinPaymentSufficient = (balance: number, apr: number, minPayment: number): boolean => {
  const monthlyInterestRate = apr / 100 / 12;
  const monthlyInterest = balance * monthlyInterestRate;
  
  return minPayment > monthlyInterest;
};

/**
 * Calculates the minimum payment required to cover monthly interest plus some principal
 * @param balance The current balance of the debt
 * @param apr The annual percentage rate (APR) of the debt
 * @param principalPercentage The percentage of principal to pay (in addition to interest)
 * @returns The minimum payment required
 */
export const calculateMinimumPayment = (
  balance: number, 
  apr: number, 
  principalPercentage: number = 1
): number => {
  const monthlyInterestRate = apr / 100 / 12;
  const monthlyInterest = balance * monthlyInterestRate;
  const principalPortion = balance * (principalPercentage / 100);
  
  // Return interest plus small percentage of principal, with a minimum of $15 or 2% of balance
  return Math.max(
    monthlyInterest + principalPortion,
    15,
    balance * 0.02
  );
};

/**
 * Validates loan input data with detailed error messages
 * @param data The loan data to validate
 * @returns An object containing validation results and error messages
 */
export interface LoanValidationInput {
  amount?: number | string;
  interestRate?: number | string;
  term?: number | string;
  minimumPayment?: number | string;
  name?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLoanInput = (data: LoanValidationInput): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate loan name
  if (!data.name) {
    errors.name = 'Loan name is required';
  }
  
  // Validate loan amount
  if (data.amount === undefined || data.amount === '') {
    errors.amount = 'Loan amount is required';
  } else {
    const numAmount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    if (isNaN(numAmount)) {
      errors.amount = 'Loan amount must be a valid number';
    } else if (numAmount <= 0) {
      errors.amount = 'Loan amount must be greater than zero';
    } else if (numAmount > 10000000) {
      errors.amount = 'Loan amount cannot exceed 10,000,000';
    }
  }
  
  // Validate interest rate
  if (data.interestRate === undefined || data.interestRate === '') {
    errors.interestRate = 'Interest rate is required';
  } else {
    const numRate = typeof data.interestRate === 'string' ? parseFloat(data.interestRate) : data.interestRate;
    if (isNaN(numRate)) {
      errors.interestRate = 'Interest rate must be a valid number';
    } else if (numRate < 0) {
      errors.interestRate = 'Interest rate cannot be negative';
    } else if (numRate > 30) {
      errors.interestRate = 'Interest rate cannot exceed 30%';
    }
  }
  
  // Validate loan term
  if (data.term === undefined || data.term === '') {
    errors.term = 'Loan term is required';
  } else {
    const numTerm = typeof data.term === 'string' ? parseFloat(data.term) : data.term;
    if (isNaN(numTerm)) {
      errors.term = 'Loan term must be a valid number';
    } else if (numTerm < 0.5) {
      errors.term = 'Loan term must be at least 6 months';
    } else if (numTerm > 40) {
      errors.term = 'Loan term cannot exceed 40 years';
    }
  }
  
  // Validate minimum payment if provided
  if (data.minimumPayment !== undefined && data.minimumPayment !== '') {
    const numPayment = typeof data.minimumPayment === 'string' ? parseFloat(data.minimumPayment) : data.minimumPayment;
    const numAmount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
    const numRate = typeof data.interestRate === 'string' ? parseFloat(data.interestRate) : data.interestRate;
    
    if (!isNaN(numPayment) && !isNaN(numAmount) && !isNaN(numRate)) {
      const monthlyInterest = (numAmount * numRate / 100) / 12;
      if (numPayment <= monthlyInterest) {
        errors.minimumPayment = 'Minimum payment must be greater than monthly interest';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates credit card input data with detailed error messages
 * @param data The credit card data to validate
 * @returns An object containing validation results and error messages
 */
export interface CreditCardValidationInput {
  name?: string;
  balance?: number | string;
  limit?: number | string;
  apr?: number | string;
  minPayment?: number | string;
  minPaymentPercent?: number | string;
}

export const validateCreditCardInput = (data: CreditCardValidationInput): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate card name
  if (!data.name) {
    errors.name = 'Card name is required';
  }
  
  // Validate balance
  if (data.balance === undefined || data.balance === '') {
    errors.balance = 'Current balance is required';
  } else {
    const numBalance = typeof data.balance === 'string' ? parseFloat(data.balance) : data.balance;
    if (isNaN(numBalance)) {
      errors.balance = 'Balance must be a valid number';
    } else if (numBalance < 0) {
      errors.balance = 'Balance cannot be negative';
    } else if (numBalance > 100000) {
      errors.balance = 'Balance cannot exceed 100,000';
    }
  }
  
  // Validate credit limit
  if (data.limit !== undefined && data.limit !== '') {
    const numLimit = typeof data.limit === 'string' ? parseFloat(data.limit) : data.limit;
    if (isNaN(numLimit)) {
      errors.limit = 'Credit limit must be a valid number';
    } else if (numLimit <= 0) {
      errors.limit = 'Credit limit must be greater than zero';
    } else if (numLimit > 200000) {
      errors.limit = 'Credit limit cannot exceed 200,000';
    }
    
    // Check if limit is greater than balance
    const numBalance = typeof data.balance === 'string' ? parseFloat(data.balance) : data.balance;
    if (!isNaN(numLimit) && !isNaN(numBalance) && numLimit < numBalance) {
      errors.limit = 'Credit limit cannot be less than the current balance';
    }
  }
  
  // Validate APR
  if (data.apr === undefined || data.apr === '') {
    errors.apr = 'APR is required';
  } else {
    const numAPR = typeof data.apr === 'string' ? parseFloat(data.apr) : data.apr;
    if (isNaN(numAPR)) {
      errors.apr = 'APR must be a valid number';
    } else if (numAPR < 0) {
      errors.apr = 'APR cannot be negative';
    } else if (numAPR > 40) {
      errors.apr = 'APR cannot exceed 40%';
    }
  }
  
  // Validate minimum payment percentage
  if (data.minPaymentPercent !== undefined && data.minPaymentPercent !== '') {
    const numPercent = typeof data.minPaymentPercent === 'string' ? 
      parseFloat(data.minPaymentPercent) : data.minPaymentPercent;
    
    if (isNaN(numPercent)) {
      errors.minPaymentPercent = 'Minimum payment percentage must be a valid number';
    } else if (numPercent < 1) {
      errors.minPaymentPercent = 'Minimum payment percentage must be at least 1%';
    } else if (numPercent > 10) {
      errors.minPaymentPercent = 'Minimum payment percentage cannot exceed 10%';
    }
  }
  
  // Validate minimum payment if provided
  if (data.minPayment !== undefined && data.minPayment !== '') {
    const numPayment = typeof data.minPayment === 'string' ? parseFloat(data.minPayment) : data.minPayment;
    const numBalance = typeof data.balance === 'string' ? parseFloat(data.balance) : data.balance;
    const numAPR = typeof data.apr === 'string' ? parseFloat(data.apr) : data.apr;
    
    if (!isNaN(numPayment) && !isNaN(numBalance) && !isNaN(numAPR)) {
      const monthlyInterest = (numBalance * numAPR / 100) / 12;
      if (numPayment <= monthlyInterest && numBalance > 0) {
        errors.minPayment = 'Minimum payment must be greater than monthly interest';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
