import { en, fi } from '@/translations';

/**
 * Flattens a nested object structure into a flat object with dot-notation keys
 * @param obj The object to flatten
 * @param prefix The prefix to use for keys
 * @returns A flattened object
 */
export const flattenTranslations = (obj: any, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
};

/**
 * Checks for missing translations between English and Finnish
 * @returns An object containing missing translations in both languages
 */
export const checkMissingTranslations = () => {
  const enFlat = flattenTranslations(en);
  const fiFlat = flattenTranslations(fi);
  
  const allKeys = new Set([...Object.keys(enFlat), ...Object.keys(fiFlat)]);
  
  const missingInFi = Array.from(allKeys).filter(key => !fiFlat[key] && enFlat[key]);
  const missingInEn = Array.from(allKeys).filter(key => !enFlat[key] && fiFlat[key]);
  
  return {
    missingInFi,
    missingInEn,
    totalKeys: allKeys.size,
    enKeysCount: Object.keys(enFlat).length,
    fiKeysCount: Object.keys(fiFlat).length,
    completionPercentage: {
      en: (Object.keys(enFlat).length / allKeys.size) * 100,
      fi: (Object.keys(fiFlat).length / allKeys.size) * 100
    }
  };
};

/**
 * Checks if a specific translation key exists in both languages
 * @param key The translation key to check
 * @returns An object indicating if the key exists in each language
 */
export const checkTranslationKey = (key: string) => {
  const enFlat = flattenTranslations(en);
  const fiFlat = flattenTranslations(fi);
  
  return {
    existsInEn: !!enFlat[key],
    existsInFi: !!fiFlat[key],
    enValue: enFlat[key],
    fiValue: fiFlat[key]
  };
};

/**
 * Logs translation statistics to the console
 * Useful for development debugging
 */
export const logTranslationStats = () => {
  const stats = checkMissingTranslations();
  
  console.group('Translation Statistics');
  console.log(`Total unique keys: ${stats.totalKeys}`);
  console.log(`English keys: ${stats.enKeysCount} (${stats.completionPercentage.en.toFixed(2)}%)`);
  console.log(`Finnish keys: ${stats.fiKeysCount} (${stats.completionPercentage.fi.toFixed(2)}%)`);
  
  if (stats.missingInFi.length > 0) {
    console.group('Missing in Finnish');
    stats.missingInFi.forEach(key => console.log(`- ${key}`));
    console.groupEnd();
  }
  
  if (stats.missingInEn.length > 0) {
    console.group('Missing in English');
    stats.missingInEn.forEach(key => console.log(`- ${key}`));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return stats;
};

// Export a default function for easy importing
export default checkMissingTranslations;
