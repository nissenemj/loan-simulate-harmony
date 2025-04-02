
import { useTranslation } from '@/contexts/LanguageContext';

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Hook to get a currency formatter function based on the current locale
 */
export function useCurrencyFormatter(options: CurrencyFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  const format = (value: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: defaultOptions.currency,
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    }).format(value);
  };
  
  const formatWithoutSymbol = (value: number): string => {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    }).format(value);
    
    return formatted;
  };
  
  return { format, formatWithoutSymbol };
}

/**
 * Hook to get a percentage formatter function based on the current locale
 */
export function usePercentFormatter(options: Omit<CurrencyFormatOptions, 'currency'> = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options
  };
  
  return (value: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    }).format(value / 100); // Convert from percentage value to decimal
  };
}
