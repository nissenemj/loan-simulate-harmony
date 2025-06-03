
import React, { createContext, useContext, ReactNode } from "react";

type LanguageContextType = {
  language: "fi";
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fi",
  locale: "fi-FI",
  t: () => "",
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Yksinkertainen merkkijono-palaute - ei käännöksiä
    return key;
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
