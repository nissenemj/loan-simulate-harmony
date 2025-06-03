
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
      }
    }
  }
};
