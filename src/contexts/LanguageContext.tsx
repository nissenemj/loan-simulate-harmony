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

// We're now using the flattenTranslations function from languageConsistencyCheck.ts

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
	// Default to Finnish if there's no stored preference
	const [language, setLanguage] = useState<"en" | "fi">("fi");
	const [translations, setTranslations] =
		useState<Translations>(fiTranslations);
	const [locale, setLocale] = useState("fi-FI");

	useEffect(() => {
		// Check for saved language preference
		const savedLanguage = localStorage.getItem("language") as "en" | "fi";
		if (savedLanguage) {
			handleSetLanguage(savedLanguage);
		}
	}, []);

	const handleSetLanguage = (lang: "en" | "fi") => {
		setLanguage(lang);

		// Use the appropriate flattened translations
		const translationsToUse = lang === "en" ? enTranslations : fiTranslations;
		setTranslations(translationsToUse);
		setLocale(lang === "en" ? "en-US" : "fi-FI");
		localStorage.setItem("language", lang);

		// Update document language for accessibility
		document.documentElement.lang = lang;

		// Debug log to help troubleshooting
		console.log(`Language changed to ${lang}`, {
			translationsSize: Object.keys(translationsToUse).length,
		});
	};

	const t = (key: string, params?: Record<string, string | number>): string => {
		let translation = translations[key];

		if (translation === undefined) {
			// Fallback to English if Finnish translation is missing
			if (language === "fi" && enTranslations[key]) {
				translation = enTranslations[key];
				console.warn(
					`Missing Finnish translation for key: ${key}, using English fallback`
				);
			} else {
				console.warn(`Translation key missing: ${key}`);
				// Return only the last part of the key for a more user-friendly fallback
				const parts = key.split(".");
				return parts[parts.length - 1];
			}
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
