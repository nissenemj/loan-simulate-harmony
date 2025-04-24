
// Error message translations

export const errors = {
  en: {
    errors: {
      calculation: {
        noDebts: "No debts provided",
        insufficientPayment: "Total monthly payment must be at least the sum of all minimum payments",
        negativePayment: "Total monthly payment must be greater than zero",
        maxMonthsExceeded: "Payment calculation exceeded maximum number of months (40 years)",
        invalidStrategy: "Invalid payment strategy",
        invalidInput: "Invalid input values",
        unknownError: "An unknown error occurred during calculation"
      },
      api: {
        requestFailed: "Request failed",
        networkError: "Network error",
        serverError: "Server error",
        timeout: "Request timed out"
      },
      auth: {
        loginFailed: "Login failed",
        registrationFailed: "Registration failed",
        unauthorized: "Unauthorized access",
        sessionExpired: "Your session has expired"
      },
      validation: {
        invalidForm: "Please correct the errors in the form",
        requiredField: "This field is required",
        invalidFormat: "Invalid format"
      }
    }
  },
  fi: {
    errors: {
      calculation: {
        noDebts: "Ei velkoja annettu",
        insufficientPayment: "Kuukausimaksun on oltava vähintään kaikkien minimimaksujen summa",
        negativePayment: "Kuukausimaksun on oltava suurempi kuin nolla",
        maxMonthsExceeded: "Maksulaskenta ylitti maksimikuukausimäärän (40 vuotta)",
        invalidStrategy: "Virheellinen maksustrategia",
        invalidInput: "Virheelliset syöttöarvot",
        unknownError: "Tuntematon virhe laskennassa"
      },
      api: {
        requestFailed: "Pyyntö epäonnistui",
        networkError: "Verkkovirhe",
        serverError: "Palvelinvirhe",
        timeout: "Pyyntö aikakatkaistiin"
      },
      auth: {
        loginFailed: "Kirjautuminen epäonnistui",
        registrationFailed: "Rekisteröinti epäonnistui",
        unauthorized: "Luvaton pääsy",
        sessionExpired: "Istuntosi on vanhentunut"
      },
      validation: {
        invalidForm: "Korjaa lomakkeen virheet",
        requiredField: "Tämä kenttä on pakollinen",
        invalidFormat: "Virheellinen muoto"
      }
    }
  }
};
