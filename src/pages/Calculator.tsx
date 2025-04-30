
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/contexts/LanguageContext';
import { DebtStrategies } from '@/components/calculator/DebtStrategies';
import { ErrorProvider } from '@/contexts/ErrorContext';
import BreadcrumbNav from '@/components/BreadcrumbNav';

/**
 * Calculator page component
 * Serves as the main entry point for the /calculator route
 */
const Calculator = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Helmet>
        <title>{t('calculator.debtPayoffCalculator')} | {t('app.title')}</title>
        <meta name="description" content={t('debtStrategies.pageDescription')} />
      </Helmet>
      
      <div className="space-y-6">
        <BreadcrumbNav />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('calculator.debtPayoffCalculator')}</h1>
          <p className="text-muted-foreground mt-2">{t('debtStrategies.pageDescription')}</p>
        </div>
        
        <DebtStrategies />
      </div>
    </div>
  );
};

export default Calculator;
