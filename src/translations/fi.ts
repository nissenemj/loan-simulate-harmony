export default {
  app: {
    title: "Lainalaskuri",
    subtitle: "Yksinkertainen työkalu lainojen hallintaan.",
    footer: "Tehty ❤️ Reactilla ja Next.js:llä.",
  },
  form: {
    title: "Lisää laina",
    name: "Nimi",
    amount: "Lainasumma",
    interestRate: "Korko",
    termYears: "Laina-aika (vuosina)",
    repaymentType: "Lyhennystapa",
    interestType: "Koron tyyppi",
    customPayment: "Mukautettu maksu",
    isActive: "Aktiivinen",
    estimatedTerm: "Arvioitu laina-aika",
    annuity: "Annuiteetti",
    equalPrincipal: "Tasalyhennys",
    fixedInstallment: "Kiinteä maksuerä",
    customPaymentType: "Mukautettu maksu",
    fixed: "Kiinteä",
    variableEuribor: "Vaihtuva (Euribor)",
    submit: "Lisää laina",
    edit: "Muokkaa lainaa",
    cancel: "Peruuta",
    update: "Päivitä laina",
    reset: "Nollaa",
    paymentTooSmall: "Maksu on liian pieni",
    years: "vuotta",
    months: "kuukautta",
    placeholderName: "esim. Asuntolaina",
    placeholderAmount: "esim. 200000",
    placeholderInterestRate: "esim. 5.0",
    placeholderTermYears: "esim. 30",
    placeholderCustomPayment: "esim. 1000",
  },
  interest: {
    fixed: "Kiinteä",
    variableEuribor: "Vaihtuva (Euribor)",
  },
  table: {
    name: "Nimi",
    payment: "Kuukausierä",
    interest: "Korko",
    totalInterest: "Kokonaiskorko",
    term: "Laina-aika",
    type: "Tyyppi",
    active: "Aktiivinen",
    year: "vuosi",
    years: "vuotta",
    noLoans: "Ei lisättyjä lainoja.",
  },
  summary: {
    monthlyPayment: "Kuukausittainen maksu yhteensä",
    monthlyPrincipal: "Kuukausittainen pääoma yhteensä",
    monthlyInterest: "Kuukausittainen korko yhteensä",
  },
  recommendations: {
    title: "Suositukset",
    topPriority: "Ensisijainen",
    topPriorityText: "Tämä laina on sekä korkeimman koron että suurimman kokonaiskoron laina.",
    topPriorityTextPlural: "Nämä lainat ovat sekä korkeimman koron että suurimman kokonaiskoron lainoja.",
    highestInterest: "Korkein kokonaiskorko",
    highestInterestText: "Tämä laina kerää eniten korkoa koko laina-aikana.",
    highestInterestTextPlural: "Nämä lainat keräävät eniten korkoa koko laina-aikana.",
    highestRate: "Korkein korko",
    highestRateText: "Tällä lainalla on korkein korko.",
    highestRateTextPlural: "Näillä lainoilla on korkeimmat korot.",
  },
  repayment: {
    annuity: "Annuiteetti",
    equalPrincipal: "Tasalyhennys",
    fixedInstallment: "Kiinteä maksuerä",
    customPayment: "Mukautettu maksu",
  },
  tabs: {
    loans: "Lainat",
    creditCards: "Luottokortit",
    affiliate: "Tarjoukset",
    loanTerms: "Lainasanasto"
  },
  creditCard: {
    title: "Lisää luottokortti",
    form: {
      name: "Nimi",
      balance: "Saldo",
      apr: "APR",
      minPayment: "Minimimaksu",
      minPaymentPercent: "Minimimaksuprosentti",
      fullPayment: "Maksa koko saldo",
      limit: "Luottoraja",
      isActive: "Aktiivinen",
      submit: "Lisää luottokortti",
      placeholderName: "esim. Visa",
      placeholderBalance: "esim. 2000",
      placeholderApr: "esim. 18.0",
      placeholderMinPayment: "esim. 25",
      placeholderCreditLimit: "esim. 10000",
      autoCalculated: "Lasketaan automaattisesti prosentista",
    },
    table: {
      name: "Nimi",
      balance: "Saldo",
      apr: "APR",
      minPayment: "Minimimaksu",
      monthlyInterest: "Kuukausikorko",
      payoffTime: "Maksuaika",
      utilization: "Käyttöaste",
      active: "Aktiivinen",
      noCards: "Ei lisättyjä luottokortteja.",
    },
    summary: {
      title: "Luottokorttien yhteenveto",
      totalBalance: "Luottokorttien kokonaissaldo",
      totalLimit: "Luottokorttien kokonaisluottoraja",
      totalMinPayment: "Luottokorttien minimimaksu yhteensä",
      totalInterest: "Kokonaiskuukausikorko",
      totalAvailableCredit: "Kokonaisluottoraja",
      totalUtilization: "Kokonaiskäyttöaste",
    },
  },
  utilization: {
    low: "Matala",
    moderate: "Kohtuullinen",
    high: "Korkea",
  },
  toast: {
    loanActivated: "Laina aktivoitu",
    loanDeactivated: "Laina deaktivoitu",
    loanPaidOff: "Laina maksettu pois",
    loanAdded: "Laina lisätty",
  },
  validation: {
    nameRequired: "Nimi on pakollinen",
    nameRequiredDesc: "Anna lainalle tai luottokortille nimi",
    invalidAmount: "Virheellinen summa",
    invalidAmountDesc: "Summan on oltava positiivinen numero",
    invalidRate: "Virheellinen korko",
    invalidRateDesc: "Koron on oltava positiivinen numero",
    invalidTerm: "Virheellinen laina-aika",
    invalidTermDesc: "Laina-ajan on oltava positiivinen kokonaisluku",
    invalidPayment: "Virheellinen maksu",
    invalidPaymentDesc: "Maksun on oltava positiivinen numero",
    paymentTooSmall: "Maksu on liian pieni",
    paymentTooSmallDesc: "Maksun on oltava suurempi kuin kuukauden korko",
  },
  savings: {
    title: "Säästövaikutus",
    payingOffNow: "Maksamalla pois nyt säästät",
    payOff: "Maksa Pois",
    description: "Nämä laskelmat näyttävät, kuinka paljon korkoa säästäisit maksamalla lainasi pois aikaisin.",
  },
  language: {
    en: "Englanti",
    fi: "Suomi"
  },
  affiliate: {
    title: "Erikoistarjoukset",
    subtitle: "Yksinoikeudella tarjouksia luotettavilta kumppaneiltamme",
    compareLoans: "Vertaile lainatarjouksia",
    refinanceTitle: "Harkitsetko lainan uudelleenrahoitusta?",
    refinanceText: "Tarkista nämä luotetut palveluntarjoajat kilpailukykyisin hinnoin",
    creditCardTitle: "Löydä paras luottokortti",
    creditCardText: "Vertaile palkintoja, korkoja ja etuja",
    mortgageTitle: "Asuntolaina ratkaisut",
    mortgageText: "Löydä täydellinen asuntolaina tarpeisiisi",
    cta: "Lue lisää",
    disclaimer: "Huomautus: Saatamme saada korvausta, kun klikkaat tuotelinkkejä. Tämä ei vaikuta suosituksiimme tai arviointeihimme."
  },
  loanTerms: {
    pageTitle: "Lainasanasto",
    introduction: "Rahoitusterminologian ymmärtäminen auttaa tekemään parempia päätöksiä lainoista. Tässä on yksinkertainen selitys laskurissamme käytetyistä keskeisistä termeistä.",
    searchPlaceholder: "Hae termejä...",
    backButton: "Takaisin",
    noResults: "Hakusanalla ei löytynyt termejä.",
    interestRate: {
      title: "Korko",
      description: "Ylimääräinen kustannus, jonka maksat rahan lainaamisesta, ilmaistuna prosentteina. Esimerkiksi 5 %:n korko 10 000 euron lainasta tarkoittaa, että maksat 500 euroa ylimääräistä vuodessa lainatun rahan käytöstä."
    },
    annuity: {
      title: "Annuiteetti",
      description: "Takaisinmaksusuunnitelma, jossa maksat saman verran joka kuukausi koko laina-ajan. Jokainen maksu sisältää sekä pääoman (alkuperäisen lainasumman) että koron, ja pääoman osuus kasvaa ajan myötä."
    },
    principal: {
      title: "Pääoma",
      description: "Alkuperäinen summa, jonka lainasit ennen korkojen lisäämistä. Kun maksat lainaa takaisin, osa maksusta menee tämän pääoman vähentämiseen ja osa koron maksamiseen."
    },
    euribor: {
      title: "Euribor",
      description: "Euro Interbank Offered Rate - Euroopassa käytetty viitekorko. Jos lainallasi on Euriboriin sidottu vaihtuva korko, korkosi voivat nousta tai laskea tämän markkinakoron muuttuessa."
    },
    totalInterest: {
      title: "Kokonaiskorko",
      description: "Täysi ylimääräinen summa, jonka maksat koko laina-aikana lainatun summan lisäksi. Esimerkiksi, jos lainaat 100 000 euroa ja maksat takaisin yhteensä 150 000 euroa, kokonaiskorko on 50 000 euroa."
    },
    termYears: {
      title: "Laina-aika",
      description: "Aika, jonka kuluessa laina on maksettava takaisin, yleensä ilmaistuna vuosina. Pidempi laina-aika tarkoittaa pienempiä kuukausimaksuja, mutta enemmän maksettua korkoa kokonaisuudessaan."
    },
    equalPrincipal: {
      title: "Tasalyhennys",
      description: "Takaisinmaksutapa, jossa maksat saman verran pääomaa takaisin joka kuukausi sekä lisäksi korot. Kokonaismaksusi pienenee ajan myötä, kun koron osuus pienenee."
    },
    fixedInstallment: {
      title: "Kiinteä maksuerä",
      description: "Takaisinmaksutapa, jossa maksat saman kokonaissumman joka kuukausi, samankaltaisesti kuin annuiteetissa. Tämä menetelmä kuitenkin mahdollistaa tarkan maksuerän määrittämisen, mikä saattaa vaikuttaa laina-aikaan."
    }
  }
} as const;
