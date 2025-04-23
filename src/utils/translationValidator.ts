
import { en, fi } from '@/translations';

/**
 * Validates translations by comparing keys between English and Finnish translations
 * @param enObj English translation object
 * @param fiObj Finnish translation object
 * @param path Current path in the object (for nested objects)
 * @returns Array of missing translation keys
 */
export function validateTranslations(
  enObj: Record<string, any>, 
  fiObj: Record<string, any>, 
  path = ''
): string[] {
  const missingKeys: string[] = [];
  
  // Check for keys in English that are missing in Finnish
  Object.keys(enObj).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      // If the key doesn't exist or isn't an object in Finnish, mark the entire object as missing
      if (!fiObj[key] || typeof fiObj[key] !== 'object') {
        missingKeys.push(`${currentPath} (entire object missing in Finnish)`);
      } else {
        // Recursively check nested objects
        missingKeys.push(...validateTranslations(enObj[key], fiObj[key], currentPath));
      }
    } else if (fiObj[key] === undefined) {
      // Check if primitive value exists in Finnish translations
      missingKeys.push(`${currentPath} (missing in Finnish)`);
    }
  });
  
  // Check for keys in Finnish that are missing in English
  Object.keys(fiObj).forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof fiObj[key] === 'object' && fiObj[key] !== null && !Array.isArray(fiObj[key])) {
      // Skip if already checked from the English side
      if (!enObj[key] || typeof enObj[key] !== 'object') {
        missingKeys.push(`${currentPath} (entire object missing in English)`);
      }
    } else if (enObj[key] === undefined) {
      // Check if primitive value exists in English translations
      missingKeys.push(`${currentPath} (missing in English)`);
    }
  });
  
  return missingKeys;
}

/**
 * Run validation in development environment
 */
export function checkMissingTranslations(): void {
  if (process.env.NODE_ENV === 'development') {
    const missingTranslations = validateTranslations(en, fi);
    
    if (missingTranslations.length > 0) {
      console.warn('⚠️ Missing translations detected:', missingTranslations.length);
      console.group('Missing Translation Keys:');
      missingTranslations.forEach(key => console.warn(`- ${key}`));
      console.groupEnd();
    } else {
      console.info('✅ All translations complete!');
    }
  }
}
