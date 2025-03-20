
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
      noLoans: 'Ei lisättyjä lainoja',
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
    title: 'Lisää luottokortti',
    form: {
      name: 'Kortin nimi',
      placeholderName: 'Esim. Visa Luotto',
      balance: 'Nykyinen saldo',
      placeholderBalance: 'Esim. 1000',
      limit: 'Luottoraja',
      placeholderCreditLimit: 'Esim. 5000',
      apr: 'Vuosikorko (%)',
      placeholderApr: 'Esim. 15.9',
      minPaymentPercent: 'Minimimaksu (%)',
      minPayment: 'Minimimaksu (€)',
      placeholderMinPayment: 'Esim. 30',
      autoCalculated: 'Lasketaan automaattisesti prosenttiosuudesta',
      fullPayment: 'Maksa koko summa joka kuukausi',
      submit: 'Lisää luottokortti'
    },
    table: {
      name: 'Nimi',
      balance: 'Saldo',
      limit: 'Luottoraja',
      availableCredit: 'Käytettävissä',
      apr: 'Vuosikorko',
      minPayment: 'Minimimaksu',
      payoffTime: 'Maksuaika',
      utilizationRate: 'Käyttöaste',
      monthlyInterest: 'Kuukausikorko',
      actions: 'Toiminnot',
      edit: 'Muokkaa',
      delete: 'Poista',
      noCards: 'Ei lisättyjä luottokortteja'
    },
    editTitle: 'Muokkaa luottokorttia',
    deleteTitle: 'Poista luottokortti',
    confirmDeleteCard: 'Haluatko varmasti poistaa tämän luottokortin?',
    noCardsAdded: 'Ei lisättyjä luottokortteja.',
    addYourFirstCard: 'Lisää ensimmäinen luottokorttisi!',
    minimumPayment: 'Minimimaksu',
    paid: 'Maksettu',
    isActive: 'Aktiivinen',
    never: 'Ei ikinä',
    summary: {
      title: 'Luottokorttien yhteenveto',
      totalBalance: 'Kokonaissaldo',
      totalMinPayment: 'Minimimaksut yhteensä',
      totalMonthlyInterest: 'Kuukausikorot yhteensä',
      totalLimit: 'Luottorajat yhteensä',
      totalUtilization: 'Kokonaiskäyttöaste',
      cards: 'Kortteja',
      avgApr: 'Keskimääräinen korko',
      highestApr: 'Korkein korko',
      utilizationRate: 'Kokonaiskäyttöaste'
    }
  },
  debtSummary: {
    pageTitle: 'Velkayhteenveto',
    pageDescription: 'Yleiskatsaus veloistasi ja mahdollisista säästöistä.',
    metaDescription: 'Saa selkeä yleiskatsaus veloistasi ja löydä tapoja säästää rahaa.',
    backButton: 'Takaisin laskuriin',
    totalMonthlyPayment: 'Kuukausittaiset maksuerät yhteensä',
    totalMonthlyInterest: 'Kuukausittaiset korot yhteensä',
    totalBalance: 'Velkasaldo yhteensä',
    loansSection: 'Lainat',
    creditCardsSection: 'Luottokortit',
    totalSummarySection: 'Velkojen yhteenveto',
    demoDataMessage: 'Näytetään esimerkkitietoja. Lisää omat velkasi saadaksesi henkilökohtaisia tietoja.',
    noLoansMessage: 'Ei lisättyjä lainoja. Lisää lainasi nähdäksesi yhteenvedon.',
    noCardsMessage: 'Ei lisättyjä luottokortteja. Lisää luottokorttisi nähdäksesi yhteenvedon.',
    cardName: 'Kortin nimi',
    monthlyPayment: 'Kuukausierä',
    monthlyInterest: 'Kuukausikorko',
    totalInterestEstimate: 'Kokonaiskorkoarvio',
    totalCards: 'Luottokortit yhteensä',
    neverPaidOff: 'Ei makseta koskaan pois',
    loanName: 'Lainan nimi',
    totalLifetimeInterest: 'Kokonaiskorkoarvio',
    summaryExplanation: 'Tämä yhteenveto näyttää kokonaiskuvan veloistasi ja auttaa priorisoimaan takaisinmaksustrategiaasi.',
    totalLoans: 'Lainat yhteensä',
    payoffButton: 'Maksa pois',
    actions: 'Toiminnot',
    title: 'Velkayhteenveto',
    includesFees: 'Sisältää maksut'
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
    loanActivated: 'Laina aktivoitu',
    loanDeactivated: 'Laina deaktivoitu',
    cardActivated: 'Luottokortti aktivoitu',
    cardDeactivated: 'Luottokortti deaktivoitu',
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
    title: "Takaisinmaksusuositukset",
    topPriority: "Tärkein kohde",
    highInterest: "Korkeakorkoinen",
    highTotalInterest: "Korkea kokonaiskorko",
    topPriorityText: "Maksa tämä laina ensin säästääksesi eniten rahaa.",
    topPriorityTextPlural: "Maksa nämä lainat ensin säästääksesi eniten rahaa.",
    highInterestText: "Harkitse tämän lainan nopeampaa maksamista korkean koron vuoksi.",
    highInterestTextPlural: "Harkitse näiden lainojen nopeampaa maksamista korkean koron vuoksi.",
    highTotalInterestText: "Tämän lainan maksaminen aikaisin säästää sinulle merkittävän määrän korkoja.",
    highTotalInterestTextPlural: "Näiden lainojen maksaminen aikaisin säästää sinulle merkittävän määrän korkoja.",
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
    benefits: {
      title: 'Ota hallinta taloudellisesta tulevaisuudestasi',
      item1: {
        title: 'Personoitu takaisinmaksusuunnitelma',
        description: 'Luo räätälöity velanmaksusuunnitelma käyttäen lumivyöry- tai lumipallomenetelmää.'
      },
      item2: {
        title: 'Seuraa edistymistäsi',
        description: 'Visualisoi edistymistäsi interaktiivisella aikajanalla ja pysy motivoituneena.'
      },
      item3: {
        title: 'Vähennä taloudellista stressiä',
        description: 'Saavuta taloudellinen vapaus nopeammin ja vähennä taloudellista stressiäsi.'
      }
    },
    methods: {
      title: 'Valitse velanmaksustrategiasi',
      subtitle: 'Eri menetelmät toimivat eri ihmisille. Löydä mikä toimii sinulle.',
      avalanche: {
        title: 'Velkavyöry',
        description: 'Velkavyörymenetelmä keskittyy maksamaan korkeakorkoisimmat velat ensin ja tekemään vähimmäismaksut muille veloille.',
        benefit1: 'Matemaattisesti optimaalinen - säästää eniten korkokuluja',
        benefit2: 'Vähentää kokonaismaksuaikaa',
        benefit3: 'Paras niille, joita motivoi pitkän aikavälin säästöt',
        imageAlt: 'Kaavio, joka näyttää korkomaksujen vähentymisen ajan myötä'
      },
      snowball: {
        title: 'Velkalumipalllo',
        description: 'Velkalumipalllo-menetelmä keskittyy maksamaan pienimmät velat ensin momentin ja motivaation luomiseksi.',
        benefit1: 'Luo varhaisia voittoja motivaation rakentamiseksi',
        benefit2: 'Yksinkertaistaa taloutta vähentämällä maksujen määrää',
        benefit3: 'Paras niille, jotka tarvitsevat psykologisia voittoja',
        imageAlt: 'Kolikkojen kasa, joka kasvaa suuremmaksi kuvaten lumipallovaikutusta'
      }
    },
    testimonial1: 'Tämä sovellus auttoi minua maksamaan 5 000 € velkaa vain vuodessa! Visualisointi piti minut motivoituneena.',
    testimonial2: 'Olen kokeillut monia budjetointisovelluksia, mutta tämä on ainoa, joka todella auttoi luomaan realistisen velanmaksusuunnitelman.',
    testimonial3: 'Velkalumipallomenetelmä muutti elämäni. Olen jo maksanut kolme luottokorttia ja olen matkalla velattomaksi ensi vuoteen mennessä!',
    faq: {
      title: 'Usein kysytyt kysymykset',
      question1: 'Miten sovellus toimii?',
      answer1: 'Syötä velkasi, mukaan lukien lainan määrät, korot ja vähimmäismaksut. Sovellus laskee optimaalisen takaisinmaksusuunnitelman valitsemasi menetelmän (lumivyöry tai lumipallo) perusteella ja näyttää, milloin olet velaton.',
      question2: 'Onko sovelluksen käyttö ilmaista?',
      answer2: 'Kyllä! Laina Simulaattori on täysin ilmainen käyttää. Uskomme, että kaikilla tulisi olla pääsy työkaluihin, jotka auttavat parantamaan taloudellista tilannettaan.',
      question3: 'Voinko käyttää sovellusta opintolainoihin?',
      answer3: 'Ehdottomasti! Sovellus toimii minkä tahansa tyyppisen lainan kanssa, mukaan lukien opintolainat, luottokortit, henkilökohtaiset lainat, autolainat ja asuntolainat.',
      question4: 'Mikä on lumivyöry- ja lumipallomenetelmien ero?',
      answer4: 'Lumivyörymenetelmässä priorisoidaan korkeakorkoisten velkojen maksaminen ensin säästääksesi eniten korkokuluissa. Lumipallomenetelmässä keskitytään pienimpien velkojen maksamiseen ensin, mikä luo momentin ja motivaation.',
    },
    finalCta: {
      title: 'Aloita velaton matkasi tänään',
      subtitle: 'Liity tuhansien käyttäjien joukkoon, jotka ovat jo ottaneet taloudellisen tulevaisuutensa haltuun.',
      buttonText: 'Rekisteröidy nyt - Se on ilmaista',
    },
    footer: {
      about: {
        title: 'Tietoa Laina Simulaattorista',
        description: 'Laina Simulaattori on ilmainen työkalu, joka on suunniteltu auttamaan sinua luomaan ja seuraamaan henkilökohtaista velanmaksusuunnitelmaasi.',
      },
      links: {
        title: 'Pikalinkit',
        item1: 'Kojelauta',
        item2: 'Lainaehdot',
        item3: 'Velkayhteenveto',
      },
      legal: {
        title: 'Lakiasiat',
        privacy: 'Tietosuojaseloste',
        terms: 'Käyttöehdot',
        cookies: 'Evästekäytäntö',
      },
      copyright: 'Kaikki oikeudet pidätetään.',
    },
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
    title: "Takaisinmaksusuunnitelma",
    calculatingDebtFree: "Lasketaan velattoman ajankohdan oletusta...",
    debtFreeBy: "Velaton",
    debtFreeDate: "Olet velaton",
    budget: "Kuukausibudjetti",
    interestSaved: "Säästyvät korot",
    totalInterest: "Kokonaiskorko",
    timeSaved: "Säästyvät kuukaudet",
    totalMonths: "Kokonaiskuukaudet",
    compareHeader: "Vertaile takaisinmaksustrategioita",
    highestInterestFirst: "Korkein korko ensin",
    highestInterestDesc: "Maksa eniten korkeakorkoisiin lainoihin",
    lowestBalanceFirst: "Pienin saldo ensin",
    lowestBalanceDesc: "Maksa eniten pienikertymäisiin lainoihin",
    highestMonthlyFirst: "Suurin kuukausimaksu ensin",
    highestMonthlyDesc: "Maksa eniten suurikuukausimaksuisiin lainoihin",
    customStrategy: "Mukautettu takaisinmaksu",
    customStrategyDesc: "Tee oma takaisinmaksustrategia",
    strategy: "Takaisinmaksustrategia",
    paymentPlan: "Maksusuunnitelma",
    month: "Kuukausi",
    remainingBalance: "Jäljellä oleva saldo",
    principal: "Pääoma",
    interest: "Korko",
    cumulativeInterest: "Kumulatiivinen korko",
    cumulativePrincipal: "Kumulatiivinen pääoma",
    payment: "Maksu",
    monthlyPayment: "Kuukausimaksu",
    extraPayment: "Ylimääräinen maksu",
    calculationAssumptions: "Laskennassa on oletettu, että kuukausimaksut pysyvät samana ja ylimääräiset maksut jakautuvat takaisinmaksustrategian mukaisesti.",
    calculateAlert: "Aseta lainat ja kuukausibudjetti takaisinmaksusuunnitelman laskentaa varten.",
    budgetPlaceholder: "Anna kuukausibudjetti",
    enterBudgetPrompt: "Syötä kuukausibudjettisi ja klikkaa Laske nähdäksesi takaisinmaksusuunnitelmasi.",
    calculateNow: "Laske nyt",
    summaryTab: "Velkayhteenveto",
    planTab: "Takaisinmaksusuunnitelma",
    repaymentType: "Lyhennystapa",
    insufficientBudget: "Riittämätön budjetti",
    budgetTooLow: "Budjetti on liian pieni kattamaan minimimaksut",
    planSummary: "Takaisinmaksusuunnitelman yhteenveto",
    planDescription: "Alla on yhteenveto takaisinmaksusuunnitelmastasi",
    timeToFreedom: "Aika velattomaksi",
    totalInterestPaid: "Maksetut korot yhteensä",
    firstDebtPaidOff: "Ensimmäinen velka maksettu",
    monthlyAllocation: "Kuukausittainen jako",
    allocationDescription: "Tämän verran maksat kuukausittain jokaiseen velkaan",
    debtName: "Velan nimi",
    minPayment: "Minimimaksu",
    totalPayment: "Kokonaismaksu",
    total: "Yhteensä",
    balanceTimeline: "Lainan väheneminen ajan myötä",
    balanceTimelineDescription: "Kokonaisvelan väheneminen kuukausittain",
    balance: "Saldo",
    months: "Kuukaudet",
    debtPayoffSchedule: "Velkojen maksuaikataulu",
    payoffScheduleDescription: "Kuinka kauan kestää maksaa jokainen velka",
    payoffTime: "Maksuaika",
    totalRemaining: "Jäljellä yhteensä",
    noPlanYet: "Ei vielä takaisinmaksusuunnitelmaa"
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
  },
  auth: {
    login: 'Kirjaudu sisään',
    logout: 'Kirjaudu ulos',
    dashboard: 'Kojelauta',
    email: 'Sähköposti',
    password: 'Salasana',
    signIn: 'Kirjaudu sisään',
    signUp: 'Rekisteröidy',
    forgotPassword: 'Unohditko salasanasi?',
    noAccount: 'Eikö sinulla ole tiliä?',
    createAccount: 'Luo tili',
    alreadyHaveAccount: 'Onko sinulla jo tili?',
    successTitle: 'Tervetuloa!',
    successMessage: 'Olet nyt kirjautunut sisään.',
    errorTitle: 'Virhe',
    invalidCredentials: 'Virheellinen sähköposti tai salasana.',
    resetPassword: 'Nollaa salasana',
    resetPasswordEmailSent: 'Salasanan nollausviesti on lähetetty.',
    verificationEmailSent: 'Vahvistusviesti on lähetetty. Tarkista sähköpostisi.',
    welcome: "Tervetuloa Laina Simulaattoriin",
    description: "Kirjaudu sisään tilillesi tai luo uusi tili",
    loggingIn: "Kirjaudutaan...",
    signingUp: "Rekisteröidään...",
    loginSuccess: "Kirjautuminen onnistui",
    welcomeBack: "Tervetuloa takaisin!",
    loginError: "Kirjautuminen epäonnistui",
    signupSuccess: "Rekisteröityminen onnistui",
    checkEmail: "Tarkista sähköpostisi vahvistaaksesi tilisi",
    signupError: "Rekisteröityminen epäonnistui"
  }
};

export default fi;
