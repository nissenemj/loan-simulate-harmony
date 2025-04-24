
import { en, fi } from '@/translations';

// This function will check for missing translations between English and Finnish
export function checkMissingTranslations() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Function to flatten nested translation objects
  const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
    return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], prefixedKey));
      } else {
        acc[prefixedKey] = obj[key];
      }
      
      return acc;
    }, {});
  };

  const flatEn = flattenObject(en);
  const flatFi = flattenObject(fi);
  
  // Find keys in English but not in Finnish
  const missingInFi = Object.keys(flatEn).filter(key => !(key in flatFi));
  
  // Find keys in Finnish but not in English
  const missingInEn = Object.keys(flatFi).filter(key => !(key in flatEn));
  
  // Log missing translations
  if (missingInFi.length > 0) {
    console.warn(`Missing Finnish translations (${missingInFi.length} keys):`, missingInFi);
  }
  
  if (missingInEn.length > 0) {
    console.warn(`Missing English translations (${missingInEn.length} keys):`, missingInEn);
  }
  
  // Log overall status
  if (missingInFi.length === 0 && missingInEn.length === 0) {
    console.info('All translations are in sync!');
  } else {
    console.warn(`Translation check complete. Found ${missingInFi.length + missingInEn.length} missing keys.`);
  }

  return {
    missingInFi,
    missingInEn,
    complete: missingInFi.length === 0 && missingInEn.length === 0
  };
}
