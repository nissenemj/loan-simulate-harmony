
export const fiTranslations = {
  // Page title and description
  "app.title": "Lainalaskuri",
  "app.subtitle": "Suunnittele, vertaile ja optimoi lainastrategiaasi tarkasti ja selkeästi",
  "app.footer": "Lainalaskuri • Yksinkertainen, tarkka taloussuunnittelu",
  
  // Form labels
  "form.title": "Lisää uusi laina",
  "form.name": "Lainan nimi",
  "form.name.placeholder": "esim. Autolaina, Asuntolaina",
  "form.amount": "Lainan määrä (€)",
  "form.amount.placeholder": "esim. 10000",
  "form.interest": "Vuosikorko (%)",
  "form.interest.placeholder": "esim. 3.5",
  "form.term": "Laina-aika (vuosissa)",
  "form.term.placeholder": "esim. 5",
  "form.repaymentType": "Takaisinmaksutyyppi",
  "form.interestType": "Korkotyyppi",
  "form.customPayment": "Kuukausimaksu (€)",
  "form.customPayment.placeholder": "esim. 200",
  "form.estimatedTerm": "Arvioitu maksuaika",
  "form.paymentTooSmall": "Maksu liian pieni (ei maksa lainaa pois)",
  "form.years": "vuotta",
  "form.months": "kuukautta",
  "form.addButton": "Lisää laina",
  
  // Repayment types
  "repayment.annuity": "Annuiteetti",
  "repayment.equalPrincipal": "Tasalyhennys",
  "repayment.fixedInstallment": "Kiinteä erä",
  "repayment.customPayment": "Oma maksuerä",
  
  // Interest types
  "interest.fixed": "Kiinteä",
  "interest.variableEuribor": "Vaihtuva - Euribor",
  
  // Table headers
  "table.name": "Lainan nimi",
  "table.payment": "Kuukausimaksu",
  "table.interest": "Korkoprosentti",
  "table.totalInterest": "Kokonaiskorko",
  "table.term": "Laina-aika",
  "table.type": "Tyyppi",
  "table.active": "Aktiivinen",
  "table.noLoans": "Ei lisättyjä lainoja. Lisää ensimmäinen laina yllä olevalla lomakkeella.",
  "table.years": "vuotta",
  "table.year": "vuosi",
  
  // Loan summary
  "summary.monthlyPayment": "Kuukausimaksu yhteensä",
  "summary.monthlyPrincipal": "Kuukausittainen pääoma",
  "summary.monthlyInterest": "Kuukausittainen korko",
  
  // Recommendations
  "recommendations.title": "Suositukset",
  "recommendations.topPriority": "Tärkein prioriteetti",
  "recommendations.topPriorityText": "omaa sekä korkeimman kokonaiskoron että korkeimman korkokannan. Tämän tulisi olla ensisijainen kohde ennenaikaiselle takaisinmaksulle.",
  "recommendations.topPriorityTextPlural": "omaavat sekä korkeimman kokonaiskoron että korkeimman korkokannan. Näiden tulisi olla ensisijaisia kohteita ennenaikaiselle takaisinmaksulle.",
  "recommendations.highestInterest": "Korkein kokonaiskorko",
  "recommendations.highestInterestText": "omaa korkeimman kokonaiskoron. Harkitse tämän priorisointia ennenaikaisessa takaisinmaksussa säästääksesi pitkän aikavälin kustannuksissa.",
  "recommendations.highestInterestTextPlural": "omaavat korkeimman kokonaiskoron. Harkitse näiden priorisointia ennenaikaisessa takaisinmaksussa säästääksesi pitkän aikavälin kustannuksissa.",
  "recommendations.highestRate": "Korkein korkoprosentti",
  "recommendations.highestRateText": "omaa korkeimman korkokannan. Keskity tähän saadaksesi välittömiä säästöjä kuukausittaisissa korkokuluissa.",
  "recommendations.highestRateTextPlural": "omaavat korkeimman korkokannan. Keskity näihin saadaksesi välittömiä säästöjä kuukausittaisissa korkokuluissa.",
  
  // Toasts
  "toast.loanAdded": "Laina lisätty",
  "toast.loanAddedDesc": "{name} on lisätty lainoihisi",
  "toast.loanDeactivated": "Laina deaktivoitu",
  "toast.loanActivated": "Laina aktivoitu",
  "toast.loanToggleDesc": "{name} on {state} aktiivisista lainoista",
  "toast.removedFrom": "poistettu",
  "toast.addedTo": "lisätty",
  
  // Validation
  "validation.nameRequired": "Lainan nimi vaaditaan",
  "validation.nameRequiredDesc": "Ole hyvä ja syötä nimi lainalle",
  "validation.invalidAmount": "Virheellinen lainan määrä",
  "validation.invalidAmountDesc": "Ole hyvä ja syötä positiivinen numero lainan määrälle",
  "validation.invalidRate": "Virheellinen korkoprosentti",
  "validation.invalidRateDesc": "Ole hyvä ja syötä positiivinen numero korkoprosentille",
  "validation.invalidTerm": "Virheellinen laina-aika",
  "validation.invalidTermDesc": "Ole hyvä ja syötä positiivinen numero laina-ajalle vuosissa",
  
  // Language
  "language.en": "Englanti",
  "language.fi": "Suomi",
  
  // Tabs
  "tabs.loans": "Lainat",
  "tabs.creditCards": "Luottokortit",
  
  // Credit Card Section
  "creditCard.title": "Lisää uusi luottokortti",
  "creditCard.name": "Kortin nimi",
  "creditCard.name.placeholder": "esim. Visa Platinum, Mastercard Gold",
  "creditCard.balance": "Nykyinen saldo (€)",
  "creditCard.balance.placeholder": "esim. 1500",
  "creditCard.limit": "Luottoraja (€)",
  "creditCard.limit.placeholder": "esim. 5000",
  "creditCard.apr": "Vuosikorko (APR %)",
  "creditCard.apr.placeholder": "esim. 19.99",
  "creditCard.minPayment": "Vähimmäismaksu (€)",
  "creditCard.minPayment.placeholder": "esim. 50",
  "creditCard.minPaymentPercent": "tai Vähimmäismaksu (%)",
  "creditCard.minPaymentPercent.placeholder": "esim. 3",
  "creditCard.fullPayment": "Maksa saldo kokonaan",
  "creditCard.addButton": "Lisää luottokortti",
  
  // Credit Card Table
  "creditCard.table.name": "Kortin nimi",
  "creditCard.table.balance": "Saldo",
  "creditCard.table.limit": "Luottoraja",
  "creditCard.table.apr": "Vuosikorko",
  "creditCard.table.minPayment": "Vähimmäismaksu",
  "creditCard.table.monthlyInterest": "Kuukausikorko",
  "creditCard.table.payoffTime": "Maksuaika",
  "creditCard.table.totalInterest": "Kokonaiskorko",
  "creditCard.table.utilization": "Käyttöaste",
  "creditCard.table.active": "Aktiivinen",
  "creditCard.table.noCards": "Ei lisättyjä luottokortteja. Lisää ensimmäinen kortti yllä olevalla lomakkeella.",
  
  // Credit Card Summary
  "creditCard.summary.totalBalance": "Luottokorttien kokonaissaldo",
  "creditCard.summary.totalLimit": "Luottokorttien kokonaisluottoraja",
  "creditCard.summary.totalUtilization": "Kokonaiskäyttöaste",
  "creditCard.summary.totalMinPayment": "Vähimmäismaksut yhteensä",
  "creditCard.summary.totalInterest": "Kuukausikorot yhteensä",
};
