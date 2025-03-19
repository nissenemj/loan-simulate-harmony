export const en = {
  app: {
    title: "Budgeting App",
    subtitle: "Easily manage your loans and credit cards"
  },
  form: {
    name: "Name",
    amount: "Amount",
    interestRate: "Interest Rate",
    termYears: "Term (Years)",
    repaymentType: "Repayment Type",
    interestType: "Interest Type",
    customPayment: "Custom Payment",
    addLoan: "Add Loan",
    addCreditCard: "Add Credit Card",
    monthlyPayment: "Monthly Payment",
    months: "months",
    balance: "Balance",
    limit: "Limit",
    apr: "APR",
    minPayment: "Minimum Payment",
    fullPayment: "Full Payment",
    isActive: "Active",
    save: "Save",
    cancel: "Cancel",
    title: "New Loan",
    submit: "Add Loan",
    placeholderName: "e.g. Mortgage",
    placeholderAmount: "10000",
    placeholderInterestRate: "5.0",
    placeholderTermYears: "10",
    estimatedTerm: "Estimated Term",
    paymentTooSmall: "Payment too small",
    years: "years",
    placeholderCustomPayment: "200"
  },
  repayment: {
    annuity: "Annuity",
    equalPrincipal: "Equal Principal",
    fixedInstallment: "Fixed Installment",
    customPayment: "Custom Payment",
    budgetTitle: "Monthly Budget",
    budgetDescription: "Enter your monthly budget for debt repayment",
    monthlyBudget: "Monthly Budget",
    prioritizationMethod: "Prioritization Method",
    selectMethod: "Select method",
    avalancheMethod: "Highest Interest First (Avalanche)",
    snowballMethod: "Smallest Balance First (Snowball)",
    avalancheDescription: "Paying highest interest rate debts first saves the most money over time.",
    snowballDescription: "Paying smallest balances first creates quick wins for motivation.",
    calculatePlan: "Calculate Repayment Plan",
    insufficientBudget: "Insufficient Budget",
    budgetTooLow: "Your budget is too low to cover all minimum payments.",
    planSummary: "Repayment Plan Summary",
    planDescription: "Based on your budget and debts, here's your path to financial freedom.",
    timeToFreedom: "Time to Debt Freedom",
    totalInterestPaid: "Total Interest Paid",
    firstDebtPaidOff: "First Debt Paid Off",
    monthlyAllocation: "Monthly Payment Allocation",
    allocationDescription: "How your monthly budget is allocated across debts",
    debtName: "Debt Name",
    minPayment: "Minimum Payment",
    extraPayment: "Extra Payment",
    totalPayment: "Total Payment",
    total: "Total",
    balanceTimeline: "Debt Balance Timeline",
    balanceTimelineDescription: "How your total debt will decrease over time",
    months: "Months",
    balance: "Balance (€)",
    debtPayoffSchedule: "Debt Payoff Schedule",
    payoffScheduleDescription: "When each debt will be paid off",
    payoffTime: "Payoff Time",
    totalRemaining: "Total Remaining Debt",
    noPlanYet: "No Repayment Plan Yet",
    enterBudgetPrompt: "Enter your monthly budget and click Calculate to see your repayment plan.",
    calculateNow: "Calculate Now",
    summaryTab: "Debt Summary",
    planTab: "Repayment Plan"
  },
  interest: {
    fixed: "Fixed",
    variableEuribor: "Variable (EURIBOR)"
  },
  validation: {
    nameRequired: "Name is required",
    nameRequiredDesc: "Please provide a name for the loan",
    invalidAmount: "Invalid amount",
    invalidAmountDesc: "Amount must be a positive number",
    invalidRate: "Invalid interest rate",
    invalidRateDesc: "Interest rate must be a positive number",
    invalidTerm: "Invalid term",
    invalidTermDesc: "Term must be a positive integer",
    invalidPayment: "Invalid payment",
    invalidPaymentDesc: "Payment must be a positive number",
    paymentTooSmall: "Payment too small",
    paymentTooSmallDesc: "Payment must be greater than monthly interest"
  },
  loan: {
    types: {
      annuity: "Annuity",
      "equal-principal": "Equal Principal",
      "fixed-installment": "Fixed Installment",
      "custom-payment": "Custom Payment",
    },
    interestTypes: {
      fixed: "Fixed",
      "variable-euribor": "Variable (EURIBOR)",
    },
    table: {
      name: "Loan Name",
      amount: "Amount",
      interestRate: "Interest Rate",
      term: "Term",
      monthlyPayment: "Monthly Payment",
      totalInterest: "Total Interest",
      payoffTime: "Payoff Time",
      active: "Active",
      noLoans: "No loans added yet.",
    },
  },
  creditCard: {
    title: "New Credit Card",
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
      totalLimit: "Total Limit",
      totalMinPayment: "Total Minimum Payment",
      totalInterest: "Total Monthly Interest",
      totalUtilization: "Total Utilization",
    },
    form: {
      name: "Card Name",
      balance: "Balance",
      limit: "Credit Limit",
      apr: "APR",
      minPayment: "Minimum Payment",
      minPaymentPercent: "Minimum Payment (%)",
      fullPayment: "Pay full balance monthly",
      submit: "Add Credit Card",
      placeholderName: "e.g. Visa",
      placeholderBalance: "1000",
      placeholderCreditLimit: "5000",
      placeholderApr: "18.0",
      placeholderMinPayment: "30",
      autoCalculated: "Automatically calculated from balance and percentage"
    },
  },
  debtSummary: {
    pageTitle: "Debt Summary",
    pageDescription: "Overview of your debts and potential savings.",
    metaDescription: "Get a clear overview of your debts and discover ways to save money.",
    backButton: "Back to Calculator",
    totalMonthlyPayment: "Total Monthly Payment",
    totalMonthlyInterest: "Total Monthly Interest",
    totalBalance: "Total Balance",
    loansSection: "Loans Overview",
    creditCardsSection: "Credit Cards Overview",
    totalSummarySection: "Total Debt Summary",
    demoDataMessage: "Displaying demo data. Add your own debts for personalized insights.",
    noLoansMessage: "No loans added yet. Please add your loans to see the summary.",
    noCardsMessage: "No credit cards added yet. Please add your credit cards to see the summary.",
    cardName: "Card Name",
    monthlyPayment: "Monthly Payment",
    monthlyInterest: "Monthly Interest",
    totalInterestEstimate: "Total Interest Estimate",
    totalCards: "Total Cards",
    neverPaidOff: "Never Paid Off",
    loanName: "Loan Name",
    totalLifetimeInterest: "Total Lifetime Interest",
    summaryExplanation: "This summary shows the overall picture of your debts and helps prioritize your repayment strategy.",
    totalLoans: "Total Loans",
    payoffButton: "Pay Off",
    actions: "Actions"
  },
  recommendations: {
    title: "Repayment Recommendations",
    topPriority: "Top Priority",
    highInterest: "High Interest Rate",
    highTotalInterest: "High Total Interest",
    topPriorityText: "Pay off this loan first to save the most money.",
    topPriorityTextPlural: "Pay off these loans first to save the most money.",
    highInterestText: "Consider paying off this loan faster due to its high interest rate.",
    highInterestTextPlural: "Consider paying off these loans faster due to their high interest rates.",
    highTotalInterestText: "Paying off this loan early will save you a significant amount of interest.",
    highTotalInterestTextPlural: "Paying off these loans early will save you a significant amount of interest.",
  },
  savings: {
    title: "Potential Savings",
    description: "Paying off loans faster can save you a significant amount on interest.",
    payingOffNow: "Paying off now",
    payOff: "Pay Off",
  },
  table: {
    year: "year",
    years: "years",
  },
  toast: {
    loanActivated: "Loan activated",
    loanDeactivated: "Loan deactivated",
    loanPaidOff: "Loan paid off",
    loanAdded: "Loan added",
    cardPaidOff: "Card paid off",
  },
  language: {
    en: "English",
    fi: "Suomi"
  },
  tabs: {
    loans: "Loans",
    creditCards: "Credit Cards",
    affiliate: "Offers",
    debtSummary: "Debt Summary",
    loanTerms: "Loan Terms"
  },
  loanTerms: {
    pageTitle: "Loan Terms Explained Simply",
    backButton: "Back",
    introduction: "Loan terms explained in simple terms. Understand financial terms easily.",
    searchPlaceholder: "Search for a term...",
    noResults: "No results found. Try a different search term.",
    interestRate: {
      title: "Interest Rate",
      description: "The interest rate is the amount you pay to the lender for the use of their money. It's expressed as a percentage of the loan principal and is typically paid monthly."
    },
    annuity: {
      title: "Annuity",
      description: "With an annuity loan, you pay the same amount every month throughout the loan term. Initially, a larger portion of your payment goes toward interest, and over time, more goes toward reducing the principal amount."
    },
    principal: {
      title: "Principal",
      description: "The principal is the original amount of money you borrowed. Your monthly payment consists of repaying this principal plus interest."
    },
    euribor: {
      title: "Euribor",
      description: "Euribor (Euro Interbank Offered Rate) is a reference rate to which many variable-rate loans are tied. It reflects the rate at which European banks lend to each other and can change over time, affecting your total loan interest rate."
    },
    totalInterest: {
      title: "Total Interest",
      description: "Total interest is the sum of all interest payments you make over the life of the loan. It depends on the loan amount, interest rate, term length, and repayment type."
    },
    termYears: {
      title: "Term (Years)",
      description: "The loan term is the period over which you agree to repay the loan. A longer term typically means lower monthly payments but more total interest paid."
    },
    equalPrincipal: {
      title: "Equal Principal",
      description: "With an equal principal loan, you pay the same amount of principal every month, but the interest portion decreases over time. Thus, your monthly payments are higher at the beginning and decrease over time."
    },
    fixedInstallment: {
      title: "Fixed Installment",
      description: "With a fixed installment loan, you pay the same amount every month. This payment type is similar to annuity but is often used when the interest rate may vary."
    }
  },
  auth: {
    welcome: "Welcome to Loan Calculator",
    description: "Sign in to your account or create a new one",
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    loggingIn: "Logging in...",
    signingUp: "Signing up...",
    logout: "Log out",
    loginSuccess: "Login successful",
    welcomeBack: "Welcome back!",
    loginError: "Login failed",
    signupSuccess: "Sign up successful",
    checkEmail: "Please check your email to verify your account",
    signupError: "Sign up failed"
  }
}
