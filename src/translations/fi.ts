export const fi = {
  app: {
    title: "Budjettisovellus",
    subtitle: "Hallitse lainoja ja luottokortteja helposti"
  },
  form: {
    name: "Nimi",
    amount: "Määrä",
    interestRate: "Korkoprosentti",
    termYears: "Laina-aika (vuotta)",
    repaymentType: "Maksutyyppi",
    interestType: "Korkotyyppi",
    customPayment: "Mukautettu maksu",
    addLoan: "Lisää laina",
    addCreditCard: "Lisää luottokortti",
    monthlyPayment: "Kuukausierä",
    months: "kuukautta",
    balance: "Saldo",
    limit: "Luottoraja",
    apr: "Vuosikorko",
    minPayment: "Minimimaksu",
    fullPayment: "Koko summan maksu",
    isActive: "Aktiivinen",
    save: "Tallenna",
    cancel: "Peruuta",
    title: "Uusi laina",
    submit: "Lisää laina",
    placeholderName: "Esim. Asuntolaina",
    placeholderAmount: "10000",
    placeholderInterestRate: "5.0",
    placeholderTermYears: "10",
    estimatedTerm: "Arvioitu takaisinmaksuaika",
    paymentTooSmall: "Maksu on liian pieni",
    years: "vuotta",
    placeholderCustomPayment: "200"
  },
  repayment: {
    annuity: "Annuiteetti",
    equalPrincipal: "Tasalyhennys",
    fixedInstallment: "Kiinteät maksut",
    customPayment: "Mukautettu maksu",
    budgetTitle: "Kuukausibudjetti",
    budgetDescription: "Syötä kuukausibudjettisi velkojen takaisinmaksuun",
    monthlyBudget: "Kuukausibudjetti",
    prioritizationMethod: "Priorisointimenetelmä",
    selectMethod: "Valitse menetelmä",
    avalancheMethod: "Korkein korko ensin (Avalanche)",
    snowballMethod: "Pienin saldo ensin (Snowball)",
    avalancheDescription: "Korkeimman koron velkojen maksaminen ensin säästää eniten rahaa pitkällä aikavälillä.",
    snowballDescription: "Pienimpien saldojen maksaminen ensin luo nopeita voittoja motivaatioksi.",
    calculatePlan: "Laske takaisinmaksusuunnitelma",
    insufficientBudget: "Riittämätön budjetti",
    budgetTooLow: "Budjettisi on liian pieni kattamaan kaikki vähimmäismaksut.",
    planSummary: "Takaisinmaksusuunnitelman yhteenveto",
    planDescription: "Budjettisi ja velkojesi perusteella tässä on polkusi taloudelliseen vapauteen.",
    timeToFreedom: "Aika velkavasapauteen",
    totalInterestPaid: "Kokonaiskorkosumma",
    firstDebtPaidOff: "Ensimmäinen velka maksettu",
    monthlyAllocation: "Kuukausimaksun allokaatio",
    allocationDescription: "Miten kuukausibudjettisi jakaantuu velkojen kesken",
    debtName: "Velan nimi",
    minPayment: "Vähimmäismaksu",
    extraPayment: "Lisämaksu",
    totalPayment: "Kokonaismaksu",
    total: "Yhteensä",
    balanceTimeline: "Velkasaldon aikajana",
    balanceTimelineDescription: "Miten kokonaisvelkasi vähenee ajan myötä",
    months: "Kuukaudet",
    balance: "Saldo (€)",
    debtPayoffSchedule: "Velkojen maksuaikataulu",
    payoffScheduleDescription: "Milloin kukin velka maksetaan pois",
    payoffTime: "Maksuaika",
    totalRemaining: "Jäljellä oleva kokonaisvelka",
    noPlanYet: "Ei vielä takaisinmaksusuunnitelmaa",
    enterBudgetPrompt: "Syötä kuukausibudjettisi ja klikkaa Laske nähdäksesi takaisinmaksusuunnitelmasi.",
    calculateNow: "Laske nyt",
    summaryTab: "Velkojen yhteenveto",
    planTab: "Takaisinmaksusuunnitelma"
  },
  interest: {
    fixed: "Kiinteä",
    variableEuribor: "Vaihtuva (EURIBOR)"
  },
  validation: {
    nameRequired: "Nimi on pakollinen",
    nameRequiredDesc: "Anna lainalle nimi",
    invalidAmount: "Virheellinen määrä",
    invalidAmountDesc: "Määrän on oltava positiivinen luku",
    invalidRate: "Virheellinen korkoprosentti",
    invalidRateDesc: "Korkoprosentin on oltava positiivinen luku",
    invalidTerm: "Virheellinen laina-aika",
    invalidTermDesc: "Laina-ajan on oltava positiivinen kokonaisluku",
    invalidPayment: "Virheellinen maksu",
    invalidPaymentDesc: "Maksun on oltava positiivinen luku",
    paymentTooSmall: "Maksu on liian pieni",
    paymentTooSmallDesc: "Maksun on oltava suurempi kuin kuukausikorko"
  },
  loan: {
    types: {
      annuity: "Annuiteetti",
      "equal-principal": "Tasalyhennys",
      "fixed-installment": "Kiinteät maksut",
      "custom-payment": "Mukautettu maksu",
    },
    interestTypes: {
      fixed: "Kiinteä",
      "variable-euribor": "Vaihtuva (EURIBOR)",
    },
    table: {
      name: "Lainan nimi",
      amount: "Määrä",
      interestRate: "Korkoprosentti",
      term: "Laina-aika",
      monthlyPayment: "Kuukausierä",
      totalInterest: "Kokonaiskorko",
      payoffTime: "Takaisinmaksuaika",
      active: "Aktiivinen",
      noLoans: "Ei vielä lisättyjä lainoja.",
    },
  },
  creditCard: {
    title: "Uusi luottokortti",
    table: {
      name: "Kortin nimi",
      balance: "Saldo",
      apr: "Vuosikorko",
      minPayment: "Min. maksu",
      monthlyInterest: "Kuukausikorko",
      payoffTime: "Takaisinmaksuaika",
      utilization: "Käyttöaste",
      active: "Aktiivinen",
      noCards: "Ei vielä lisättyjä luottokortteja.",
    },
    summary: {
      title: "Luottokorttien yhteenveto",
      totalBalance: "Kokonaissaldo",
      totalLimit: "Kokonaisluottoraja",
      totalMinPayment: "Kokonaisminimimaksu",
      totalInterest: "Kokonaiskorko",
      totalUtilization: "Kokonaiskäyttöaste",
    },
    form: {
      name: "Kortin nimi",
      balance: "Saldo",
      limit: "Luottoraja",
      apr: "Vuosikorko",
      minPayment: "Minimimaksu",
      minPaymentPercent: "Minimimaksu (%)",
      fullPayment: "Maksa koko saldo kuukausittain",
      submit: "Lisää luottokortti",
      placeholderName: "Esim. Visa",
      placeholderBalance: "1000",
      placeholderCreditLimit: "5000",
      placeholderApr: "18.0",
      placeholderMinPayment: "30",
      autoCalculated: "Automaattisesti laskettu saldosta ja prosentista"
    },
  },
  debtSummary: {
    pageTitle: "Velkojen yhteenveto",
    pageDescription: "Yleiskatsaus veloistasi ja potentiaalisista säästöistä.",
    metaDescription: "Saa selkeä yleiskatsaus veloistasi ja löydä tapoja säästää rahaa.",
    backButton: "Takaisin laskuriin",
    totalMonthlyPayment: "Kokonaiskuukausimaksu",
    totalMonthlyInterest: "Kokonaiskuukausikorko",
    loansSection: "Lainat yleiskatsaus",
    creditCardsSection: "Luottokortit yleiskatsaus",
    totalSummarySection: "Velkojen kokonaisyhteenveto",
    demoDataMessage: "Näytetään esimerkkitietoja. Lisää omat velkasi henkilökohtaisia tietoja varten.",
    noLoansMessage: "Ei vielä lisättyjä lainoja. Ole hyvä ja lisää lainasi nähdäksesi yhteenvedon.",
    noCardsMessage: "Ei vielä lisättyjä luottokortteja. Ole hyvä ja lisää luottokorttisi nähdäksesi yhteenvedon.",
    cardName: "Kortin nimi",
    monthlyPayment: "Kuukausimaksu",
    monthlyInterest: "Kuukausikorko",
    totalInterestEstimate: "Kokonaiskorkoarvio",
    totalCards: "Yhteensä",
    neverPaidOff: "Ei koskaan maksettu",
    loanName: "Lainan nimi",
    totalLifetimeInterest: "Kokonaiselinkaarikorko",
    summaryExplanation: "Tämä yhteenveto näyttää velkojen kokonaiskuvan ja auttaa priorisoimaan maksustrategiaa.",
    totalLoans: "Lainat yhteensä",
    payoffButton: "Maksa pois",
    actions: "Toiminnot"
  },
  recommendations: {
    title: "Takaisinmaksusuositukset",
    topPriority: "Korkein prioriteetti",
    highInterest: "Korkea korkoprosentti",
    highTotalInterest: "Korkea kokonaiskorko",
    topPriorityText: "Maksa tämä laina ensin säästääksesi eniten rahaa.",
    topPriorityTextPlural: "Maksa nämä lainat ensin säästääksesi eniten rahaa.",
    highInterestText: "Harkitse tämän lainan nopeampaa maksamista korkean korkoprosentin vuoksi.",
    highInterestTextPlural: "Harkitse näiden lainojen nopeampaa maksamista korkean korkoprosentin vuoksi.",
    highTotalInterestText: "Tämän lainan aikaisempi maksaminen säästää sinulta merkittävän määrän korkoa.",
    highTotalInterestTextPlural: "Näiden lainojen aikaisempi maksaminen säästää sinulta merkittävän määrän korkoa.",
  },
  savings: {
    title: "Potentiaaliset säästöt",
    description: "Lainojen nopeampi takaisinmaksu voi säästää sinulta merkittävän määrän korkoa.",
    payingOffNow: "Maksamalla nyt pois",
    payOff: "Maksa pois",
  },
  table: {
    year: "vuosi",
    years: "vuotta",
  },
  toast: {
    loanActivated: "Laina aktivoitu",
    loanDeactivated: "Laina deaktivoitu",
    loanPaidOff: "Laina maksettu",
    loanAdded: "Laina lisätty",
    cardPaidOff: "Kortti maksettu pois",
  },
  language: {
    en: "English",
    fi: "Suomi"
  },
  tabs: {
    loans: "Lainat",
    debtSummary: "Velkatiivistelmä",
    loanTerms: "Lainaehdot"
  },
  loanTerms: {
    pageTitle: "Lainaehdot selitettynä yksinkertaisesti",
    backButton: "Takaisin",
    introduction: "Lainojen ehdot yksinkertaisesti selitettynä. Ymmärrä lainojen termit helposti.",
    searchPlaceholder: "Etsi termiä...",
    noResults: "Ei hakutuloksia. Kokeile eri hakusanaa.",
    interestRate: {
      title: "Korkoprosentti",
      description: "Korkoprosentti on summa, jonka maksat lainanantajalle lainan käytöstä. Se ilmaistaan prosenttiosuutena lainapääomasta ja maksetaan yleensä kuukausittain."
    },
    annuity: {
      title: "Annuiteetti",
      description: "Annuiteettilainassa maksat saman summan joka kuukausi koko laina-ajan. Alussa suurempi osa maksusta menee korkoihin, ja ajan myötä suurempi osa lyhentää varsinaista lainasummaa."
    },
    principal: {
      title: "Pääoma",
      description: "Pääoma on alkuperäinen summa, jonka olet lainannut. Kuukausimaksusi koostuu tämän pääoman takaisinmaksusta sekä koroista."
    },
    euribor: {
      title: "Euribor",
      description: "Euribor (Euro Interbank Offered Rate) on viitekorko, johon monet vaihtuvakorkoiset lainat on sidottu. Se heijastaa korkoa, jolla eurooppalaiset pankit lainaavat toisilleen, ja se voi muuttua ajan myötä vaikuttaen lainasi kokonaiskorkoon."
    },
    totalInterest: {
      title: "Kokonaiskorko",
      description: "Kokonaiskorko on kaikkien laina-aikana maksamiesi korkojen summa. Se riippuu lainan määrästä, korosta, laina-ajasta ja takaisinmaksutyypistä."
    },
    termYears: {
      title: "Laina-aika (vuosina)",
      description: "Laina-aika on ajanjakso, jonka aikana sitoudut maksamaan lainan takaisin. Pidempi laina-aika yleensä pienentää kuukausimaksuja, mutta lisää kokonaiskorkosummaa."
    },
    equalPrincipal: {
      title: "Tasalyhennys",
      description: "Tasalyhennyslainassa maksat saman verran pääomaa takaisin joka kuukausi, mutta koron määrä pienenee ajan myötä. Näin ollen kuukausimaksusi ovat korkeampia alussa ja pienenevät ajan myötä."
    },
    fixedInstallment: {
      title: "Kiinteät maksut",
      description: "Kiinteän maksun lainassa maksat saman summan joka kuukausi. Tämä maksutyyppi on samankaltainen kuin annuiteetti, mutta sitä käytetään usein kun korko voi vaihdella."
    }
  }
};
