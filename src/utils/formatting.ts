
// Simplified Finnish formatting utilities without internationalization

export interface CurrencyFormatOptions {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export function useCurrencyFormatter(options: CurrencyFormatOptions = {}) {
  const defaultOptions = {
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    showSymbol: true,
    ...options
  };
  
  return {
    format: (value: number) => {
      return new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: defaultOptions.currency,
        minimumFractionDigits: defaultOptions.minimumFractionDigits,
        maximumFractionDigits: defaultOptions.maximumFractionDigits
      }).format(value);
    },
    formatWithoutSymbol: (value: number) => {
      return new Intl.NumberFormat('fi-FI', {
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
  const defaultOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  };
  
  return (value: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'percent',
      minimumFractionDigits: defaultOptions.minimumFractionDigits,
      maximumFractionDigits: defaultOptions.maximumFractionDigits
    }).format(value / 100);
  };
}

export function useDateFormatter(options: Intl.DateTimeFormatOptions = {}) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fi-FI', defaultOptions).format(dateObj);
  };
}

// Static formatters for direct use
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fi-FI', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fi-FI', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};
