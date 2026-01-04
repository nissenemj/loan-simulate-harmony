
// Mocking the calculation functions from src/utils/loanCalculations.ts to run in isolation
const calculateMonthlyInterestRate = (annualRate: number) => annualRate / 12 / 100;

const calculateAnnuityLoan = (amount: number, rate: number, years: number) => {
    const monthlyRate = calculateMonthlyInterestRate(rate);
    const months = years * 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
};

// Test Case 1: Standard Annuity
// 10,000 EUR, 5% annual rate, 5 years
// PMT(0.05/12, 60, 10000) = 188.71 EUR
console.log("--- Test Case 1: Standard Fixed Rate ---");
const pmt1 = calculateAnnuityLoan(10000, 5, 5);
console.log(`Expected: ~188.71`);
console.log(`Calculated: ${pmt1.toFixed(2)}`);

// Test Case 2: Variable Rate with Hidden +1% Logic
// User enters 5% (margin + euribor presumably), but selects 'variable-euribor'
// Code does: rate + 1 = 6%
// PMT(0.06/12, 60, 10000) = 193.33 EUR
console.log("\n--- Test Case 2: Variable Rate (Hidden +1%) ---");
const userRate = 5;
const effectiveRate = userRate + 1; // Logic from code
const pmt2 = calculateAnnuityLoan(10000, effectiveRate, 5);
console.log(`User Input Rate: ${userRate}%`);
console.log(`Effective Rate Used: ${effectiveRate}%`);
console.log(`Calculated: ${pmt2.toFixed(2)}`);
console.log(`Difference: ${(pmt2 - pmt1).toFixed(2)} EUR/month`);

// Test Case 3: Fixed Installment (Tasaerä) Logic Check
// In current code, 'fixed-installment' uses annuity formula.
// Real Tasaerä: User sets payment (e.g., 200e), Term is calculated.
// Current code calculates payment based on term. 
console.log("\n--- Test Case 3: Fixed Installment Logic ---");
console.log("Current code uses Annuity formula for Fixed Installment.");
console.log("If user expected to define the amount, this is wrong.");
