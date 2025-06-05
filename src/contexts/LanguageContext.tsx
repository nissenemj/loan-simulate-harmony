
import React, { createContext, useContext } from 'react';

const translations: Record<string, string> = {
  'visualization.strategyComparison': 'Strategiavertailu',
  'visualization.strategyComparisonDescription': 'Vertaa takaisinmaksustrategioiden kestoa ja korkokuluja',
  'calculator.debt': 'Velka',
  'calculator.balance': 'Saldo',
  'calculator.interestRate': 'Korkoprosentti',
  'calculator.minimumPayment': 'Vähimmäismaksu',
  'calculator.monthlyBudget': 'Kuukausittainen budjetti',
  'calculator.strategy': 'Strategia',
  'calculator.calculate': 'Laske',
  'strategy.avalanche': 'Lumivyöry',
  'strategy.snowball': 'Lumipallo',
  'strategy.custom': 'Mukautettu',
  'results.totalMonths': 'Kuukausia yhteensä',
  'results.totalInterest': 'Korot yhteensä',
  'results.totalPaid': 'Maksettu yhteensä',
  'payment.principal': 'Pääoma',
  'payment.interest': 'Korko',
  'payment.breakdown': 'Maksujen erittely',
  'chart.monthly': 'Kuukausittain',
  'chart.cumulative': 'Kumulatiivinen',
  'error.noData': 'Ei dataa saatavilla',
  'consolidation.title': 'Velkojen yhdistäminen',
  'consolidation.description': 'Laske velkojen yhdistämisen vaikutus',
  'extraPayment.title': 'Lisämaksut',
  'extraPayment.description': 'Näe lisämaksujen vaikutus velkoihin'
};

const LanguageContext = createContext({ 
  t: (k: string) => translations[k] ?? k, 
  language: 'fi' as const 
});

export const useTranslation = () => useContext(LanguageContext);
export const useLanguage = useTranslation;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageContext.Provider value={{ t: k => translations[k] ?? k, language: 'fi' }}>
      {children}
    </LanguageContext.Provider>
  );
}
