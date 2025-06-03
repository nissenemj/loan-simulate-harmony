
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DebtStrategies } from '@/components/calculator/DebtStrategies';
import { ErrorProvider } from '@/contexts/ErrorContext';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const Calculator = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Helmet>
        <title>Velkalaskuri | Velkavapaus.fi</title>
        <meta name="description" content="Laske velkojen takaisinmaksu tehokkaasti eri strategioilla" />
      </Helmet>
      
      <div className="space-y-6">
        <BreadcrumbNav />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Velkalaskuri</h1>
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
