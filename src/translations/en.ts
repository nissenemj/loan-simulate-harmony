export default {
  app: {
    title: "Loan Calculator",
    subtitle: "Calculate your loan repayments with ease.",
    footer: "© {year} Loan Calculator. All rights reserved.",
  },
  form: {
    name: "Loan Name",
    amount: "Loan Amount",
    interestRate: "Interest Rate (%)",
    termYears: "Loan Term (Years)",
    repaymentType: "Repayment Type",
    interestType: "Interest Type",
    customPayment: "Custom Payment Amount",
    annuity: "Annuity (Equal Payments)",
    equalPrincipal: "Equal Principal Payments",
    fixedInstallment: "Fixed Installment",
    customPaymentType: "Custom Payment",
    fixed: "Fixed",
    variableEuribor: "Variable (EURIBOR +)",
    submit: "Calculate",
    reset: "Reset",
    placeholderName: "e.g., Home Loan",
    placeholderAmount: "e.g., 200000",
    placeholderInterestRate: "e.g., 5.0",
    placeholderTermYears: "e.g., 30",
    placeholderCustomPayment: "e.g., 1000",
  },
  table: {
    name: "Loan Name",
    payment: "Monthly Payment",
    interest: "Interest Rate",
    totalInterest: "Total Interest",
    term: "Term",
    type: "Repayment Type",
    active: "Active",
    year: "year",
    years: "years",
    noLoans: "No loans added yet.",
  },
  summary: {
    monthlyPayment: "Total Monthly Payment",
    monthlyPrincipal: "Total Monthly Principal",
    monthlyInterest: "Total Monthly Interest",
  },
  recommendations: {
    title: "Recommendations",
    topPriority: "Top Priority Loan",
    topPriorityText: "This loan has both the highest interest rate and contributes the most to your total interest paid. Paying it off early will save you the most money.",
    topPriorityTextPlural: "These loans have both the highest interest rates and contribute the most to your total interest paid. Paying them off early will save you the most money.",
    highestInterest: "Loan with Highest Total Interest",
    highestInterestText: "This loan will accrue the most interest over its term. Consider prioritizing repayment to minimize long-term costs.",
    highestInterestTextPlural: "These loans will accrue the most interest over their terms. Consider prioritizing repayment to minimize long-term costs.",
    highestRate: "Loan with Highest Interest Rate",
    highestRateText: "This loan has the highest interest rate. Prioritizing repayment can save you a significant amount of money.",
    highestRateTextPlural: "These loans have the highest interest rates. Prioritizing repayment can save you a significant amount of money.",
  },
  repayment: {
    annuity: "Annuity",
    equalPrincipal: "Equal Principal",
    fixedInstallment: "Fixed Installment",
  },
  tabs: {
    loans: "Loans",
    creditCards: "Credit Cards",
    affiliate: "Offers",
    loanTerms: "Loan Terms",
    debtSummary: "Debt Summary"
  },
  creditCard: {
    form: {
      name: "Card Name",
      balance: "Current Balance",
      apr: "APR (%)",
      minPayment: "Minimum Payment",
      minPaymentPercent: "Minimum Payment (%)",
      fullPayment: "Pay Full Balance Each Month",
      creditLimit: "Credit Limit",
      placeholderName: "e.g., Visa",
      placeholderBalance: "e.g., 2000",
      placeholderApr: "e.g., 18.0",
      placeholderMinPayment: "e.g., 25",
      placeholderCreditLimit: "e.g., 10000",
    },
    table: {
      name: "Card Name",
      balance: "Balance",
      apr: "APR",
      minPayment: "Min. Payment",
      monthlyInterest: "Monthly Interest",
      payoffTime: "Payoff Time",
      utilization: "Utilization",
      active: "Active",
      noCards: "No credit cards added yet.",
    },
    summary: {
      title: "Credit Card Summary",
      totalBalance: "Total Balance",
      totalLimit: "Total Credit Limit",
      totalMinPayment: "Total Minimum Payment",
      totalAvailableCredit: "Total Available Credit",
      totalInterest: "Total Monthly Interest",
      totalUtilization: "Total Utilization Rate",
    },
  },
  utilization: {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  },
  toast: {
    loanActivated: "Loan activated",
    loanDeactivated: "Loan deactivated",
    loanPaidOff: "Loan paid off",
  },
  savings: {
    title: "Savings Impact",
    payingOffNow: "Paying off now saves",
    payOff: "Pay Off",
    description: "These calculations show how much interest you would save by paying off your loans early.",
  },
  language: {
    en: "English",
    fi: "Finnish"
  },
  affiliate: {
    title: "Special Offers",
    subtitle: "Exclusive deals from our trusted partners",
    compareLoans: "Compare Loan Offers",
    refinanceTitle: "Looking to refinance?",
    refinanceText: "Check these trusted providers for competitive rates",
    creditCardTitle: "Find the best credit card",
    creditCardText: "Compare rewards, rates, and benefits",
    mortgageTitle: "Home Loan Solutions",
    mortgageText: "Find the perfect mortgage for your needs",
    cta: "Learn More",
    disclaimer: "Disclosure: We may receive compensation when you click on links to products. This does not affect our recommendations or evaluations."
  },
  loanTerms: {
    pageTitle: "Loan Terms Explained",
    introduction: "Understanding financial terminology helps you make better decisions about your loans. Here's a simple explanation of the key terms used in our calculator.",
    searchPlaceholder: "Search terms...",
    backButton: "Back",
    noResults: "No terms match your search.",
    interestRate: {
      title: "Interest Rate",
      description: "The extra cost you pay for borrowing money, expressed as a percentage. For example, a 5% interest rate on a $10,000 loan means you pay an extra $500 per year for borrowing that money."
    },
    annuity: {
      title: "Annuity",
      description: "A repayment plan where you pay the same total amount every month throughout the loan term. Each payment includes both principal (the original loan amount) and interest, with the proportion of principal increasing over time."
    },
    principal: {
      title: "Principal",
      description: "The original amount you borrowed before any interest is added. When you make loan payments, part goes toward reducing this principal, and part pays the interest."
    },
    euribor: {
      title: "Euribor",
      description: "The Euro Interbank Offered Rate - a benchmark interest rate used across Europe. If your loan has a variable rate tied to Euribor, your interest payments may go up or down as this rate changes in the market."
    },
    totalInterest: {
      title: "Total Interest",
      description: "The full extra amount you'll pay over the entire life of the loan on top of what you borrowed. For example, if you borrow $100,000 and end up paying back $150,000 total, the total interest is $50,000."
    },
    termYears: {
      title: "Loan Term",
      description: "The length of time you have to repay the loan, usually expressed in years. A longer term means lower monthly payments but more interest paid overall."
    },
    equalPrincipal: {
      title: "Equal Principal Payments",
      description: "A repayment method where you pay back the same amount of principal each month, plus interest. Your total payment decreases over time as the interest portion gets smaller."
    },
    fixedInstallment: {
      title: "Fixed Installment",
      description: "A repayment method where you pay the same total amount each month, similar to an annuity. However, this method allows you to specify the exact payment amount, which may affect your loan term."
    }
  },
  debtSummary: {
    pageTitle: "Debt Summary",
    metaDescription: "View your monthly loan and credit card payments, interest, and total costs in one place.",
    pageDescription: "Get a comprehensive overview of your debt obligations and total costs.",
    backButton: "Back to Calculator",
    loansSection: "Loans",
    creditCardsSection: "Credit Cards",
    totalSummarySection: "Total Debt Summary",
    loanName: "Loan Name",
    cardName: "Card Name",
    monthlyPayment: "Monthly Payment",
    monthlyInterest: "Monthly Interest",
    totalInterestEstimate: "Total Interest Estimate",
    totalLoans: "Total (Loans)",
    totalCards: "Total (Cards)",
    totalMonthlyPayment: "Total Monthly Payment",
    totalMonthlyInterest: "Total Monthly Interest",
    totalLifetimeInterest: "Total Lifetime Interest",
    summaryExplanation: "This summary combines all your active debts to show your total monthly obligations and the estimated total interest you'll pay over the life of your debts.",
    demoDataMessage: "Showing sample data. Add actual loans and credit cards to see your own summary.",
    noLoansMessage: "No loans added yet. Add loans to see your summary.",
    noCardsMessage: "No credit cards added yet. Add credit cards to see your summary.",
    neverPaidOff: "Never paid off"
  }
} as const;
