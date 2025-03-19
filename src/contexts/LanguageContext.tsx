
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en as enTranslationsObject } from '@/translations/en';
import { fi as fiTranslationsObject } from '@/translations/fi';

type Translations = {
  [key: string]: string;
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

const enTranslations = flattenTranslations(enTranslationsObject);
const fiTranslations = flattenTranslations(fiTranslationsObject);

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: enTranslations,
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'fi'>('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);
  
  const handleSetLanguage = (lang: 'en' | 'fi') => {
    setLanguage(lang);
    setTranslations(lang === 'en' ? enTranslations : fiTranslations);
  };
  
  const t = (key: string): string => {
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
