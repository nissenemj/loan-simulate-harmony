
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en } from '@/translations/en';
import { fi } from '@/translations/fi';

type Translations = {
  [key: string]: string | any;
};

type LanguageContextType = {
  language: 'en' | 'fi';
  translations: Translations;
  setLanguage: (language: 'en' | 'fi') => void;
  t: (key: string) => string;
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

const enTranslations = flattenTranslations(en);
const fiTranslations = flattenTranslations(fi);

const LanguageContext = createContext<LanguageContextType>({
  language: 'fi',
  translations: fiTranslations,
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'fi'>('fi');
  const [translations, setTranslations] = useState<Translations>(fiTranslations);
  
  const handleSetLanguage = (lang: 'en' | 'fi') => {
    setLanguage(lang);
    setTranslations(lang === 'en' ? enTranslations : fiTranslations);
  };
  
const t = (key: string): string => {
  if (!translations[key]) {
    console.warn(`Translation key missing: ${key}`);
  }
  return translations[key] || key;
};
  
  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Add the missing export for useTranslation as an alias for useLanguage
export const useTranslation = useLanguage;
