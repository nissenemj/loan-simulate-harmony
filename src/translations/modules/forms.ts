
// Form-related translations

export const forms = {
  en: {
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
      monthlyFeeDescription: "Optional monthly service fee for the loan",
      loanFormAriaLabel: "Loan addition form",
      loanNameAriaLabel: "Loan name",
      loanAmountAriaLabel: "Loan amount in euros",
      interestRateAriaLabel: "Interest rate as percentage",
      termYearsAriaLabel: "Loan term in years",
      repaymentTypeAriaLabel: "Repayment type",
      interestTypeAriaLabel: "Interest type",
      customPaymentAriaLabel: "Custom monthly payment",
      monthlyFeeAriaLabel: "Monthly fee",
      cancelAriaLabel: "Cancel editing",
      updateAriaLabel: "Update loan",
      submitAriaLabel: "Add loan",
      selectRepaymentType: "Select repayment type",
      selectInterestType: "Select interest type",
      estimatedTerm: "Estimated term",
      years: "years",
      loanUpdatedDesc: "Your loan has been updated successfully",
      loanAddedDesc: "Your loan has been added successfully"
    }
  },
  fi: {
    form: {
      labels: {
        loanName: "Lainan nimi",
        loanAmount: "Lainan määrä",
        interestRate: "Korkoprosentti",
        loanTerm: "Laina-aika",
        monthlyPayment: "Kuukausierä",
        startDate: "Aloituspäivä",
        endDate: "Päättymispäivä",
        additionalPayment: "Lisämaksu",
        paymentFrequency: "Maksutiheys",
        selectLoanType: "Valitse lainan tyyppi",
        enterCreditCardDetails: "Syötä luottokortin tiedot",
        creditCardName: "Luottokortin nimi",
        creditCardBalance: "Luottokortin saldo",
        creditCardAPR: "Luottokortin korko",
        creditCardMinPayment: "Luottokortin minimimaksu",
        minPayment: "Minimimaksu",
        balance: "Saldo",
        apr: "Todellinen vuosikorko",
        name: "Nimi",
        amount: "Määrä",
        termYears: "Aika vuosissa",
        interestType: "Korkotyyppi",
        repaymentType: "Takaisinmaksutyyppi",
        monthlyFee: "Kuukausimaksu",
        variableEuribor: "Vaihtuva + Marginaali",
        fixedInterestRate: "Kiinteä korko",
      },
      placeholders: {
        loanNamePlaceholder: "Syötä lainan nimi",
        loanAmountPlaceholder: "Syötä lainan määrä",
        interestRatePlaceholder: "Syötä korkoprosentti",
        loanTermPlaceholder: "Syötä laina-aika",
        monthlyPaymentPlaceholder: "Syötä kuukausierä",
        startDatePlaceholder: "Valitse aloituspäivä",
        endDatePlaceholder: "Valitse päättymispäivä",
        additionalPaymentPlaceholder: "Syötä lisämaksu",
        creditCardNamePlaceholder: "Syötä luottokortin nimi",
        creditCardBalancePlaceholder: "Syötä luottokortin saldo",
        creditCardAPRPlaceholder: "Syötä luottokortin korko",
        creditCardMinPaymentPlaceholder: "Syötä luottokortin minimimaksu",
        amountPlaceholder: "Määrä",
        termYearsPlaceholder: "Aika vuosissa",
        monthlyFeePlaceholder: "Kuukausimaksu",
        namePlaceholder: "esim. Asuntolaina",
      },
      loanTypes: {
        personalLoan: "Kulutusluotto",
        mortgage: "Asuntolaina",
        autoLoan: "Autolaina",
        studentLoan: "Opintolaina",
        creditCard: "Luottokortti",
        other: "Muu",
      },
      paymentFrequencies: {
        monthly: "Kuukausittain",
        biWeekly: "Joka toinen viikko",
        weekly: "Viikoittain",
      },
      buttons: {
        addLoan: "Lisää laina",
        addCreditCard: "Lisää luottokortti",
        calculate: "Laske",
        reset: "Nollaa",
        remove: "Poista",
        update: "Päivitä",
        cancel: "Peruuta",
        save: "Tallenna",
        payoff: "Maksa pois",
        submit: "Lisää",
      },
      tooltips: {
        interestRate: "Lainan korkoprosentti",
        loanTerm: "Lainan pituus",
        monthlyPayment: "Kuukausittainen maksusumma",
        additionalPayment: "Ylimääräinen maksusumma",
      },
      validation: {
        required: "Pakollinen kenttä",
        number: "Syötä numero",
        min: "Syötä vähintään {min}",
        max: "Syötä enintään {max}",
        email: "Syötä kelvollinen sähköpostiosoite",
      },
      interestTypes: {
        fixed: "Kiinteä",
        variable: "Vaihtuva",
      },
      repaymentTypes: {
        annuity: "Annuiteetti",
        equalPrincipal: "Tasalyhennys",
        fixedInstallment: "Kiinteä maksuerä",
        customPayment: "Mukautettu maksu",
      },
      months: {
        month: "Kuukausi",
        months: "Kuukautta",
      },
      title: "Uusi laina",
      editTitle: "Muokkaa lainaa",
      monthlyFeeDescription: "Lainan vapaaehtoinen kuukausimaksu",
      loanFormAriaLabel: "Velan lisäyslomake",
      loanNameAriaLabel: "Velan nimi",
      loanAmountAriaLabel: "Velan määrä euroina",
      interestRateAriaLabel: "Korko prosentteina",
      termYearsAriaLabel: "Laina-aika vuosina",
      repaymentTypeAriaLabel: "Lyhennystapa",
      interestTypeAriaLabel: "Korkotyyppi",
      customPaymentAriaLabel: "Mukautettu kuukausimaksu",
      monthlyFeeAriaLabel: "Kuukausimaksu",
      cancelAriaLabel: "Peruuta muokkaus",
      updateAriaLabel: "Päivitä velka",
      submitAriaLabel: "Lisää velka",
      selectRepaymentType: "Valitse lyhennystapa",
      selectInterestType: "Valitse korkotyyppi",
      estimatedTerm: "Arvioitu laina-aika",
      years: "vuotta",
      loanUpdatedDesc: "Lainasi on päivitetty onnistuneesti",
      loanAddedDesc: "Lainasi on lisätty onnistuneesti"
    }
  }
};
