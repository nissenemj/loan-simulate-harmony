
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { en } from '@/translations/en';
import { fi } from '@/translations/fi';

type Translations = {
  [key: string]: string | any;
};

type LanguageContextType = {
  language: 'en' | 'fi';
  locale: string;
  translations: Translations;
  setLanguage: (language: 'en' | 'fi') => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

// Convert the nested translations object into a flat structure for easier lookup
const flattenTranslations = (obj: any, prefix = ''): Translations => {
  return Object.keys(obj).reduce((acc: Translations, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
};

// Precompute flattened translations
const enTranslations = flattenTranslations(en);
const fiTranslations = flattenTranslations(fi);

// For debugging, check translation counts and specific keys for repayment section
console.log('Translation keys loaded:', {
  english: Object.keys(enTranslations).length,
  finnish: Object.keys(fiTranslations).length,
  repaymentKeysEn: Object.keys(enTranslations).filter(k => k.startsWith('repayment.')),
  repaymentKeysFi: Object.keys(fiTranslations).filter(k => k.startsWith('repayment.')),
});

// Check for missing keys by comparing English to Finnish
const missingFinnishKeys = Object.keys(enTranslations).filter(key => !fiTranslations[key]);
if (missingFinnishKeys.length > 0) {
  console.warn('Missing Finnish translations for keys:', missingFinnishKeys);
}

// Check for repayment keys required by our components
const requiredRepaymentKeys = [
  'repayment.avalancheStrategy', 
  'repayment.snowballStrategy',
  'repayment.debtFreeIn',
  'repayment.months',
  'repayment.projectDate',
  'repayment.fastestWithAvalanche',
  'repayment.fastestWithSnowball',
  'repayment.monthsFaster',
  'repayment.monthsSlower',
  'repayment.totalInterestPaid',
  'repayment.interestSaved',
  'repayment.creditCardsFree',
  'repayment.monthsUntilCreditCardFree',
  'repayment.avalancheDesc',
  'repayment.snowballDesc'
];

for (const key of requiredRepaymentKeys) {
  if (!enTranslations[key]) {
    console.error(`Missing English translation for key: ${key}`);
  }
  if (!fiTranslations[key]) {
    console.error(`Missing Finnish translation for key: ${key}`);
  }
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fi',
  locale: 'fi-FI',
  translations: fiTranslations,
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Default to Finnish if there's no stored preference
  const [language, setLanguage] = useState<'en' | 'fi'>('fi');
  const [translations, setTranslations] = useState<Translations>(fiTranslations);
  const [locale, setLocale] = useState('fi-FI');
  
  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fi';
    if (savedLanguage) {
      handleSetLanguage(savedLanguage);
    }
  }, []);
    
  const handleSetLanguage = (lang: 'en' | 'fi') => {
    setLanguage(lang);
    setTranslations(lang === 'en' ? enTranslations : fiTranslations);
    setLocale(lang === 'en' ? 'en-US' : 'fi-FI');
    localStorage.setItem('language', lang);
    
    // Debug log to help troubleshooting
    console.log(`Language changed to ${lang}`, { 
      translationsSize: Object.keys(lang === 'en' ? enTranslations : fiTranslations).length,
      repaymentKeysAvailable: Object.keys(lang === 'en' ? enTranslations : fiTranslations)
        .filter(k => k.startsWith('repayment.')).length
    });
  };
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations[key]) {
      console.warn(`Translation key missing: ${key}`);
      // Return only the last part of the key for a more user-friendly fallback
      const parts = key.split('.');
      return parts[parts.length - 1];
    }
    
    let translation = translations[key];
    
    // If we have parameters, replace them in the translation string
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return translation || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, locale, translations, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Add the missing export for useTranslation as an alias for useLanguage
export const useTranslation = useLanguage;
