
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { enTranslations } from '@/translations/en';
import { fiTranslations } from '@/translations/fi';

type Translations = {
  [key: string]: string;
};

type LanguageContextType = {
  language: 'en' | 'fi';
  translations: Translations;
  setLanguage: (language: 'en' | 'fi') => void;
  t: (key: string) => string;
};

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
