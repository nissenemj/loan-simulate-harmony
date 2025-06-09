
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DebtStrategies } from '@/components/calculator/DebtStrategies';
import { ErrorProvider } from '@/contexts/ErrorContext';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { EnhancedThemeToggle } from '@/components/ui/enhanced-theme-toggle';

const Calculator = () => {
  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
      <Helmet>
        <title>Velkalaskuri | Velkavapaus.fi</title>
        <meta name="description" content="Laske velkojen takaisinmaksu tehokkaasti eri strategioilla" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <BreadcrumbNav />
          <EnhancedThemeToggle showLabel variant="compact" />
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Velkalaskuri</h1>
          <p className="text-muted-foreground mt-2">Laske velkojen takaisinmaksu tehokkaasti eri strategioilla</p>
        </div>
        
        <ErrorProvider>
          <DebtStrategies />
        </ErrorProvider>
      </div>
    </div>
  );
};

export default Calculator;
