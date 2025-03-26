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
  monthlyFee?: number; // Added monthly fee (e.g., processing fee)
}

/**
 * Defines the result structure for loan calculations
 */
export interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  firstMonthPrincipal: number; // Renamed to clarify it's the first month's principal
  firstMonthInterest: number; // Renamed to clarify it's the first month's interest
  interest: number; // Added to make the interface consistent for totalMonthlyInterest
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
  
  // First month's values for principal and interest
  const firstMonthInterest = loanAmount * monthlyInterestRate;
  const firstMonthPrincipal = monthlyPayment - firstMonthInterest;
  
  return {
    monthlyPayment,
    totalInterest,
    firstMonthPrincipal,
    firstMonthInterest,
    interest: firstMonthInterest, // Add the interest field
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
  const firstMonthInterest = loanAmount * monthlyInterestRate;
  const firstMonthPayment = monthlyPrincipal + firstMonthInterest;
  
  return {
    monthlyPayment: firstMonthPayment, // Note: this is just the first month's payment, not constant
    totalInterest,
    firstMonthPrincipal: monthlyPrincipal,
    firstMonthInterest,
    interest: firstMonthInterest, // Add the interest field
    monthlyBreakdown
  };
};

/**
 * Calculates loan details for fixed installment repayment
 * Corrected to use proper compound interest calculation
 */
export const calculateFixedInstallmentLoan = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  const termMonths = termYears * 12;
  
  // Use the same monthly payment calculation as annuity loan
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
  
  // First month's values
  const firstMonthInterest = loanAmount * monthlyInterestRate;
  const firstMonthPrincipal = monthlyPayment - firstMonthInterest;
  
  return {
    monthlyPayment,
    totalInterest,
    firstMonthPrincipal,
    firstMonthInterest,
    interest: firstMonthInterest, // Add the interest field
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
  customPayment: number,
  strategy: 'minimum' | 'snowball' | 'avalanche' = 'minimum'
): LoanCalculationResult => {
  const monthlyInterestRate = calculateMonthlyInterestRate(annualInterestRate);
  
  // Check if custom payment is sufficient to cover minimum interest
  const minimumPayment = loanAmount * monthlyInterestRate;
  
  if (customPayment <= minimumPayment) {
    // If payment is too small, return a warning calculation
    return {
      monthlyPayment: customPayment,
      totalInterest: Infinity, // Indicate that the loan will never be paid off
      firstMonthPrincipal: 0,
      firstMonthInterest: minimumPayment,
      interest: minimumPayment,
      monthlyBreakdown: [{ principal: 0, interest: minimumPayment }],
      actualTermMonths: Infinity
    };
  }
  
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const monthlyBreakdown: { principal: number; interest: number }[] = [];
  let monthCount = 0;
  
  // Increase max months to a more realistic value - 100 years should be enough for any loan
  const maxMonths = 12 * 100; // 100 years as absolute maximum
  
  let currentPayment = customPayment;
  
  // Calculate the monthly breakdown
  while (remainingBalance > 0 && monthCount < maxMonths) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = currentPayment - interestPayment;
    
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
  
  // First month's values
  const firstMonthInterest = loanAmount * monthlyInterestRate;
  const firstMonthPrincipal = customPayment - firstMonthInterest;
  
  // Check if the loan will actually be paid off with the current payment
  // Use a better condition - check if remainingBalance is still significant
  const willNeverPayOff = monthCount >= maxMonths && remainingBalance > loanAmount * 0.01;
  
  if (willNeverPayOff) {
    return {
      monthlyPayment: customPayment,
      totalInterest: Infinity, // Indicate that the loan will never be paid off
      firstMonthPrincipal,
      firstMonthInterest,
      interest: firstMonthInterest,
      monthlyBreakdown: monthlyBreakdown.slice(0, 12), // Just return first year's breakdown
      actualTermMonths: Infinity
    };
  }
  
  return {
    monthlyPayment: customPayment,
    totalInterest,
    firstMonthPrincipal,
    firstMonthInterest,
    interest: firstMonthInterest,
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
  
  let result;
  
  switch (loan.repaymentType) {
    case 'annuity':
      result = calculateAnnuityLoan(loan.amount, effectiveInterestRate, loan.termYears);
      break;
    case 'equal-principal':
      result = calculateEqualPrincipalLoan(loan.amount, effectiveInterestRate, loan.termYears);
      break;
    case 'fixed-installment':
      result = calculateFixedInstallmentLoan(loan.amount, effectiveInterestRate, loan.termYears);
      break;
    case 'custom-payment':
      // Use a default payment if customPayment is not provided
      const customPayment = loan.customPayment || loan.amount / (loan.termYears * 12);
      result = calculateCustomPaymentLoan(loan.amount, effectiveInterestRate, loan.termYears, customPayment);
      break;
    default:
      throw new Error(`Unknown repayment type: ${loan.repaymentType}`);
  }
  
  // Add monthly fee to the payment if specified, but NOT to the total interest
  if (loan.monthlyFee && loan.monthlyFee > 0) {
    // Store the original monthly payment and total interest
    const originalMonthlyPayment = result.monthlyPayment;
    const originalTotalInterest = result.totalInterest;
    
    // Add fee to monthly payment
    result.monthlyPayment += loan.monthlyFee;
    
    // Add fees to a total fees calculation (separate from interest)
    const totalFees = loan.monthlyFee * (result.actualTermMonths || loan.termYears * 12);
    
    // Don't modify the total interest calculation
    result.totalInterest = originalTotalInterest;
    
    // Calculate appropriate first month interest (without fee)
    result.interest = result.firstMonthInterest;
  }
  
  return result;
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
  const maxTotalInterest = Math.max(...loansWithResults
    .filter(item => item.result.totalInterest !== Infinity) // Exclude loans that can't be paid off
    .map(item => item.result.totalInterest));
  
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
    totalPrincipal += result.firstMonthPrincipal;
    totalInterest += result.firstMonthInterest;
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

export const customPaymentLoanCalculator = (
  loanAmount: number,
  interestRate: number,
  customPayment: number,
  monthlyFee: number = 0,
  strategy: 'avalanche' | 'snowball' = 'avalanche'
): CustomPaymentResult => {
  if (loanAmount <= 0 || interestRate < 0 || customPayment <= 0) {
    throw new Error('Invalid input parameters');
  }

  const monthlyInterestRate = interestRate / 100 / 12;
  let remainingBalance = loanAmount;
  let monthCount = 0;
  
  // For tracking monthly breakdown
  const monthlyBreakdown: MonthlyBreakdown[] = [];
  
  // Increase max months to a more realistic value - 100 years should be enough for any loan
  const maxMonths = 12 * 100; // 100 years as absolute maximum
  
  let currentPayment = customPayment;
  
  // Calculate the monthly breakdown
  while (remainingBalance > 0 && monthCount < maxMonths) {
    // Calculate interest for this month
    const interestPayment = remainingBalance * monthlyInterestRate;
    
    // Calculate how much of the payment goes to principal
    const principalPayment = currentPayment - interestPayment;
    
    // If payment doesn't cover interest, loan will never be paid off
    if (principalPayment <= 0) {
      break;
    }
    
    // Update remaining balance
    remainingBalance -= principalPayment;
    
    // Add this month to the breakdown
    monthlyBreakdown.push({
      month: monthCount + 1,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      totalPayment: currentPayment + monthlyFee
    });
    
    monthCount++;
    
    // Handle small remaining amounts
    if (remainingBalance < 0.01) {
      remainingBalance = 0;
    }
  }
  
  // First month's values
  const firstMonthInterest = loanAmount * monthlyInterestRate;
  const firstMonthPrincipal = customPayment - firstMonthInterest;
  
  // If payment doesn't cover interest, loan will never be paid off
  if (firstMonthPrincipal <= 0) {
    // Return special case for impossible loan payoff
    return {
      monthlyPayment: customPayment + monthlyFee,
      totalPayment: Infinity,
      totalInterest: Infinity,
      loanAmount,
      interestRate,
      termMonths: Infinity,
      firstMonthPrincipal: 0,
      firstMonthInterest,
      interest: firstMonthInterest,
      monthlyBreakdown: monthlyBreakdown.slice(0, 12), // Just return first year's breakdown
      actualTermMonths: Infinity
    };
  }
  
  return {
    monthlyPayment: customPayment + monthlyFee,
    totalPayment: monthCount * customPayment + monthCount * monthlyFee,
    totalInterest: (monthCount * customPayment) - loanAmount + (monthCount * monthlyFee),
    loanAmount,
    interestRate,
    termMonths: monthCount,
    firstMonthPrincipal,
    firstMonthInterest,
    interest: firstMonthInterest,
    monthlyBreakdown,
    actualTermMonths: monthCount
  };
};
