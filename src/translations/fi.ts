import { en } from "./en";

export const fi = {
  app: {
    title: 'Laina Simulaattori',
    subtitle: 'Hallitse lainojasi ja suunnittele velanmaksu.',
    footer: 'Tehty ❤️ Finance Wizards',
    language: 'Kieli',
    english: 'Englanti',
    finnish: 'Suomi',
    loading: 'Ladataan...',
    error: 'Virhe',
    success: 'Onnistui',
    edit: 'Muokkaa',
    delete: 'Poista',
    cancel: 'Peruuta',
    save: 'Tallenna',
    confirm: 'Vahvista',
    close: 'Sulje',
    next: 'Seuraava',
    back: 'Takaisin',
    add: 'Lisää',
    view: 'Näytä',
    reset: 'Nollaa',
    apply: 'Käytä',
    search: 'Etsi',
    clear: 'Tyhjennä',
    signOut: 'Kirjaudu ulos',
    signIn: 'Kirjaudu sisään',
    createAccount: 'Luo tili',
    email: 'Sähköposti',
    password: 'Salasana',
    rememberMe: 'Muista minut',
    forgotPassword: 'Unohtuiko salasana?',
    enterEmail: 'Syötä sähköpostiosoitteesi',
    resetPassword: 'Nollaa salasana',
    newPassword: 'Uusi salasana',
    confirmNewPassword: 'Vahvista uusi salasana',
    updatePassword: 'Päivitä salasana',
    sendResetLink: 'Lähetä nollauslinkki',
    goBackToLogin: 'Palaa kirjautumiseen',
    name: 'Nimi',
    interestRate: 'Korko',
  },
  form: {
    years: 'Vuotta',
    months: 'Kuukautta',
    required: 'Pakollinen kenttä',
    invalidEmail: 'Virheellinen sähköpostiosoite',
    passwordMismatch: 'Salasanat eivät täsmää',
    minLength: 'Vähintään 8 merkkiä',
    maxLength: 'Enintään 100 merkkiä',
    numberRequired: 'Vähintään yksi numero',
    specialCharacterRequired: 'Vähintään yksi erikoismerkki',
    loanAmount: 'Lainan määrä',
    interestRate: 'Korko',
    loanTerm: 'Laina-aika',
    repaymentType: 'Lyhennystapa',
    interestType: 'Korkotyyppi',
    customPayment: 'Mukautettu maksu',
    isActive: 'Aktiivinen',
    monthlyFee: 'Kuukausimaksu',
    creditCardBalance: 'Luottokortin saldo',
    creditCardLimit: 'Luottokortin luottoraja',
    creditCardApr: 'Luottokortin korko',
    creditCardMinPayment: 'Luottokortin minimimaksu',
    creditCardMinPaymentPercent: 'Luottokortin minimimaksuprosentti',
    creditCardFullPayment: 'Maksa koko saldo',
    name: 'Velan nimi',
    placeholderName: 'Esim. Asuntolaina',
    amount: 'Velan määrä (€)',
    placeholderAmount: 'Esim. 10000',
    placeholderInterestRate: 'Esim. 3.5',
    termYears: 'Laina-aika (vuotta)',
    placeholderTermYears: 'Esim. 10',
    placeholderMonthlyFee: 'Esim. 100',
    monthlyFeeDescription: 'Lisämaksut, kuten tilinhoitomaksut',
    submit: 'Lisää velka',
    title: 'Lisää uusi velka',
    editTitle: 'Muokkaa velkaa',
    loanAdded: 'Velka lisätty',
    loanAddedDesc: 'Uusi velka on lisätty onnistuneesti',
    loanUpdated: 'Velka päivitetty',
    loanUpdatedDesc: 'Velka on päivitetty onnistuneesti',
    cancel: 'Peruuta',
    update: 'Päivitä',
    placeholderCustomPayment: 'Esim. 500',
    estimatedTerm: 'Arvioitu laina-aika',
    paymentTooSmall: 'Maksu on liian pieni'
  },
  loan: {
    types: {
      annuity: 'Annuiteetti',
      'equal-principal': 'Tasalyhennys',
      'fixed-installment': 'Kiinteä maksuerä',
      'custom-payment': 'Mukautettu maksu',
    },
    interestTypes: {
      fixed: 'Kiinteä',
      'variable-euribor': 'Vaihtuva (Euribor)',
    },
    table: {
      monthlyPayment: 'Kuukausierä',
      principal: 'Lyhennys',
      interest: 'Korko',
      term: 'Laina-aika',
      totalInterest: 'Kokonaiskorko',
      totalPayment: 'Kokonaiskustannus',
      remainingBalance: 'Jäljellä',
      interestRate: 'Korko',
      name: 'Nimi',
      amount: 'Määrä',
      years: 'Vuotta',
      months: 'Kuukautta',
      edit: 'Muokkaa',
      delete: 'Poista',
      payoff: 'Maksa pois',
      inactive: 'Ei aktiivinen',
      monthlyFee: 'Kuukausimaksu',
    },
    addLoan: 'Lisää laina',
    editLoan: 'Muokkaa lainaa',
    loanDetails: 'Lainan tiedot',
    loanName: 'Lainan nimi',
    loanAmount: 'Lainan määrä',
    interestRate: 'Korko',
    loanTerm: 'Laina-aika',
    repaymentType: 'Lyhennystapa',
    interestType: 'Korkotyyppi',
    customPayment: 'Mukautettu maksu',
    isActive: 'Aktiivinen',
    monthlyFee: 'Kuukausimaksu',
    loanCalculator: 'Lainalaskuri',
    calculate: 'Laske',
    results: 'Tulokset',
    monthlyPayment: 'Kuukausierä',
    totalInterest: 'Kokonaiskorko',
    totalPayment: 'Kokonaiskustannus',
    paymentSchedule: 'Maksuaikataulu',
    year: 'Vuosi',
    month: 'Kuukausi',
    principalPayment: 'Lyhennys',
    interestPayment: 'Korko',
    remainingBalance: 'Jäljellä',
    totalInterestPaid: 'Maksetut korot',
    totalPrincipalPaid: 'Maksetut lyhennykset',
    totalPaid: 'Maksettu yhteensä',
    summary: 'Yhteenveto',
    assumptions: 'Oletukset',
    interestAccrued: 'Kertyneet korot',
    principalPaid: 'Maksettu lyhennys',
    projectedBalance: 'Arvioitu saldo',
    initialBalance: 'Alkusumma',
    finalBalance: 'Loppusumma',
    payment: 'Maksu',
    date: 'Päivämäärä',
    description: 'Kuvaus',
    details: 'Tiedot',
    editLoanDetails: 'Muokkaa lainan tietoja',
    deleteLoan: 'Poista laina',
    confirmDeleteLoan: 'Haluatko varmasti poistaa tämän lainan?',
    noLoansAdded: 'Ei lisättyjä lainoja.',
    addYourFirstLoan: 'Lisää ensimmäinen lainasi!',
    customPaymentNote: 'Jos mukautettu maksu ei kata korkoja, lainaa ei makseta koskaa takaisin.',
    customPaymentWarning: 'Mukautettu maksu on liian pieni kattamaan korot. Laina ei lyhene.',
    customPaymentTermEstimate: 'Arvioitu laina-aika on {months} kuukautta.',
    customPaymentTermEstimateNever: 'Lainaa ei makseta koskaan takaisin tällä maksulla.',
    customPaymentEnterValidPayment: 'Syötä kelvollinen maksu.',
    customPaymentGreaterThanZero: 'Mukautetun maksun on oltava suurempi kuin nolla.',
    monthlyFeeInfo: 'Kuukausimaksu lisätään kuukausittaiseen maksuun ja kokonaiskorkoon.',
  },
  creditCard: {
    addCard: 'Lisää luottokortti',
    editCard: 'Muokkaa luottokorttia',
    cardDetails: 'Luottokortin tiedot',
    cardName: 'Luottokortin nimi',
    cardBalance: 'Saldo',
    cardLimit: 'Luottoraja',
    cardApr: 'Korko',
    cardMinPayment: 'Minimimaksu',
    cardMinPaymentPercent: 'Minimimaksuprosentti',
    cardFullPayment: 'Maksa koko saldo',
    isActive: 'Aktiivinen',
    table: {
      name: 'Nimi',
      balance: 'Saldo',
      limit: 'Luottoraja',
      apr: 'Korko',
      minPayment: 'Minimimaksu',
      effectivePayment: 'Tehokas maksu',
      payoffTime: 'Maksuaika',
      utilization: 'Käyttöaste',
      edit: 'Muokkaa',
      delete: 'Poista',
      payoff: 'Maksa pois',
      inactive: 'Ei aktiivinen',
    },
    utilizationRate: 'Käyttöaste',
    monthlyInterest: 'Kuukausikorko',
    totalInterest: 'Kokonaiskorko',
    payoffMonths: 'Maksuaika (kuukausia)',
    confirmDeleteCard: 'Haluatko varmasti poistaa tämän luottokortin?',
    noCardsAdded: 'Ei lisättyjä luottokortteja.',
    addYourFirstCard: 'Lisää ensimmäinen luottokorttisi!',
    fullPayment: 'Koko maksu',
    minimumPayment: 'Minimimaksu',
    never: 'Ei koskaan',
    paid: 'Maksettu',
  },
  debtSummary: {
    title: 'Velkayhteenveto',
    totalMonthlyPayment: 'Kuukausittaiset maksuerät yhteensä',
    totalMonthlyInterest: 'Kuukausittaiset korot yhteensä',
    totalLifetimeInterest: 'Kokonaiskorkoarvio',
    totalBalance: 'Velkasaldo yhteensä',
    summaryExplanation: 'Tämä on yhteenveto kaikista veloistasi, mukaan lukien lainat ja luottokortit.',
    loanName: 'Lainan nimi',
    monthlyPayment: 'Kuukausierä',
    monthlyInterest: 'Kuukausikorko',
    totalInterestEstimate: 'Kokonaiskorkoarvio',
    noLoansMessage: 'Ei lisättyjä lainoja.',
    totalLoans: 'Lainat yhteensä',
    cardName: 'Luottokortin nimi',
    noCardsMessage: 'Ei lisättyjä luottokortteja.',
    totalCards: 'Luottokortit yhteensä',
    includesFees: 'Sisältää maksut',
    demoDataMessage: 'Tämä on demoversio. Tiedot eivät ole reaaliaikaisia.',
    neverPaidOff: 'Ei maksettu koskaan',
  },
  toast: {
    loanAdded: 'Laina lisätty!',
    loanUpdated: 'Laina päivitetty!',
    loanDeleted: 'Laina poistettu!',
    cardAdded: 'Luottokortti lisätty!',
    cardUpdated: 'Luottokortti päivitetty!',
    cardDeleted: 'Luottokortti poistettu!',
    loanPaidOff: 'Laina maksettu',
    cardPaidOff: 'Luottokortti maksettu',
    cookieConsent: 'Tämä sivusto käyttää evästeitä käyttökokemuksen parantamiseen.',
    cookieDecline: 'Evästeet hylätty.',
    cookieAccept: 'Evästeet hyväksytty.',
  },
  tabs: {
    dashboard: 'Kojelauta',
    loans: 'Lainat',
    creditCards: 'Luottokortit',
    debtSummary: 'Velkayhteenveto',
    glossary: 'Sanastoa',
    affiliate: 'Yhteistyökumppanit',
  },
  affiliate: {
    title: 'Yhteistyökumppanit',
    subtitle: 'Tutustu suositeltuihin palveluihin ja tuotteisiin.',
    compareLoans: 'Vertaile lainoja',
    refinanceTitle: 'Harkitse uudelleenrahoitusta',
    refinanceText: 'Löydä parempi korko ja säästä rahaa.',
    creditCardTitle: 'Parhaat luottokortit',
    creditCardText: 'Tutustu luottokorttitarjouksiin ja hyödy eduista.',
    disclaimer: 'Saatamme ansaita provision, jos käytät näitä linkkejä, mutta se ei vaikuta hintaan sinulle.',
  },
  recommendations: {
    title: 'Suositukset',
    topPriority: 'Ensisijaiset lainat',
    topPriorityText: 'Tämä laina on sekä korkeakorkoisin että sillä on suurin kokonaiskorko.',
    topPriorityTextPlural: 'Nämä lainat ovat sekä korkeakorkoisimpia että niillä on suurin kokonaiskorko.',
    highTotalInterest: 'Suurimmat kokonaiskorot',
    highTotalInterestText: 'Tällä lainalla on suurin kokonaiskorko.',
    highTotalInterestTextPlural: 'Näillä lainoilla on suurimmat kokonaiskorot.',
    highInterest: 'Korkeakorkoiset lainat',
    highInterestText: 'Tämä on korkeakorkoisin laina.',
    highInterestTextPlural: 'Nämä ovat korkeakorkoisimmat lainat.',
  },
  savings: {
    title: "Säästöpotentiaali",
    description: "Lainojen nopeampi maksaminen voi säästää huomattavan summan korkokuluissa.",
    payingOffNow: "Maksamalla nyt säästät",
    payOff: "Maksa pois",
  },
  table: {
    year: 'vuosi',
    years: 'vuotta',
  },
    landing: {
    seo: {
      title: 'Velanmaksu helpoksi - Ilmainen taloustyökalu | Laina Simulaattori',
      description: 'Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Laina Simulaattorilla. Aloita velaton matkasi tänään!',
      keywords: 'velanmaksu, lainahallinta, taloustyökalut, velkalumipallovaikutus, velkavyörymetodi, taloudellinen vapaus, velaton',
    },
    hero: {
      headline: 'Maksa velkasi nopeammin - Aloita taloudenhoito tänään!',
      subheadline: 'Luo ilmainen henkilökohtainen velanmaksusuunnitelma ja ota hallinta taloudestasi.',
      cta: 'Kirjaudu tai rekisteröidy nyt',
      secondaryCta: 'Lue lisää',
      imageAlt: 'Henkilö hymyilee tarkastellessaan talouttaan kannettavalla tietokoneella',
    },
  loanTerms: {
    pageTitle: "Taloussanasto",
    backButton: "Takaisin",
    introduction: "Taloussanasto yksinkertaisesti selitettynä. Ymmärrä taloudelliset termit helposti.",
    searchPlaceholder: "Etsi termiä...",
    noResults: "Ei hakutuloksia. Kokeile eri hakusanaa.",
    tryCalculator: "Kokeile laskuria nähdäksesi miten tämä vaikuttaa lainaasi →",
    relatedTools: "Aiheeseen liittyvät työkalut",
    loanCalculator: "Lainalaskuri",
    loanCalculatorDesc: "Laske lainan maksuerät eri lyhennystavoilla",
    bestLoanOffers: "Löydä parhaat lainatarjoukset",
    bestLoanOffersDesc: "Vertaile asuntolainojen korkoja ja lainavaihtoehto luotetuista lähteistä",
    interestRate: {
      title: "Korko",
      description: "Korko on summa, jonka maksat lainanantajalle heidän rahansa käytöstä. Se ilmaistaan prosenttiosuutena lainan pääomasta ja maksetaan yleensä kuukausittain."
    },
    annuity: {
      title: "Annuiteetti",
      description: "Annuiteettilainassa maksat saman summan joka kuukausi koko laina-ajan. Aluksi suurempi osa maksustasi menee korkoihin, ja ajan myötä yhä enemmän pääoman lyhentämiseen."
    },
    principal: {
      title: "Pääoma",
      description: "Pääoma on alkuperäinen lainaamasi rahasumma. Kuukausittainen maksusi koostuu tämän pääoman takaisinmaksusta sekä korosta."
    },
    euribor: {
      title: "Euribor",
      description: "Euribor (Euro Interbank Offered Rate) on viitekorko, johon monet vaihtuvakorkoiset lainat on sidottu. Se kuvastaa korkoa, jolla eurooppalaiset pankit lainaavat toisilleen, ja se voi muuttua ajan myötä vaikuttaen kokonaislainakorkoon."
    },
    totalInterest: {
      title: "Kokonaiskorko",
      description: "Kokonaiskorko on kaikkien korkoerien summa, jotka maksat lainan elinkaaren aikana. Se riippuu lainan määrästä, korosta, laina-ajasta ja lyhennystavasta."
    },
    termYears: {
      title: "Laina-aika (vuosia)",
      description: "Laina-aika on ajanjakso, jonka aikana sovit maksavasi lainan takaisin. Pidempi laina-aika tarkoittaa yleensä pienempiä kuukausittaisia maksuja, mutta enemmän maksettavaa korkoa yhteensä."
    },
    equalPrincipal: {
      title: "Tasalyhennys",
      description: "Tasalyhennyslainassa maksat saman verran pääomaa joka kuukausi, mutta korko-osuus pienenee ajan myötä. Siten kuukausimaksusi ovat korkeammat alussa ja pienenevät ajan myötä."
    },
    fixedInstallment: {
      title: "Kiinteä maksuerä",
      description: "Kiinteässä maksuerässä maksat saman summan joka kuukausi. Tämä maksutyyppi on samankaltainen kuin annuiteetti, mutta sitä käytetään usein, kun korko saattaa vaihdella."
    }
  },
  language: {
    en: "Englanti",
    fi: "Suomi"
  },
  validation: {
    nameRequired: 'Nimi on pakollinen',
    nameRequiredDesc: 'Anna velalle nimi',
    invalidAmount: 'Virheellinen summa',
    invalidAmountDesc: 'Syötä positiivinen summa',
    invalidRate: 'Virheellinen korko',
    invalidRateDesc: 'Syötä positiivinen korko',
    invalidTerm: 'Virheellinen laina-aika',
    invalidTermDesc: 'Syötä positiivinen laina-aika',
    invalidPayment: 'Virheellinen maksusumma',
    invalidPaymentDesc: 'Syötä positiivinen maksusumma',
    paymentTooSmall: 'Maksu on liian pieni',
    paymentTooSmallDesc: 'Maksun tulee kattaa vähintään korot'
  },
  repayment: {
    annuity: 'Annuiteetti',
    equalPrincipal: 'Tasalyhennys',
    fixedInstallment: 'Kiinteä maksuerä',
    customPayment: 'Mukautettu maksu'
  },
  interest: {
    fixed: 'Kiinteä',
    variableEuribor: 'Vaihtuva (Euribor)'
  },
  dashboard: {
    title: 'Kojelauta',
    welcome: 'Tervetuloa',
    user: 'Käyttäjä',
    welcomeSubtitle: 'Tässä velkojenhallintasi yleiskatsaus',
    viewDebtSummary: 'Näytä velkayhteenveto',
    totalDebt: 'Kokonaisvelka',
    paidDebt: 'Maksettu velka',
    remainingDebt: 'Jäljellä oleva velka',
    debtFreeDate: 'Velaton päivämäärä',
    progress: 'Edistyminen',
    progressMessage: 'Olet jo maksanut {{percentage}}% velastasi - jatka samaan malliin!',
    paymentPlanSummary: 'Maksusuunnitelman yhteenveto',
    paymentPlanDescription: 'Velanmaksustrategiasi yhdellä silmäyksellä',
    monthlyBudget: 'Kuukausibudjetti',
    minimumPayments: 'Minimimaksut',
    extraBudget: 'Ylimääräinen budjetti',
    prioritizedDebt: 'Priorisoitu velka',
    interestRate: 'korko',
    allocatingExtra: 'Kohdistetaan ylimääräinen {{amount}} tälle velalle',
    viewFullPlan: 'Näytä koko suunnitelma',
    debtBreakdown: 'Velkojen erittely',
    allDebts: 'Kaikki velat',
    loans: 'Lainat',
    creditCards: 'Luottokortit',
    financialTips: 'Talousvinkit',
    tip1: 'Maksa korkeakorkoiset velat ensin säästääksesi rahaa pitkällä aikavälillä (lumivyörymenetelmä).',
    tip2: 'Luo hätärahasto, joka kattaa vähintään 3 kuukauden menot välttääksesi uutta velkaa.',
    tip3: 'Harkitse velkojen yhdistämistä, jos sinulla on useita korkeakorkoisia velkoja.',
    viewGlossary: 'Näytä taloussanasto',
    debtFreeTimeline: 'Velaton aikajana',
    timelineDescription: 'Ennustettu polkusi taloudelliseen vapauteen',
    now: 'Nyt',
    currentDebt: 'Nykyinen velka',
    creditCardsFree: 'Luottokortit maksettu',
    projectDate: 'Arvioitu päivämäärä',
    debtFree: 'Velaton',
    viewDetailedTimeline: 'Näytä yksityiskohtainen aikajana',
    helpWithDebt: 'Tarvitsetko apua velkojesi kanssa?',
    year: 'vuosi',
  }
};

export default fi;
