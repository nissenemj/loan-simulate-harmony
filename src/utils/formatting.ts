
import { useTranslation } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export interface CurrencyFormatOptions {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  displayCurrencySymbol?: boolean;
}

/**
 * Hook to create a currency formatter based on the current locale
 */
export function useCurrencyFormatter(options: CurrencyFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions = {
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    displayCurrencySymbol: true,
    ...options
  };
  
  return useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: defaultOptions.displayCurrencySymbol ? 'currency' : 'decimal',
      currency: defaultOptions.currency,
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    });
    
    return {
      format: (value: number) => formatter.format(value),
      formatWithoutSymbol: (value: number) => formatter.format(value).replace(/[^\d.,]/g, '')
    };
  }, [locale, defaultOptions]);
}

/**
 * Format a date based on the current locale
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const dateToFormat = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateToFormat);
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number, options: Intl.NumberFormatOptions = {}) {
  const { locale } = useTranslation();
  
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat(locale, defaultOptions).format(value / 100);
}
