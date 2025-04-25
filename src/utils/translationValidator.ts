
import { en, fi } from '@/translations';

export function checkMissingTranslations() {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

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
  
  // Find placeholder text (keys containing 'title' or 'subtitle' that match their values)
  const potentialPlaceholders = Object.entries(flatEn).filter(([key, value]) => 
    (key.toLowerCase().includes('title') || key.toLowerCase().includes('subtitle')) &&
    key === value
  );
  
  // Log missing translations
  if (missingInFi.length > 0) {
    console.warn(`Missing Finnish translations (${missingInFi.length} keys):`, missingInFi);
  }
  
  if (missingInEn.length > 0) {
    console.warn(`Missing English translations (${missingInEn.length} keys):`, missingInEn);
  }
  
  if (potentialPlaceholders.length > 0) {
    console.warn('Potential placeholder text found:', potentialPlaceholders);
  }
  
  // Log overall status
  if (missingInFi.length === 0 && missingInEn.length === 0 && potentialPlaceholders.length === 0) {
    console.info('All translations are in sync!');
  } else {
    console.warn(`Translation check complete. Found ${missingInFi.length + missingInEn.length} missing keys and ${potentialPlaceholders.length} potential placeholders.`);
  }

  return {
    missingInFi,
    missingInEn,
    potentialPlaceholders,
    complete: missingInFi.length === 0 && missingInEn.length === 0 && potentialPlaceholders.length === 0
  };
}
