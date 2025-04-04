// fi.ts

export const fi = {
  app: {
    title: "Velkaneuvojasi",
    description: "Simuloi ja suunnittele lainanmaksuasi.",
    language: "Kieli",
    footer: "Tehty ❤️ Velkavapaus.fi:n tiimi"
  },
  tabs: {
    dashboard: "Kojelauta",
    loans: "Lainat",
    creditCards: "Luottokortit",
    debtSummary: "Velkakatsaus",
    glossary: "Sanasto",
    affiliate: "Suositukset",
    blog: "Blogi",
  },
  navigation: {
    dashboard: "Kojelauta",
    calculator: "Lainasimulaattori",
    debtStrategies: "Velanmaksustrategiat",
    blog: "Blogi",
    account: "Tili",
    menu: "Valikko",
    language: "Kieli"
  },
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
    months: {
      month: "Kuukausi",
      months: "Kuukautta",
    },
    title: "Uusi laina",
    editTitle: "Muokkaa lainaa",
    monthlyFeeDescription: "Lainan vapaaehtoinen kuukausimaksu"
  },
  table: {
    headers: {
      loanName: "Lainan nimi",
      loanAmount: "Lainan määrä",
      interestRate: "Korkoprosentti",
      loanTerm: "Laina-aika",
      monthlyPayment: "Kuukausierä",
      startDate: "Aloituspäivä",
      endDate: "Päättymispäivä",
      additionalPayment: "Lisämaksu",
    },
    name: "Nimi",
    amount: "Määrä",
    interestRate: "Korkoprosentti",
    term: "Aika",
    monthlyPayment: "Kuukausierä",
    balance: "Saldo",
    apr: "Todellinen vuosikorko",
    minPayment: "Minimimaksu",
    actions: "Toiminnot",
    edit: "Muokkaa",
    toggleActive: "Vaihda aktiivisuutta",
    payoff: "Maksa pois",
    year: "vuosi",
    years: "vuotta",
    totalInterest: "Kokonaiskorko",
    totalPayment: "Kokonaismaksu"
  },
  results: {
    summary: "Yhteenveto",
    monthlyPayment: "Kuukausierä",
    totalInterest: "Maksettu korko yhteensä",
    totalPayments: "Maksut yhteensä",
    payoffDate: "Maksupäivä",
    timeToPayoff: "Aika maksupäivään",
    years: "Vuotta",
    months: "Kuukautta",
    interestSaved: "Säästetty korko",
    fasterPayoff: "Nopeampi maksuaika",
  },
  loanList: {
    title: "Lainat",
    addLoan: "Lisää laina",
    editLoan: "Muokkaa lainaa",
    deleteLoan: "Poista laina",
    confirmDelete: "Haluatko varmasti poistaa tämän lainan?",
  },
  creditCardList: {
    title: "Luottokortit",
    addCreditCard: "Lisää luottokortti",
    editCreditCard: "Muokkaa luottokorttia",
    deleteCreditCard: "Poista luottokortti",
    confirmDelete: "Haluatko varmasti poistaa tämän luottokortin?",
  },
  debtSummary: {
    title: "Velkakatsaus",
    cardName: "Nimi",
    monthlyPayment: "Kuukausierä",
    monthlyInterest: "Kuukausikorko",
    totalLifetimeInterest: "Kokonaiskorko eliniän aikana",
    payoffButton: "Maksa pois",
    noCardsMessage: "Ei lisättyjä luottokortteja.",
    totalCards: "Yhteensä",
    neverPaidOff: "Ei koskaan maksettu pois",
    demoDataMessage: "Tämä on demotietoa. Lisää omat luottokorttisi saadaksesi henkilökohtaisen arvion.",
    actions: "Toiminnot",
    loanName: "Lainan nimi",
    monthlyInterestEstimate: "Kuukausikorko arvio",
    totalInterestEstimate: "Kokonaiskorko arvio",
    noLoansMessage: "Ei lisättyjä lainoja.",
    totalLoans: "Lainat yhteensä",
    totalSummarySection: "Velan kokonaismäärät",
    backButton: "Takaisin",
    pageTitle: "Velkakatsauksesi",
    pageDescription: "Tarkastele kokonaisvelkatilannettasi ja maksusuunnitelmia.",
    loansSection: "Lainat",
    creditCardsSection: "Luottokortit",
    totalMonthlyPayment: "Kuukausimaksu yhteensä",
    totalMonthlyInterest: "Kuukausikorko yhteensä",
    totalBalance: "Kokonaissaldo",
    tableSummary: "Velkasuhteiden yhteenveto",
    totalAmountPaid: "Maksettu summa yhteensä",
    metaDescription: "Tarkastele kokonaisvelkatilannettasi, mukaan lukien lainat ja luottokortit.",
    includingInterestAndFees: "Sisältäen pääoman, korot ja maksut"
  },
  auth: {
    login: "Kirjaudu sisään",
    register: "Rekisteröidy",
    email: "Sähköposti",
    password: "Salasana",
    confirmPassword: "Vahvista salasana",
    forgotPassword: "Unohditko salasanan?",
    resetPassword: "Nollaa salasana",
    logout: "Kirjaudu ulos",
    error: "Virheellinen sähköposti tai salasana",
    success: "Kirjautuminen onnistui",
    registerSuccess: "Rekisteröityminen onnistui",
    resetSuccess: "Salasanan nollaus onnistui",
  },
  loan: {
    loanDetails: "Lainan tiedot",
    loanAmount: "Lainan määrä",
    interestRate: "Korkoprosentti",
    loanTerm: "Laina-aika",
    monthlyPayment: "Kuukausierä",
    startDate: "Aloituspäivä",
    endDate: "Päättymispäivä",
    additionalPayment: "Lisämaksu",
    types: {
      annuity: "Annuiteetti",
      equalPrincipal: "Tasalyhennys",
      fixedInstallment: "Kiinteä maksuerä",
      customPayment: "Mukautettu maksu",
    },
    table: {
      name: "Nimi",
      monthlyPayment: "Kuukausierä",
      interestRate: "Korkoprosentti",
      totalInterest: "Kokonaiskorko",
      term: "Aika",
      noLoans: "Ei lisättyjä lainoja.",
    },
  },
  creditCard: {
    cardDetails: "Luottokortin tiedot",
    cardBalance: "Luottokortin saldo",
    cardAPR: "Luottokortin korko",
    cardMinPayment: "Luottokortin minimimaksu",
    summary: {
      title: "Luottokorttien yhteenveto",
      totalBalance: "Kokonaissaldo",
      totalMinPayment: "Minimimaksu yhteensä",
      totalMonthlyInterest: "Kuukausikorko yhteensä",
      totalLimit: "Kokonaisluottoraja",
      totalUtilization: "Kokonaiskäyttöaste",
    },
  },
  calculator: {
    debtPayoffCalculator: "Velanmaksuaikalaskuri",
    debtPayoffTimeline: "Velanmaksuaikataulu",
    extraPaymentImpact: "Lisämaksun vaikutus",
    debtConsolidation: "Velkojen yhdistäminen",
    addYourDebts: "Lisää velkasi",
    debtName: "Velan nimi",
    balance: "Saldo",
    interestRate: "Korkoprosentti",
    minimumPayment: "Minimimaksu",
    debtNamePlaceholder: "Syötä velan nimi",
    addDebt: "Lisää velka",
    yourDebts: "Velkasi",
    actions: "Toiminnot",
    total: "Yhteensä",
    paymentStrategy: "Maksustrategia",
    additionalMonthlyPayment: "Lisäkuukausimaksu",
    additionalPaymentDescription: "Ylimääräinen maksu kuukaudessa",
    totalMonthlyPayment: "Kuukausierä yhteensä",
    paymentResults: "Maksutulokset",
    payoffDate: "Maksupäivä",
    estimatedCompletion: "Arvioitu valmistuminen",
    totalInterest: "Kokonaiskorko",
    interestPaid: "Maksettu korko",
    totalPaid: "Maksettu yhteensä",
    principalPlusInterest: "Pääoma + korko",
    saveResults: "Tallenna tulokset",
    avalanche: "Vyörytys",
    snowball: "Lumipallo",
    avalancheStrategy: "Vyörytysmenetelmä",
    avalancheDescription: "Maksa ensin korkeimman koron velka.",
    snowballStrategy: "Lumipallomenetelmä",
    snowballDescription: "Maksa ensin pienin velka.",
    timelineDescription: "Kuukausittainen velanmaksuaikataulu.",
    noDebtsAdded: "Ei lisättyjä velkoja.",
    previous: "Edellinen",
    next: "Seuraava",
    month: "Kuukausi",
    of: " / ",
    principalPaid: "Maksettu pääoma",
    remainingBalances: "Jäljellä olevat saldot",
    payment: "Maksu",
    remainingBalance: "Jäljellä oleva saldo",
    paidOff: "Maksettu pois",
    debtsPaidOff: "Maksetut velat",
    congratulations: "Onnittelut!",
    debtFreeMessage: "Olet nyt velaton!",
    calculateFirst: "Laske ensin velanmaksuaika.",
    monthly: "Kuukausittain",
    quarterly: "Neljännesvuosittain",
    yearly: "Vuosittain",
  },
  debtStrategies: {
    pageTitle: "Velanmaksustrategiat",
    pageDescription: "Suunnittele ja simuloi velkojesi takaisinmaksua.",
    noDebtAlert: "Lisää lainoja tai luottokortteja aloittaaksesi.",
    calculateFirst: "Laske ensin velanmaksuaika.",
  },
  repayment: {
    repaymentType: "Takaisinmaksutyyppi",
    planSummary: "Suunnitelman yhteenveto",
    planDescription: "Yleiskatsaus takaisinmaksusuunnitelmaasi.",
    timeToFreedom: "Aika vapauteen",
    totalInterestPaid: "Maksettu korko yhteensä",
    firstDebtPaidOff: "Ensimmäinen velka maksettu",
    monthlyAllocation: "Kuukausiallokaatio",
    allocationDescription: "Kuukausittainen allokaatio veloillesi.",
    debtName: "Velan nimi",
    minPayment: "Minimimaksu",
    extraPayment: "Lisämaksu",
    totalPayment: "Kokonaismaksu",
    total: "Yhteensä",
    balanceTimeline: "Saldon aikajana",
    balanceTimelineDescription: "Saldon kehitys ajan myötä.",
    months: "Kuukautta",
    balance: "Saldo",
    totalRemaining: "Jäljellä oleva kokonaissaldo",
    debtPayoffSchedule: "Velan maksuaikataulu",
    payoffScheduleDescription: "Velkojen maksuaikataulu.",
    payoffTime: "Maksuaika",
    insufficientBudget: "Riittämätön budjetti",
    budgetTooLow: "Budjettisi on liian alhainen velkojen maksamiseen.",
    summaryTab: "Yhteenveto",
    planTab: "Takaisinmaksusuunnitelma",
    noPlanYet: "Ei vielä takaisinmaksusuunnitelmaa",
    enterBudgetPrompt: "Syötä kuukausibudjettisi ja laske takaisinmaksusuunnitelma",
    calculateNow: "Laske nyt",
    avalancheStrategy: "Vyörytysmenetelmä",
    snowballStrategy: "Lumipallomenetelmä",
    avalancheDesc: "Korkein korko ensin",
    snowballDesc: "Pienin saldo ensin"
  },
  visualization: {
    debtBreakdown: "Velkaerottelu",
    distributionDescription: "Velkojesi jakautuminen",
    paymentBreakdown: "Maksun erottelu",
    paymentBreakdownDescription: "Kuukausimaksujen erottelu",
    paymentDistribution: "Maksujen jakautuminen",
    interestVsPrincipal: "Korko vs. pääoma",
    paymentTimeline: "Maksuaikataulu",
    strategyComparison: "Strategiavertailu",
    strategyComparisonDescription: "Vertaile eri velanmaksustrategioita",
    timeComparison: "Aikavertailu",
    interestComparison: "Korkovertailu",
    timeToPayoff: "Aika maksupäivään",
    interestSaved: "Säästetty korko",
    monthsSaved: "Säästetyt kuukaudet",
    monthsToPayoff: "Kuukautta maksupäivään",
    totalInterestPaid: "Maksettu korko yhteensä",
    principalPayment: "Pääomamaksu",
    interestPayment: "Korkomaksu",
    cumulativePrincipal: "Kumulatiivinen pääoma",
    cumulativeInterest: "Kumulatiivinen korko",
    months: "kuukautta",
    totalDebt: "Kokonaisvelka",
    monthlyBreakdown: "Kuukausittainen erittely",
    cumulativeBreakdown: "Kumulatiivinen erittely",
    noDataAvailable: "Ei saatavilla olevia tietoja",
    noDebtsToVisualize: "Ei visualisoitavia velkoja",
    minimumAvalanche: "Minimimaksut (Vyörytys)",
    minimumSnowball: "Minimimaksut (Lumipallo)",
    extra100Avalanche: "Lisää 100€/kk (Vyörytys)",
    extra100Snowball: "Lisää 100€/kk (Lumipallo)"
  },
  language: {
    en: "English",
    fi: "Suomi"
  },
  toast: {
    loanPaidOff: "Laina maksettu pois",
    cardPaidOff: "Luottokortti maksettu pois",
    loanAdded: "Laina lisätty onnistuneesti",
    loanUpdated: "Laina päivitetty onnistuneesti",
    loanDeleted: "Laina poistettu onnistuneesti",
    cardAdded: "Luottokortti lisätty onnistuneesti",
    cardUpdated: "Luottokortti päivitetty onnistuneesti",
    cardDeleted: "Luottokortti poistettu onnistuneesti"
  },
  recommendations: {
    title: "Suositukset",
    topPriority: "Tärkein prioriteetti",
    topPriorityText: "Tämä laina tulisi maksaa pois ensin korkean kustannuksen vuoksi.",
    topPriorityTextPlural: "Nämä lainat tulisi maksaa pois ensin korkean kustannuksen vuoksi.",
    highInterest: "Korkein korko",
    highInterestText: "Tämä laina maksaa eniten korkoa kuukausittain.",
    highInterestTextPlural: "Nämä lainat maksavat eniten korkoa kuukausittain.",
    highTotalInterest: "Korkein kokonaiskorko",
    highTotalInterestText: "Tämä laina maksaa eniten korkoa elinkaarensa aikana.",
    highTotalInterestTextPlural: "Nämä lainat maksavat eniten korkoa elinkaariensa aikana."
  },
  tooltips: {
    totalDebt: "Kaikkien aktiivisten lainojen ja luottokorttien yhteissumma.",
    interestCost: "Arvioitu kokonaiskorko, jonka maksat kaikista veloistasi nykyisillä koroilla ja maksuilla.",
    debtFreeDate: "Arvioitu päivämäärä, jolloin kaikki velkasi on maksettu nykyisillä maksusummilla.",
    minimumPayments: "Yhdistetyt vähimmäismaksut kaikista lainoistasi ja luottokorteistasi.",
    totalToPayOff: "Kokonaissumma, mukaan lukien pääoma ja korko, jonka maksat kaikkien velkojesi elinkaaren aikana."
  },
  theme: {
    light: "Vaalea",
    dark: "Tumma",
    system: "Järjestelmä",
    toggle: "Vaihda teemaa"
  },
  dashboard: {
    title: "Kojelauta",
    welcome: "Tervetuloa",
    welcomeSubtitle: "Tässä on yleiskatsaus velkojenhallinnastasi",
    viewDebtSummary: "Näytä velkakatsaus",
    viewDetailedBreakdown: "Näytä yksityiskohtainen erittely",
    totalDebt: "Kokonaisvelka",
    estimatedInterestCost: "Arvioitu korkokustannus",
    estimatedDebtFreeDate: "Arvioitu velaton päivä",
    minimumMonthlyPayments: "Kuukauden minimimaksut",
    perMonth: "kuukaudessa",
    totalToPayOff: "Maksettava kokonaissumma",
    paymentPlanSummary: "Maksusuunnitelman yhteenveto",
    paymentPlanDescription: "Velkojenmaksustrategiasi yhdellä silmäyksellä",
    monthlyBudget: "Kuukausibudjetti",
    minimumPayments: "Minimimaksut",
    extraBudget: "Lisäbudjetti",
    prioritizedDebt: "Priorisoitu velka",
    interestRate: "korko",
    allocatingExtra: "Osoitetaan ylimääräinen {{amount}} tälle velalle",
    viewFullPlan: "Näytä koko suunnitelma",
    debtBreakdown: "Velkaerottelu",
    allDebts: "Kaikki velat",
    loans: "Lainat",
    creditCards: "Luottokortit",
    financialTips: "Taloudelliset vinkit",
    tip1: "Maksa ensin korkean koron velat säästääksesi rahaa pitkällä aikavälillä (vyörytysmenetelmä).",
    tip2: "Rakenna hätärahasto, joka vastaa vähintään 3 kuukauden menoja välttääksesi uutta velkaa.",
    tip3: "Harkitse velkojen yhdistämistä, jos sinulla on useita korkean koron velkoja.",
    viewGlossary: "Katso taloudellinen sanasto",
    debtFreeTimeline: "Velaton aikajana",
    timelineDescription: "Arvioitu matka taloudelliseen vapauteen",
    timelineExplanation: "Tämä kaavio näyttää, kuinka nopeasti kukin velka maksetaan pois valitsemallasi strategialla",
    paymentFlowExplanation: "Kun velka on maksettu pois, sen kohdennettu budjetti siirtyy seuraavalle prioriteettivelalle",
    now: "Nyt",
    currentDebt: "Nykyinen velka",
    creditCardsFree: "Luottokortit maksettu",
    projectDate: "Ennustettu päivämäärä",
    debtFree: "Velaton",
    viewDetailedTimeline: "Näytä yksityiskohtainen aikajana",
    helpWithDebt: "Tarvitsetko apua velkasi kanssa?",
    year: "vuosi",
    goToRepaymentPlan: "Siirry takaisinmaksusuunnitelmaan",
    currentPaymentAmount: "Nykyinen maksumäärä",
    monthlyPaymentAmount: "Kuukausimaksumäärä",
    minimum: "Minimi",
    maximum: "Maksimi",
    recommendedStrategy: "Suositeltu strategia",
    recommendation: "Suositus",
    equalStrategy: "Tasainen jakautuminen",
    snowballStrategy: "Lumipallo",
    avalancheStrategy: "Vyörytys",
    equalDistribution: "Tasainen jakautuminen -strategia",
    compareScenarios: "Vertaile skenaarioita",
    compareScenariosTooltip: "Vertaile erilaisia takaisinmaksuskenaarioita",
    exportData: "Vie velkatiedot CSV-muodossa",
    dataExported: "Tiedot viety onnistuneesti",
    guest: "Vieras"
  },
  footer: {
    about: {
      title: "Tietoa Velkavapaus.fi:stä",
      description: "Velkavapaus.fi on ilmainen työkalu, joka auttaa sinua luomaan ja seuraamaan räätälöityä velkojen takaisinmaksusuunnitelmaa."
    },
    links: {
      title: "Pikalinkit",
      item1: "Kojelauta",
      item2: "Lainaehdot",
      item3: "Velkakatsaus"
    },
    legal: {
      title: "Lakiasiaa",
      privacy: "Tietosuojaseloste",
      terms: "Käyttöehdot",
      cookies: "Evästekäytäntö"
    },
    copyright: "Kaikki oikeudet pidätetään."
  },
  landing: {
    seo: {
      title: "Tee velanmaksusta helppoa - Ilmainen taloustyökalu | Velkavapaus.fi",
      description: "Luo ilmainen velanmaksusuunnitelma ja ota taloutesi hallintaan Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!",
      keywords: "velanmaksu, lainanhallinta, taloustyökalut, velkalumipallostrategia, velkavyörytysstrategia, taloudellinen vapaus, velaton"
    }
  },
  noDebtToDisplay: "Ei näytettäviä velkoja",
  pagination: {
    previous: "Edellinen",
    next: "Seuraava"
  }
};

// Also export as default for backward compatibility
export default fi;
