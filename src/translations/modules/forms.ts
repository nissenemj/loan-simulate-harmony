
// Forms-related translations

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
        minPayment: "Min Payment",
        balance: "Balance",
        apr: "APR",
        name: "Name",
        amount: "Amount",
        termYears: "Term in years",
        interestType: "Interest Type",
        repaymentType: "Repayment Type",
        monthlyFee: "Monthly Fee",
        variableEuribor: "Variable + Margin",
        fixedInterestRate: "Fixed Interest Rate",
        isActive: "Active",
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
        namePlaceholder: "e.g. Mortgage",
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
        submit: "Submit",
      },
      tooltips: {
        interestRate: "Interest rate of the loan",
        loanTerm: "Duration of the loan",
        monthlyPayment: "Amount paid monthly",
        additionalPayment: "Extra amount to pay",
      },
      validation: {
        required: "Required field",
        number: "Enter a number",
        min: "Enter at least {min}",
        max: "Enter at most {max}",
        email: "Enter a valid email",
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
        month: "month",
        months: "months",
      },
      title: "New Loan",
      editTitle: "Edit Loan",
      monthlyFeeDescription: "Optional monthly fee for the loan",
      creditCard: {
        title: "New Credit Card",
        editTitle: "Edit Credit Card",
        form: {
          name: "Card Name",
          balance: "Current Balance",
          limit: "Credit Limit",
          apr: "APR",
          minPayment: "Minimum Payment",
          minPaymentPercent: "Minimum Payment (%)",
          fullPayment: "I pay the full balance each month",
          placeholderName: "e.g. Visa Card",
          placeholderBalance: "Current balance",
          placeholderCreditLimit: "Credit limit",
          placeholderApr: "Annual Percentage Rate",
          placeholderMinPayment: "Minimum payment",
          autoCalculated: "Auto-calculated from % above",
          submit: "Add Credit Card"
        },
        validation: {
          nameRequired: "Card name is required",
          invalidAmount: "Enter a valid amount",
          invalidRate: "Enter a valid rate"
        }
      }
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
        isActive: "Aktiivinen",
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
      creditCard: {
        title: "Uusi luottokortti",
        editTitle: "Muokkaa luottokorttia",
        form: {
          name: "Kortin nimi",
          balance: "Nykyinen saldo",
          limit: "Luottoraja",
          apr: "Korko",
          minPayment: "Minimimaksu",
          minPaymentPercent: "Minimimaksu (%)",
          fullPayment: "Maksan koko saldon joka kuukausi",
          placeholderName: "esim. Visa-kortti",
          placeholderBalance: "Nykyinen saldo",
          placeholderCreditLimit: "Luottoraja",
          placeholderApr: "Vuosikorko",
          placeholderMinPayment: "Minimimaksu",
          autoCalculated: "Lasketaan automaattisesti yllä olevasta prosentista",
          submit: "Lisää luottokortti"
        },
        validation: {
          nameRequired: "Kortin nimi vaaditaan",
          invalidAmount: "Syötä kelvollinen summa",
          invalidRate: "Syötä kelvollinen korko"
        }
      }
    }
  }
};
