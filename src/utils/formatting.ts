
import { useTranslation } from '@/contexts/LanguageContext';

export interface CurrencyFormatOptions {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export function useCurrencyFormatter(options: CurrencyFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    showSymbol: true,
    ...options
  };
  
  return {
    format: (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: defaultOptions.currency,
        minimumFractionDigits: defaultOptions.minimumFractionDigits,
        maximumFractionDigits: defaultOptions.maximumFractionDigits
      }).format(value);
    },
    formatWithoutSymbol: (value: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: defaultOptions.minimumFractionDigits,
        maximumFractionDigits: defaultOptions.maximumFractionDigits
      }).format(value);
    }
  };
}

export function usePercentageFormatter(options: { 
  minimumFractionDigits?: number; 
  maximumFractionDigits?: number;
} = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  };
  
  return (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    }).format(value / 100); // Convert from percentage to decimal
  };
}

export function useDateFormatter(options: Intl.DateTimeFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  };
}
