
// en.ts

export const en = {
  app: {
    title: "Debt Advisor",
    description: "Simulate and plan your debt repayment.",
    language: "Language",
    footer: "Made with ❤️ by Finance Wizards"
  },
  tabs: {
    dashboard: "Dashboard",
    loans: "Loans",
    creditCards: "Credit Cards",
    debtSummary: "Debt Summary",
    glossary: "Glossary",
    affiliate: "Affiliate",
    blog: "Blog",
  },
  navigation: {
    dashboard: "Dashboard",
    calculator: "Loan Simulator",
    debtStrategies: "Debt Repayment Strategies",
    blog: "Blog",
    account: "Account",
    menu: "Menu",
    language: "Language"
  },
  form: {
    labels: {
      loanName: "Loan Name",
      loanAmount: "Loan Amount",
      interestRate: "Interest Rate",
      loanTerm: "Loan Term",
      monthlyPayment: "Monthly Payment",
      startDate: "Start Date",
      endDate: "End Date",
      additionalPayment: "Additional Payment",
      paymentFrequency: "Payment Frequency",
      selectLoanType: "Select Loan Type",
      enterCreditCardDetails: "Enter Credit Card Details",
      creditCardName: "Credit Card Name",
      creditCardBalance: "Credit Card Balance",
      creditCardAPR: "Credit Card APR",
      creditCardMinPayment: "Credit Card Min Payment",
      minPayment: "Minimum Payment",
      balance: "Balance",
      apr: "APR",
      name: "Name",
      amount: "Amount",
      termYears: "Term in Years",
      interestType: "Interest Type",
      repaymentType: "Repayment Type",
      monthlyFee: "Monthly Fee",
      variableEuribor: "Variable + Margin",
      fixedInterestRate: "Fixed Rate",
    },
    placeholders: {
      loanNamePlaceholder: "Enter loan name",
      loanAmountPlaceholder: "Enter loan amount",
      interestRatePlaceholder: "Enter interest rate",
      loanTermPlaceholder: "Enter loan term",
      monthlyPaymentPlaceholder: "Enter monthly payment",
      startDatePlaceholder: "Select start date",
      endDatePlaceholder: "Select end date",
      additionalPaymentPlaceholder: "Enter additional payment",
      creditCardNamePlaceholder: "Enter credit card name",
      creditCardBalancePlaceholder: "Enter credit card balance",
      creditCardAPRPlaceholder: "Enter credit card APR",
      creditCardMinPaymentPlaceholder: "Enter credit card min payment",
      amountPlaceholder: "Amount",
      termYearsPlaceholder: "Term in years",
      monthlyFeePlaceholder: "Monthly fee",
      namePlaceholder: "e.g. Home Loan",

    },
    loanTypes: {
      personalLoan: "Personal Loan",
      mortgage: "Mortgage",
      autoLoan: "Auto Loan",
      studentLoan: "Student Loan",
      creditCard: "Credit Card",
      other: "Other",
    },
    paymentFrequencies: {
      monthly: "Monthly",
      biWeekly: "Bi-Weekly",
      weekly: "Weekly",
    },
    buttons: {
      addLoan: "Add Loan",
      addCreditCard: "Add Credit Card",
      calculate: "Calculate",
      reset: "Reset",
      remove: "Remove",
      update: "Update",
      cancel: "Cancel",
      save: "Save",
      payoff: "Pay Off",
      submit: "Add",
    },
    tooltips: {
      interestRate: "Interest rate of the loan",
      loanTerm: "Term of the loan",
      monthlyPayment: "Monthly payment amount",
      additionalPayment: "Additional payment amount",
    },
    validation: {
      required: "Required field",
      number: "Please enter a number",
      min: "Please enter at least {min}",
      max: "Please enter at most {max}",
      email: "Please enter a valid email",
    },
    interestTypes: {
      fixed: "Fixed",
      variable: "Variable",
    },
    repaymentTypes: {
      annuity: "Annuity",
      equalPrincipal: "Equal Principal",
      fixedInstallment: "Fixed Installment",
      customPayment: "Custom Payment",
    },
    months: {
      month: "Month",
      months: "Months",
    },
    title: "New Loan",
    editTitle: "Edit Loan",
    monthlyFeeDescription: "Optional monthly service fee for the loan"
  },
  table: {
    headers: {
      loanName: "Loan Name",
      loanAmount: "Loan Amount",
      interestRate: "Interest Rate",
      loanTerm: "Loan Term",
      monthlyPayment: "Monthly Payment",
      startDate: "Start Date",
      endDate: "End Date",
      additionalPayment: "Additional Payment",
    },
    name: "Name",
    amount: "Amount",
    interestRate: "Interest Rate",
    term: "Term",
    monthlyPayment: "Monthly Payment",
    balance: "Balance",
    apr: "APR",
    minPayment: "Min Payment",
    actions: "Actions",
    edit: "Edit",
    toggleActive: "Toggle Active",
    payoff: "Pay Off",
    year: "year",
    years: "years",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment"
  },
  results: {
    summary: "Summary",
    monthlyPayment: "Monthly Payment",
    totalInterest: "Total Interest Paid",
    totalPayments: "Total Payments",
    payoffDate: "Payoff Date",
    timeToPayoff: "Time to Pay Off",
    years: "Years",
    months: "Months",
    interestSaved: "Interest Saved",
    fasterPayoff: "Faster Payoff",
  },
  loanList: {
    title: "Loans",
    addLoan: "Add Loan",
    editLoan: "Edit Loan",
    deleteLoan: "Delete Loan",
    confirmDelete: "Are you sure you want to delete this loan?",
  },
  creditCardList: {
    title: "Credit Cards",
    addCreditCard: "Add Credit Card",
    editCreditCard: "Edit Credit Card",
    deleteCreditCard: "Delete Credit Card",
    confirmDelete: "Are you sure you want to delete this credit card?",
  },
  debtSummary: {
    title: "Debt Summary",
    cardName: "Name",
    monthlyPayment: "Monthly Payment",
    monthlyInterest: "Monthly Interest",
    totalLifetimeInterest: "Total Lifetime Interest",
    payoffButton: "Pay Off",
    noCardsMessage: "No credit cards added.",
    totalCards: "Total",
    neverPaidOff: "Never paid off",
    demoDataMessage: "This is demo data. Add your own credit cards to get a personalized estimate.",
    actions: "Actions",
    loanName: "Loan Name",
    monthlyInterestEstimate: "Monthly Interest Est.",
    totalInterestEstimate: "Total Interest Est.",
    noLoansMessage: "No loans added.",
    totalLoans: "Loans Total",
    totalSummarySection: "Debt Totals",
    backButton: "Back",
    pageTitle: "Your Debt Summary",
    pageDescription: "Review your overall debt situation and payment scenarios.",
    loansSection: "Loans",
    creditCardsSection: "Credit Cards",
    totalMonthlyPayment: "Total Monthly Payment",
    totalMonthlyInterest: "Total Monthly Interest",
    totalBalance: "Total Balance",
    tableSummary: "Debt Relationship Summary",
    totalAmountPaid: "Total Amount Paid",
    metaDescription: "Review your overall debt situation, including loans and credit cards.",
    includingInterestAndFees: "Including principal, interest, and fees"
  },
  auth: {
    login: "Log In",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    logout: "Log Out",
    error: "Invalid email or password",
    success: "Login successful",
    registerSuccess: "Registration successful",
    resetSuccess: "Password reset successful",
  },
  loan: {
    loanDetails: "Loan Details",
    loanAmount: "Loan Amount",
    interestRate: "Interest Rate",
    loanTerm: "Loan Term",
    monthlyPayment: "Monthly Payment",
    startDate: "Start Date",
    endDate: "End Date",
    additionalPayment: "Additional Payment",
    types: {
      annuity: "Annuity",
      equalPrincipal: "Equal Principal",
      fixedInstallment: "Fixed Installment",
      customPayment: "Custom Payment",
    },
    table: {
      name: "Name",
      monthlyPayment: "Monthly Payment",
      interestRate: "Interest Rate",
      totalInterest: "Total Interest",
      term: "Term",
      noLoans: "No loans added.",
    },
  },
  creditCard: {
    cardDetails: "Credit Card Details",
    cardBalance: "Credit Card Balance",
    cardAPR: "Credit Card APR",
    cardMinPayment: "Credit Card Min Payment",
    summary: {
      title: "Credit Card Summary",
      totalBalance: "Total Balance",
      totalMinPayment: "Total Min Payment",
      totalMonthlyInterest: "Total Monthly Interest",
      totalLimit: "Total Credit Limit",
      totalUtilization: "Total Utilization",
    },
  },
  calculator: {
    debtPayoffCalculator: "Debt Payoff Calculator",
    debtPayoffTimeline: "Debt Payoff Timeline",
    extraPaymentImpact: "Extra Payment Impact",
    debtConsolidation: "Debt Consolidation",
    addYourDebts: "Add Your Debts",
    debtName: "Debt Name",
    balance: "Balance",
    interestRate: "Interest Rate",
    minimumPayment: "Minimum Payment",
    debtNamePlaceholder: "Enter debt name",
    addDebt: "Add Debt",
    yourDebts: "Your Debts",
    actions: "Actions",
    total: "Total",
    paymentStrategy: "Payment Strategy",
    additionalMonthlyPayment: "Additional Monthly Payment",
    additionalPaymentDescription: "Extra payment per month",
    totalMonthlyPayment: "Total Monthly Payment",
    paymentResults: "Payment Results",
    payoffDate: "Payoff Date",
    estimatedCompletion: "Estimated Completion",
    totalInterest: "Total Interest",
    interestPaid: "Interest Paid",
    totalPaid: "Total Paid",
    principalPlusInterest: "Principal + Interest",
    saveResults: "Save Results",
    avalanche: "Avalanche",
    snowball: "Snowball",
    avalancheStrategy: "Avalanche Strategy",
    avalancheDescription: "Pay off highest interest rate debt first.",
    snowballStrategy: "Snowball Strategy",
    snowballDescription: "Pay off smallest debt first.",
    timelineDescription: "Month-by-month debt payoff timeline.",
    noDebtsAdded: "No debts added.",
    previous: "Previous",
    next: "Next",
    month: "Month",
    of: " of ",
    principalPaid: "Principal Paid",
    remainingBalances: "Remaining Balances",
    payment: "Payment",
    remainingBalance: "Remaining Balance",
    paidOff: "Paid Off",
    debtsPaidOff: "Debts Paid Off",
    congratulations: "Congratulations!",
    debtFreeMessage: "You are now debt free!",
    calculateFirst: "Calculate debt payoff first.",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
  },
  debtStrategies: {
    pageTitle: "Debt Repayment Strategies",
    pageDescription: "Plan and simulate the repayment of your debts.",
    noDebtAlert: "Add loans or credit cards to get started.",
    calculateFirst: "Calculate debt payoff first.",
  },
  repayment: {
    repaymentType: "Repayment Type",
    planSummary: "Plan Summary",
    planDescription: "Overview of your repayment plan.",
    timeToFreedom: "Time to Freedom",
    totalInterestPaid: "Total Interest Paid",
    firstDebtPaidOff: "First Debt Paid Off",
    monthlyAllocation: "Monthly Allocation",
    allocationDescription: "Monthly allocation to your debts.",
    debtName: "Debt Name",
    minPayment: "Min Payment",
    extraPayment: "Extra Payment",
    totalPayment: "Total Payment",
    total: "Total",
    balanceTimeline: "Balance Timeline",
    balanceTimelineDescription: "Balance progression over time.",
    months: "Months",
    balance: "Balance",
    totalRemaining: "Total Remaining Balance",
    debtPayoffSchedule: "Debt Payoff Schedule",
    payoffScheduleDescription: "Schedule of debt payoffs.",
    payoffTime: "Payoff Time",
    insufficientBudget: "Insufficient Budget",
    budgetTooLow: "Your budget is too low to pay off your debts.",
    summaryTab: "Summary",
    planTab: "Repayment Plan",
    noPlanYet: "No repayment plan yet",
    enterBudgetPrompt: "Enter your monthly budget and calculate a repayment plan",
    calculateNow: "Calculate Now",
    avalancheStrategy: "Avalanche Strategy",
    snowballStrategy: "Snowball Strategy",
    avalancheDesc: "Highest interest first",
    snowballDesc: "Smallest balance first"
  },
  visualization: {
    debtBreakdown: "Debt Breakdown",
    distributionDescription: "Distribution of your debts",
    paymentBreakdown: "Payment Breakdown",
    paymentDistribution: "Distribution of your payments",
    interestVsPrincipal: "Interest vs. Principal",
    paymentTimeline: "Payment Timeline",
    strategyComparison: "Strategy Comparison",
    timeToPayoff: "Time to Payoff",
    interestSaved: "Interest Saved",
    monthsSaved: "Months Saved"
  },
  language: {
    en: "English",
    fi: "Suomi"
  },
  toast: {
    loanPaidOff: "Loan paid off",
    cardPaidOff: "Credit card paid off",
    loanAdded: "Loan added successfully",
    loanUpdated: "Loan updated successfully",
    loanDeleted: "Loan deleted successfully",
    cardAdded: "Credit card added successfully",
    cardUpdated: "Credit card updated successfully",
    cardDeleted: "Credit card deleted successfully"
  },
  recommendations: {
    title: "Recommendations",
    topPriority: "Top Priority",
    topPriorityText: "This loan should be paid off first due to high cost.",
    topPriorityTextPlural: "These loans should be paid off first due to high cost.",
    highInterest: "Highest Interest",
    highInterestText: "This loan costs the most in interest monthly.",
    highInterestTextPlural: "These loans cost the most in interest monthly.",
    highTotalInterest: "Highest Total Interest Cost",
    highTotalInterestText: "This loan costs the most in interest over its lifetime.",
    highTotalInterestTextPlural: "These loans cost the most in interest over their lifetimes."
  },
  tooltips: {
    totalDebt: "Sum of all active loan amounts and credit card balances.",
    interestCost: "Estimated total interest you'll pay on all your debts at current rates and payments.",
    debtFreeDate: "Estimated date when all your debts will be paid off at current payment amounts.",
    minimumPayments: "Combined minimum payments required for all your loans and credit cards.",
    totalToPayOff: "Total amount, including principal and interest, you'll pay over the lifetime of all your debts."
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System"
  },
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome",
    welcomeSubtitle: "Here's an overview of your debt management",
    viewDebtSummary: "View Debt Summary",
    viewDetailedBreakdown: "View Detailed Breakdown",
    totalDebt: "Total Debt",
    estimatedInterestCost: "Estimated Interest Cost",
    estimatedDebtFreeDate: "Estimated Debt-Free Date",
    minimumMonthlyPayments: "Minimum Monthly Payments",
    perMonth: "per month",
    totalToPayOff: "Total To Pay Off",
    paymentPlanSummary: "Payment Plan Summary",
    paymentPlanDescription: "Your debt repayment strategy at a glance",
    monthlyBudget: "Monthly Budget",
    minimumPayments: "Minimum Payments",
    extraBudget: "Extra Budget",
    prioritizedDebt: "Prioritized Debt",
    interestRate: "interest rate",
    allocatingExtra: "Allocating extra {{amount}} to this debt",
    viewFullPlan: "View Full Plan",
    debtBreakdown: "Debt Breakdown",
    allDebts: "All Debts",
    loans: "Loans",
    creditCards: "Credit Cards",
    financialTips: "Financial Tips",
    tip1: "Pay off high-interest debts first to save money in the long run (avalanche method).",
    tip2: "Build an emergency fund of at least 3 months of expenses to avoid new debt.",
    tip3: "Consider debt consolidation if you have multiple high-interest debts.",
    viewGlossary: "View Financial Glossary",
    debtFreeTimeline: "Debt-Free Timeline",
    timelineDescription: "Estimated journey to financial freedom",
    timelineExplanation: "This chart shows how quickly each debt will be paid off with your chosen strategy",
    paymentFlowExplanation: "Once a debt is paid off, its allocated budget moves to the next priority debt",
    now: "Now",
    currentDebt: "Current Debt",
    creditCardsFree: "Credit Cards Paid Off",
    projectDate: "Projected Date",
    debtFree: "Debt Free",
    viewDetailedTimeline: "View Detailed Timeline",
    helpWithDebt: "Need Help With Your Debt?",
    year: "year",
    goToRepaymentPlan: "Go to Repayment Plan",
    currentPaymentAmount: "Current Payment Amount",
    monthlyPaymentAmount: "Monthly Payment Amount",
    minimum: "Minimum",
    maximum: "Maximum",
    recommendedStrategy: "Recommended Strategy",
    recommendation: "Recommendation",
    equalStrategy: "Equal Distribution",
    snowballStrategy: "Snowball",
    avalancheStrategy: "Avalanche",
    equalDistribution: "Equal Distribution Strategy",
    compareScenarios: "Compare Scenarios",
    compareScenariosTooltip: "Compare different repayment scenarios",
    exportData: "Export Debt Data as CSV",
    dataExported: "Data exported successfully",
    guest: "Guest"
  },
  footer: {
    about: {
      title: "About Loan Simulate Harmony",
      description: "Loan Simulate Harmony is a free tool to help you create and track a customized debt repayment plan."
    },
    links: {
      title: "Quick Links",
      item1: "Dashboard",
      item2: "Loan Terms",
      item3: "Debt Summary"
    },
    legal: {
      title: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy"
    },
    copyright: "All Rights Reserved."
  },
  landing: {
    seo: {
      title: "Make Debt Repayment Easy - Free Financial Tool | Loan Simulate Harmony",
      description: "Create a free debt repayment plan and take control of your finances with Loan Simulate Harmony. Start your debt-free journey today!",
      keywords: "debt repayment, loan management, financial tools, debt snowball, debt avalanche, financial freedom, debt free"
    }
  },
  noDebtToDisplay: "No debts to display"
};

// Also export as default for backward compatibility
export default en;
