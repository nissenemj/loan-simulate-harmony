
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import { en, fi } from "@/translations";
import {
	flattenTranslations,
	logTranslationStats,
} from "@/utils/languageConsistencyCheck";

type Translations = {
	[key: string]: string | any;
};

type LanguageContextType = {
	language: "en" | "fi";
	locale: string;
	translations: Translations;
	setLanguage: (language: "en" | "fi") => void;
	t: (key: string, params?: Record<string, string | number>) => string;
};

// Precompute flattened translations
const enTranslations = flattenTranslations(en);
const fiTranslations = flattenTranslations(fi);

// Run translation validation in development
if (process.env.NODE_ENV === "development") {
	// Log translation statistics to help identify missing translations
	logTranslationStats();
}

const LanguageContext = createContext<LanguageContextType>({
	language: "fi",
	locale: "fi-FI",
	translations: fiTranslations,
	setLanguage: () => {},
	t: () => "",
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	// Aseta suomi oletuskieleksi pysyvästi
	const [language] = useState<"en" | "fi">("fi");
	const [translations] = useState<Translations>(fiTranslations);
	const [locale] = useState("fi-FI");

	useEffect(() => {
		// Aseta document kieli suomeksi
		document.documentElement.lang = "fi";
	}, []);

	// Poistettu kielenvaihtofunktionaliteetti - käytetään vain suomea
	const handleSetLanguage = () => {
		// Ei mitään - kieli pysyy aina suomena
	};

	const t = (key: string, params?: Record<string, string | number>): string => {
		let translation = fiTranslations[key];

		if (translation === undefined) {
			console.warn(`Translation key missing: ${key}`);
			// Return only the last part of the key for a more user-friendly fallback
			const parts = key.split(".");
			return parts[parts.length - 1];
		}

		// If we have parameters, replace them in the translation string
		if (params && typeof translation === "string") {
			Object.entries(params).forEach(([paramKey, paramValue]) => {
				translation = translation.replace(
					new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"),
					String(paramValue)
				);
				// Also support the {name} format
				translation = translation.replace(
					new RegExp(`\\{${paramKey}\\}`, "g"),
					String(paramValue)
				);
			});
		}

		return translation;
	};

	return (
		<LanguageContext.Provider
			value={{
				language,
				locale,
				translations,
				setLanguage: handleSetLanguage,
				t,
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);

// Add the export for useTranslation as an alias for useLanguage
export const useTranslation = useLanguage;
