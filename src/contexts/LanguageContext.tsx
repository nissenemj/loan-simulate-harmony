
import React, { createContext, useContext, ReactNode } from "react";

type LanguageContextType = {
  language: "fi";
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
};

// Suomenkieliset käännökset - kaikki avaimet korvattu suorilla teksteillä
const translations: Record<string, string> = {
  // Navigaatio
  "app.name": "Velkavapaus",
  "navigation.home": "Etusivu",
  "navigation.calculator": "Laskuri",
  "navigation.strategies": "Velkastrategiat",
  "navigation.blog": "Blogi",
  "navigation.contact": "Yhteystiedot",
  "navigation.about": "Tietoa",
  "navigation.dashboard": "Hallintapaneeli",
  "navigation.settings": "Asetukset",
  
  // Autentikointi
  "auth.login": "Kirjaudu sisään",
  "auth.logout": "Kirjaudu ulos",
  "auth.dashboard": "Hallintapaneeli",
  
  // Dashboard - velkayhteenveto
  "dashboard.title": "Hallintapaneeli",
  "dashboard.welcome": "Tervetuloa",
  "dashboard.welcomeSubtitle": "Hallitse velkojasi ja seuraa edistymistäsi",
  "dashboard.guest": "vieras",
  "dashboard.totalDebt": "Kokonaisvelka",
  "dashboard.estimatedDebtFreeDate": "Arvioitu velattomuuspäivä",
  "dashboard.minimumMonthlyPayments": "Kuukausittaiset vähimmäismaksut",
  "dashboard.estimatedInterestCost": "Arvioitu korkokulut",
  "dashboard.totalToPayOff": "Yhteensä maksettava",
  "dashboard.perMonth": "kuukaudessa",
  "dashboard.notCalculated": "Ei laskettu",
  "dashboard.viewDetailedBreakdown": "Näytä yksityiskohtainen erittely",
  
  // Visualisoinnit
  "visualization.debtBreakdown": "Velkojen erittely",
  "visualization.distributionDescription": "Kuinka velkasi jakautuvat",
  "visualization.totalDebt": "Kokonaisvelka",
  "visualization.totalInterestPaid": "Maksetut korot yhteensä",
  "visualization.principalPayment": "Pääoman takaisinmaksu",
  "visualization.noDebtsToVisualize": "Ei velkoja visualisoitavaksi",
  
  // Tooltips
  "tooltips.totalDebt": "Kaikkien velkojesi yhteenlaskettu määrä",
  "tooltips.debtFreeDate": "Arvioitu päivämäärä, jolloin kaikki velat on maksettu",
  "tooltips.minimumPayments": "Kaikkien velkojesi vähimmäismaksujen summa kuukaudessa",
  "tooltips.interestCost": "Arvioitu kokonaismäärä korkoja, jotka maksat velkojen takaisinmaksun aikana",
  "tooltips.totalToPayOff": "Kokonaissumma, jonka maksat velkojen ja korkojen takaisinmaksuun",
  
  // Dashboard
  "dashboard.debtBreakdown": "Velkojen erittely",
  "dashboard.allDebts": "Kaikki velat",
  "dashboard.loans": "Lainat",
  "dashboard.creditCards": "Luottokortit",
  "dashboard.paymentPlanSummary": "Maksusuunnitelman yhteenveto",
  "dashboard.paymentPlanDescription": "Kuukausittainen budjettisi ja maksustrategiasi",
  "dashboard.monthlyBudget": "Kuukausittainen budjetti",
  "dashboard.minimumPayments": "Vähimmäismaksut",
  "dashboard.extraBudget": "Lisäbudjetti",
  "dashboard.prioritizedDebt": "Priorisoitu velka",
  "dashboard.interestRate": "korkoprosentti",
  "dashboard.viewFullPlan": "Näytä koko suunnitelma",
  "dashboard.financialTips": "Talousvinkit",
  "dashboard.tip1": "Maksa aina vähintään vähimmäismaksut kaikista veloista",
  "dashboard.tip2": "Keskity korkeimman koron velkojen maksamiseen ensin",
  "dashboard.tip3": "Luo kuukausittainen budjetti ja noudata sitä",
  "dashboard.viewGlossary": "Näytä sanasto",
  "dashboard.exportData": "Vie tiedot",
  "dashboard.dataExported": "Tiedot viety onnistuneesti",
  "dashboard.saveStrategy": "Tallenna strategia",
  "dashboard.saveStrategyTooltip": "Tallenna nykyinen takaisinmaksustrategia",
  "dashboard.compareScenarios": "Vertaa skenaarioita",
  "dashboard.compareScenariosTooltip": "Vertaa erilaisia takaisinmaksuskenaarioita",
  "dashboard.viewDebtSummary": "Näytä velkayhteenveto",
  "dashboard.saveStrategyDescription": "Anna strategialle nimi ja valitse takaisinmaksutapa",
  "dashboard.strategyName": "Strategian nimi",
  "dashboard.strategyNamePlaceholder": "Esim. Aggressiivinen takaisinmaksu",
  "dashboard.method": "Menetelmä",
  "dashboard.avalancheStrategy": "Lumivyöry",
  "dashboard.snowballStrategy": "Lumipallo",
  "dashboard.equalStrategy": "Tasainen",
  "dashboard.save": "Tallenna",
  "dashboard.strategySaved": "Strategia tallennettu onnistuneesti",
  
  // Laskuri
  "calculator.months": "kuukautta",
  "calculator.enterDebts": "Syötä velkasi",
  "calculator.debtName": "Velan nimi",
  "calculator.balance": "Saldo",
  "calculator.interestRate": "Korkoprosentti",
  "calculator.minimumPayment": "Vähimmäismaksu",
  "calculator.addDebt": "Lisää velka",
  "calculator.removeDebt": "Poista velka",
  "calculator.monthlyBudget": "Kuukausittainen budjetti",
  "calculator.calculate": "Laske",
  "calculator.calculating": "Lasketaan...",
  "calculator.results": "Tulokset",
  "calculator.payoffTime": "Takaisinmaksuaika",
  "calculator.totalInterest": "Korot yhteensä",
  "calculator.totalPaid": "Maksettu yhteensä",
  "calculator.strategy": "Strategia",
  
  // Velkastrategiat
  "debtStrategies.pageTitle": "Velkastrategiat",
  "debtStrategies.pageDescription": "Vertaa eri takaisinmaksustrategioita ja löydä sinulle paras tapa päästä eroon veloista",
  "debtStrategies.calculatorTab": "Laskuri",
  "debtStrategies.timelineTab": "Aikajana",
  "debtStrategies.extraPaymentTab": "Lisämaksut",
  "debtStrategies.consolidationTab": "Yhdistäminen",
  "debtStrategies.noDebtAlert": "Lisää ensin velkoja laskurissa aloittaaksesi takaisinmaksusuunnitelman.",
  "debtStrategies.calculateFirst": "Laske ensin takaisinmaksusuunnitelma Laskuri-välilehdellä nähdäksesi aikajanar.",
  "debtStrategies.errorMaxMonths": "Takaisinmaksu kestäisi liian kauan nykyisellä budjetilla. Kokeile suurempaa kuukausittaista budjettia.",
  "debtStrategies.errorInCalculation": "Virhe laskennassa. Tarkista syöttötiedot.",
  
  // Takaisinmaksustrategiat
  "repayment.chooseStrategy": "Valitse takaisinmaksustrategia",
  "repayment.avalancheMethod": "Lumivyörystrategia",
  "repayment.avalancheDescription": "Maksa ensin korkoimmat velat - säästää rahaa pitkällä aikavälillä",
  "repayment.avalancheBenefit1": "Vähemmän korkoja yhteensä",
  "repayment.avalancheBenefit2": "Tehokkain tapa säästää rahaa",
  "repayment.snowballMethod": "Lumipallostrategia", 
  "repayment.snowballDescription": "Maksa ensin pienimmät velat - lisää motivaatiota nopeilla voitoilla",
  "repayment.snowballBenefit1": "Nopeat voitot lisäävät motivaatiota",
  "repayment.snowballBenefit2": "Helpompi pysyä mukana",
  "repayment.benefits": "Edut",
  
  // Ohjaus ja vinkit
  "guidance.progress.currentStep": "Nykyinen vaihe",
  "guidance.progress.step1": "Syötä velkasi",
  "guidance.progress.step2": "Valitse strategia ja budjetti",
  "guidance.progress.step3": "Tarkista tulokset",
  "guidance.exampleData.clearAndEnterOwn": "Voit tyhjentää kentät ja syöttää omat tietosi tai kokeilla esimerkkitiedoilla:",
  "guidance.exampleData.fillWithExample": "Täytä esimerkkitiedoilla",
  "guidance.resultsGuide.howToRead": "Miten lukea tuloksia",
  "guidance.resultsGuide.totalInterest": "Korot yhteensä - kuinka paljon maksat korkoja kaiken kaikkiaan",
  "guidance.resultsGuide.payoffDate": "Takaisinmaksuaika - kuinka kauan kestää päästä veloista eroon",
  "guidance.resultsGuide.totalPaid": "Maksettu yhteensä - kokonaissumma pääoma + korot",
  "guidance.resultsGuide.monthlyPayment": "Kuukausimaksu - paljonko maksat kuukaudessa yhteensä",
  
  // Yleiset
  "common.cancel": "Peruuta",
  "common.close": "Sulje",
  "common.save": "Tallenna",
  "common.edit": "Muokkaa",
  "common.delete": "Poista",
  "common.confirm": "Vahvista",
  "common.yes": "Kyllä",
  "common.no": "Ei",
  "common.loading": "Ladataan...",
  "common.error": "Virhe",
  "common.success": "Onnistui",
  
  // Virheet
  "errors.nameRequired": "Nimi on pakollinen",
  "errors.saveFailed": "Tallentaminen epäonnistui",
  "errors.invalidInput": "Virheellinen syöte",
  "errors.required": "Pakollinen kenttä",
  "errors.positiveNumber": "Syötä positiivinen luku",
  
  // Ohjeet
  "help.helpCenter": "Ohjekeskus",
  "help.readGuides": "Lue oppaat",
  "help.contactSupport": "Ota yhteyttä tukeen",
  "help.faq": "Usein kysytyt kysymykset",
  "help.calculatorGuide": "Laskurin opas",
  "help.watchDemo": "Katso demo",
  "help.dashboardTips": "Hallintapaneelin vinkit"
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fi",
  locale: "fi-FI",
  t: () => "",
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[key] || key;
    
    // Korvaa parametrit tekstissä
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language: "fi",
        locale: "fi-FI", 
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = useLanguage;
