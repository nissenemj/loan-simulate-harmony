
// User guidance and help text translations

export const guidance = {
  fi: {
    guidance: {
      // Field tooltips
      fieldTooltips: {
        debtName: "Anna velkasi tunnistettava nimi (esim. 'Luottokortti', 'Opintolaina')",
        balance: "Nykyinen velkasumma, jonka olet velkaa",
        interestRate: "Vuotuinen korkoprosentti (todellinen vuosikorko) tälle velalle",
        minimumPayment: "Pienin summa, jonka lainanantajasi vaatii maksamaan kuukausittain",
        extraPayment: "Lisäsumma vähimmäismaksujen lisäksi maksamisen nopeuttamiseksi",
        strategy: "Valitse maksustrategia: Lumipallo (pienin velka ensin) tai Vyöry (korkein korko ensin)"
      },
      
      // Example data
      exampleData: {
        fillWithExample: "Täytä esimerkillä",
        clearAndEnterOwn: "Katso miten se toimii esimerkkitiedoilla, sitten tyhjennä ja syötä omat tietosi",
        exampleNote: "Esimerkkitiedot ladattu - korvaa ne omilla tiedoillasi"
      },
      
      // Strategy comparison
      strategyComparison: {
        compareStrategies: "Vertaile strategioita",
        snowballBest: "Lumipallo-menetelmä sopii sinulle jos haluat nopeita voittoja ja motivaatiota",
        avalancheBest: "Vyöry-menetelmä säästää eniten rahaa pitkällä aikavälillä",
        learnMore: "Lue lisää strategioista"
      },
      
      // Results interpretation
      resultsGuide: {
        howToRead: "Miten tulkita näitä tuloksia",
        totalInterest: "Kokonaiskorko: Kaikki korkokustannukset maksuajan aikana",
        payoffDate: "Maksupäivä: Arvioitu päivämäärä jolloin kaikki velat on maksettu",
        totalPaid: "Maksettu yhteensä: Pääoma + kaikki korot",
        monthlyPayment: "Kuukausierä: Kokonaissumma kuukaudessa (vähimmäismaksut + lisämaksu)",
        savings: "Säästöt: Paljonko säästät verrattuna vain vähimmäismaksuihin"
      },
      
      // Progress indicators
      progress: {
        step1: "Vaihe 1/3: Syötä velkatiedot",
        step2: "Vaihe 2/3: Valitse strategia ja lisämaksu",
        step3: "Vaihe 3/3: Tarkastele tuloksia",
        currentStep: "Nykyinen vaihe"
      },
      
      // Extra payment impact
      extraPaymentImpact: {
        adding: "Lisäämällä",
        extraPerMonth: "€ lisää kuukaudessa voit säästää",
        monthsAnd: "kuukautta ja",
        inInterest: "€ korkokuluissa"
      },
      
      // Interactive tour
      tour: {
        welcomeTitle: "Tervetuloa velkalaskuriin",
        welcomeDescription: "Ota nopea kierros ja opi käyttämään laskuria tehokkaasti",
        debtFieldsTitle: "Syötä velkojesi tiedot",
        debtFieldsDescription: "Aloita syöttämällä jokaisen velkasi nimi, saldo, korko ja vähimmäismaksu",
        strategyTitle: "Valitse takaisinmaksustrategia",
        strategyDescription: "Lumipallo- ja Vyöry-menetelmillä on erilaiset edut - valitse sinulle sopiva",
        budgetTitle: "Aseta kuukausittainen budjetti",
        budgetDescription: "Määritä paljonko voit maksaa velkoja kuukausittain yhteensä",
        resultsTitle: "Tulkitse tuloksiasi",
        resultsDescription: "Näe milloin olet velaton ja paljonko säästät eri strategioilla",
        skipTour: "Ohita kierros",
        nextStep: "Seuraava",
        previousStep: "Edellinen",
        startCalculating: "Aloita laskeminen"
      },
      
      // Validation messages
      validation: {
        required: "Tämä kenttä on pakollinen",
        positiveNumber: "Syötä positiivinen luku",
        reasonableInterest: "Varmista korko - useimmat lainat ovat 0-25% välillä",
        minimumTooHigh: "Vähimmäismaksu vaikuttaa korkealta verrattuna saldoon",
        nameExists: "Tämä nimi on jo käytössä - anna yksilöllinen nimi"
      },
      
      // Glossary terms
      glossary: {
        interestRate: "Korkoprosentti: Vuotuinen kustannus lainan käytöstä, ilmaistuna prosentteina pääomasta",
        minimumPayment: "Vähimmäismaksu: Pienin summa, joka lainanantajan mukaan on maksettava kuukausittain",
        principal: "Pääoma: Alkuperäinen lainasumma ilman korkoja",
        apr: "Todellinen vuosikorko: Lainan kokonaiskustannus vuodessa mukaan lukien korot ja palkkiot",
        snowball: "Lumipallo-menetelmä: Maksa ensin pienin velka, sitten seuraavaksi pienin",
        avalanche: "Vyöry-menetelmä: Maksa ensin korkein korko, sitten seuraavaksi korkein",
        debtFreeDate: "Velattomuuspäivä: Arvioitu päivämäärä, jolloin kaikki velat on maksettu",
        extraPayment: "Lisämaksu: Vähimmäismaksun ylittävä summa, joka nopeuttaa velan maksua"
      }
    }
  },
  en: {
    guidance: {
      fieldTooltips: {
        debtName: "Give your debt a recognizable name (e.g., 'Credit Card', 'Student Loan')",
        balance: "The current amount you owe on this debt",
        interestRate: "The annual percentage rate (APR) for this debt",
        minimumPayment: "The smallest amount your lender requires you to pay each month",
        extraPayment: "Additional amount beyond minimum payments to accelerate payoff",
        strategy: "Choose payment strategy: Snowball (smallest debt first) or Avalanche (highest interest first)"
      },
      
      exampleData: {
        fillWithExample: "Fill with Example",
        clearAndEnterOwn: "See how it works with sample data, then clear and enter your own",
        exampleNote: "Example data loaded - replace with your own information"
      },
      
      strategyComparison: {
        compareStrategies: "Compare Strategies",
        snowballBest: "Snowball method is best if you want quick wins and motivation",
        avalancheBest: "Avalanche method saves the most money in the long run",
        learnMore: "Learn more about strategies"
      },
      
      resultsGuide: {
        howToRead: "How to Read These Results",
        totalInterest: "Total Interest: All interest costs over the payment period",
        payoffDate: "Payoff Date: Estimated date when all debts will be paid off",
        totalPaid: "Total Paid: Principal + all interest",
        monthlyPayment: "Monthly Payment: Total amount per month (minimum payments + extra)",
        savings: "Savings: How much you save compared to paying only minimums"
      },
      
      progress: {
        step1: "Step 1/3: Enter debt details",
        step2: "Step 2/3: Choose strategy and extra payment",
        step3: "Step 3/3: Review results",
        currentStep: "Current step"
      },
      
      extraPaymentImpact: {
        adding: "Adding",
        extraPerMonth: "€ extra per month could save you",
        monthsAnd: "months and",
        inInterest: "€ in interest"
      },
      
      tour: {
        welcomeTitle: "Welcome to the Debt Calculator",
        welcomeDescription: "Take a quick tour to learn how to use the calculator effectively",
        debtFieldsTitle: "Enter Your Debt Details",
        debtFieldsDescription: "Start by entering each debt's name, balance, interest rate, and minimum payment",
        strategyTitle: "Choose Repayment Strategy",
        strategyDescription: "Snowball and Avalanche methods have different benefits - choose what works for you",
        budgetTitle: "Set Monthly Budget",
        budgetDescription: "Determine how much you can pay toward debts each month in total",
        resultsTitle: "Interpret Your Results",
        resultsDescription: "See when you'll be debt-free and how much you'll save with different strategies",
        skipTour: "Skip Tour",
        nextStep: "Next",
        previousStep: "Previous",
        startCalculating: "Start Calculating"
      },
      
      validation: {
        required: "This field is required",
        positiveNumber: "Please enter a positive number",
        reasonableInterest: "Double-check the interest rate - most loans are between 0-25%",
        minimumTooHigh: "Minimum payment seems high compared to balance",
        nameExists: "This name is already used - please provide a unique name"
      },
      
      glossary: {
        interestRate: "Interest Rate: The yearly cost of borrowing money, expressed as a percentage of the principal",
        minimumPayment: "Minimum Payment: The smallest amount the lender requires you to pay each month",
        principal: "Principal: The original loan amount without interest",
        apr: "APR: Annual Percentage Rate - the total yearly cost of the loan including interest and fees",
        snowball: "Snowball Method: Pay off smallest debt first, then next smallest",
        avalanche: "Avalanche Method: Pay off highest interest rate first, then next highest",
        debtFreeDate: "Debt-Free Date: Estimated date when all debts will be paid off",
        extraPayment: "Extra Payment: Amount above minimum payments that accelerates debt payoff"
      }
    }
  }
};
