
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { en, TranslationsType } from '@/translations/en';
import { fi } from '@/translations/fi';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Translations = {
  [key: string]: string | any;
};

type LanguageContextType = {
  language: 'en' | 'fi';
  locale: string;
  translations: Translations;
  setLanguage: (language: 'en' | 'fi') => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isKeyMissing: (key: string) => boolean;
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

// For debugging, check translation counts and specific keys
console.log('Translation keys loaded:', {
  english: Object.keys(enTranslations).length,
  finnish: Object.keys(fiTranslations).length,
});

// Check for missing translations in either language
const allKeys = new Set([...Object.keys(enTranslations), ...Object.keys(fiTranslations)]);
const missingInFi = Array.from(allKeys).filter(key => !fiTranslations[key] && enTranslations[key]);
const missingInEn = Array.from(allKeys).filter(key => !enTranslations[key] && fiTranslations[key]);

if (missingInFi.length > 0) {
  console.warn('Missing Finnish translations for keys:', missingInFi);
}

if (missingInEn.length > 0) {
  console.warn('Missing English translations for keys:', missingInEn);
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fi',
  locale: 'fi-FI',
  translations: fiTranslations,
  setLanguage: () => {},
  t: () => '',
  isKeyMissing: () => false,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Use local storage hook instead of direct localStorage access
  const [savedLanguage, setSavedLanguage] = useLocalStorage<'en' | 'fi'>('language', 'fi');
  const [language, setLanguage] = useState<'en' | 'fi'>(savedLanguage);
  const [translations, setTranslations] = useState<Translations>(
    language === 'en' ? enTranslations : fiTranslations
  );
  const [locale, setLocale] = useState(language === 'en' ? 'en-US' : 'fi-FI');
  
  useEffect(() => {
    // Set initial language from localStorage
    handleSetLanguage(savedLanguage);
  }, [savedLanguage]);
    
  const handleSetLanguage = (lang: 'en' | 'fi') => {
    setLanguage(lang);
    
    // Use the appropriate flattened translations
    const translationsToUse = lang === 'en' ? enTranslations : fiTranslations;
    setTranslations(translationsToUse);
    setLocale(lang === 'en' ? 'en-US' : 'fi-FI');
    setSavedLanguage(lang);
    
    // Debug log to help troubleshooting
    console.log(`Language changed to ${lang}`, { 
      translationsSize: Object.keys(translationsToUse).length,
      sampleTranslations: {
        homeKey: translationsToUse['landing.hero.headline'],
        loansKey: translationsToUse['tabs.loans'],
        creditCardsKey: translationsToUse['tabs.creditCards'],
        dashboardKey: translationsToUse['tabs.dashboard']
      }
    });
  };
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[key];
    
    if (translation === undefined) {
      console.warn(`Translation key missing: ${key}`);
      // Return only the last part of the key for a more user-friendly fallback
      const parts = key.split('.');
      return parts[parts.length - 1];
    }
    
    // If we have parameters, replace them in the translation string
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  // Helper function to check if a key is missing from translations
  const isKeyMissing = (key: string): boolean => {
    return translations[key] === undefined;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      locale, 
      translations, 
      setLanguage: handleSetLanguage, 
      t,
      isKeyMissing
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Add the missing export for useTranslation as an alias for useLanguage
export const useTranslation = useLanguage;
