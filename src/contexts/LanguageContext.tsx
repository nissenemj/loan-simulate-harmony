import React, { createContext, useContext, ReactNode } from "react";

type LanguageContextType = {
  language: "fi";
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
};

// Suomenkieliset käännökset
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
  
  // Yleiset
  "common.cancel": "Peruuta",
  "common.close": "Sulje",
  "common.save": "Tallenna",
  "common.edit": "Muokkaa",
  "common.delete": "Poista",
  "common.confirm": "Vahvista",
  
  // Virheet
  "errors.nameRequired": "Nimi on pakollinen",
  "errors.saveFailed": "Tallentaminen epäonnistui",
  
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
