export type LoanType = "annuity" | "equal-principal" | "fixed-installment" | "custom-payment";
export type InterestType = "fixed" | "variable-euribor";

export interface Loan {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  termYears: number;
  repaymentType: LoanType;
  interestType?: InterestType;
  customPayment?: number;
  isActive: boolean;
}

/**
 * Defines the result structure for loan calculations
 */
export interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  principal: number;
  interest: number;
  monthlyBreakdown: { principal: number; interest: number }[];
  actualTermMonths?: number; // Added for custom payment to show actual term
}

/**
 * Calculates the monthly interest rate
 */
export const calculateMonthlyInterestRate = (annualRate: number): number => {
  return annualRate / 12 / 100;
};

/**
 * Calculates loan details for annuity repayment (equal monthly payments)
 */
export const calculateAnnuityLoan = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  const termMonths = termYears * 12;
  
  // Calculate monthly payment using the annuity formula
  const monthlyPayment = 
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) / 
    (Math.pow(1 + monthlyInterestRate, termMonths) - 1);
  
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const monthlyBreakdown: { principal: number; interest: number }[] = [];
  
  // Calculate the monthly breakdown
  for (let month = 0; month < termMonths; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    totalInterest += interestPayment;
    remainingBalance -= principalPayment;
    
    monthlyBreakdown.push({
      principal: principalPayment,
      interest: interestPayment
    });
  }
  
  return {
    monthlyPayment,
    totalInterest,
    principal: monthlyPayment - (loanAmount * monthlyInterestRate),
    interest: loanAmount * monthlyInterestRate,
    monthlyBreakdown
  };
};

/**
 * Calculates loan details for equal principal repayment
 */
export const calculateEqualPrincipalLoan = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  const termMonths = termYears * 12;
  
  const monthlyPrincipal = loanAmount / termMonths;
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const monthlyBreakdown: { principal: number; interest: number }[] = [];
  
  // Calculate the monthly breakdown
  for (let month = 0; month < termMonths; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const monthlyPayment = monthlyPrincipal + interestPayment;
    
    totalInterest += interestPayment;
    remainingBalance -= monthlyPrincipal;
    
    monthlyBreakdown.push({
      principal: monthlyPrincipal,
      interest: interestPayment
    });
  }
  
  // First month payment
  const firstMonthPayment = monthlyPrincipal + (loanAmount * monthlyInterestRate);
  
  return {
    monthlyPayment: firstMonthPayment,
    totalInterest,
    principal: monthlyPrincipal,
    interest: loanAmount * monthlyInterestRate,
    monthlyBreakdown
  };
};

/**
 * Calculates loan details for fixed installment repayment
 */
export const calculateFixedInstallmentLoan = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  const termMonths = termYears * 12;
  
  // Calculate total interest (simplified formula for fixed installment)
  const totalInterest = loanAmount * annualInterestRate * termYears / 100;
  
  // Monthly payment is simply the loan amount plus total interest divided by the term
  const monthlyPayment = (loanAmount + totalInterest) / termMonths;
  
  let remainingBalance = loanAmount;
  const monthlyBreakdown: { principal: number; interest: number }[] = [];
  
  // Calculate the monthly breakdown
  for (let month = 0; month < termMonths; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    
    monthlyBreakdown.push({
      principal: principalPayment,
      interest: interestPayment
    });
  }
  
  return {
    monthlyPayment,
    totalInterest,
    principal: monthlyPayment - (loanAmount * monthlyInterestRate),
    interest: loanAmount * monthlyInterestRate,
    monthlyBreakdown
  };
};

/**
 * Calculates loan details for custom payment repayment
 */
export const calculateCustomPaymentLoan = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number,
  customPayment: number
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  
  // Check if custom payment is sufficient to cover minimum interest
  const minimumPayment = loanAmount * monthlyInterestRate;
  
  if (customPayment <= minimumPayment) {
    // If payment is too small, return a warning calculation
    return {
      monthlyPayment: customPayment,
      totalInterest: Infinity, // Indicate that the loan will never be paid off
      principal: 0,
      interest: minimumPayment,
      monthlyBreakdown: [{ principal: 0, interest: minimumPayment }],
      actualTermMonths: Infinity
    };
  }
  
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const monthlyBreakdown: { principal: number; interest: number }[] = [];
  let monthCount = 0;
  const maxMonths = termYears * 12 * 2; // Safety limit to prevent infinite loops
  
  // Calculate the monthly breakdown
  while (remainingBalance > 0 && monthCount < maxMonths) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = customPayment - interestPayment;
    
    // If the principal payment would exceed the remaining balance,
    // adjust the final payment
    const actualPrincipalPayment = Math.min(principalPayment, remainingBalance);
    const actualPayment = actualPrincipalPayment + interestPayment;
    
    totalInterest += interestPayment;
    remainingBalance -= actualPrincipalPayment;
    
    monthlyBreakdown.push({
      principal: actualPrincipalPayment,
      interest: interestPayment
    });
    
    monthCount++;
    
    // If the remaining balance is very small (due to floating point precision), consider it paid off
    if (remainingBalance < 0.01) {
      remainingBalance = 0;
    }
  }
  
  // If we hit the max months, the loan won't be paid off with the custom payment
  if (monthCount >= maxMonths) {
    return {
      monthlyPayment: customPayment,
      totalInterest: Infinity, // Indicate that the loan will never be paid off
      principal: customPayment - (loanAmount * monthlyInterestRate),
      interest: loanAmount * monthlyInterestRate,
      monthlyBreakdown: monthlyBreakdown.slice(0, 12), // Just return first year's breakdown
      actualTermMonths: Infinity
    };
  }
  
  return {
    monthlyPayment: customPayment,
    totalInterest,
    principal: customPayment - (loanAmount * monthlyInterestRate),
    interest: loanAmount * monthlyInterestRate,
    monthlyBreakdown,
    actualTermMonths: monthCount
  };
};

/**
 * Calculates loan details based on the repayment type
 */
export const calculateLoan = (loan: Loan): LoanCalculationResult => {
  // Apply Euribor adjustment if the interest type is variable
  const effectiveInterestRate = loan.interestType === 'variable-euribor' 
    ? loan.interestRate + 1 // Add 1% for Euribor
    : loan.interestRate;
  
  switch (loan.repaymentType) {
    case 'annuity':
      return calculateAnnuityLoan(loan.amount, effectiveInterestRate, loan.termYears);
    case 'equal-principal':
      return calculateEqualPrincipalLoan(loan.amount, effectiveInterestRate, loan.termYears);
    case 'fixed-installment':
      return calculateFixedInstallmentLoan(loan.amount, effectiveInterestRate, loan.termYears);
    case 'custom-payment':
      // Use a default payment if customPayment is not provided
      const customPayment = loan.customPayment || loan.amount / (loan.termYears * 12);
      return calculateCustomPaymentLoan(loan.amount, effectiveInterestRate, loan.termYears, customPayment);
    default:
      throw new Error(`Unknown repayment type: ${loan.repaymentType}`);
  }
};

/**
 * Format a number as currency in EUR
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Generate recommendations based on the loans
 */
export const generateRecommendations = (loans: Loan[]): {
  highestInterestRateLoans: Loan[];
  highestTotalInterestLoans: Loan[];
  topPriorityLoans: Loan[];
} => {
  // Filter active loans
  const activeLoans = loans.filter(loan => loan.isActive);
  
  if (activeLoans.length === 0) {
    return { 
      highestInterestRateLoans: [], 
      highestTotalInterestLoans: [], 
      topPriorityLoans: [] 
    };
  }
  
  // Calculate results for all loans
  const loansWithResults = activeLoans.map(loan => ({
    loan,
    result: calculateLoan(loan)
  }));
  
  // Find highest interest rate
  const maxInterestRate = Math.max(...loansWithResults.map(item => item.loan.interestRate));
  const highestInterestRateLoans = loansWithResults
    .filter(item => item.loan.interestRate === maxInterestRate)
    .map(item => item.loan);
  
  // Find highest total interest
  const maxTotalInterest = Math.max(...loansWithResults.map(item => item.result.totalInterest));
  const highestTotalInterestLoans = loansWithResults
    .filter(item => item.result.totalInterest === maxTotalInterest)
    .map(item => item.loan);
  
  // Find loans that appear in both categories
  const topPriorityLoans = highestInterestRateLoans.filter(loan => 
    highestTotalInterestLoans.some(l => l.id === loan.id)
  );
  
  return {
    highestInterestRateLoans,
    highestTotalInterestLoans,
    topPriorityLoans
  };
};

/**
 * Calculate total monthly payment from active loans
 */
export const calculateTotalMonthlyPayment = (loans: Loan[]): {
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
} => {
  const activeLoans = loans.filter(loan => loan.isActive);
  
  let totalPayment = 0;
  let totalPrincipal = 0;
  let totalInterest = 0;
  
  activeLoans.forEach(loan => {
    const result = calculateLoan(loan);
    totalPayment += result.monthlyPayment;
    totalPrincipal += result.principal;
    totalInterest += result.interest;
  });
  
  return {
    totalPayment,
    totalPrincipal,
    totalInterest
  };
};

/**
 * Estimate the total term in months based on custom payment
 */
export const estimateTermForCustomPayment = (
  loanAmount: number,
  annualInterestRate: number,
  customPayment: number
): number | null => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  
  // If payment doesn't cover interest, loan will never be paid off
  if (customPayment <= loanAmount * monthlyInterestRate) {
    return null;
  }
  
  // Simple approximation
  let balance = loanAmount;
  let months = 0;
  const maxMonths = 1200; // 100 years as safety
  
  while (balance > 0 && months < maxMonths) {
    const interest = balance * monthlyInterestRate;
    const principal = customPayment - interest;
    balance -= principal;
    months++;
    
    // Handle floating point precision
    if (balance < 0.01) {
      balance = 0;
    }
  }
  
  return months < maxMonths ? months : null;
};
