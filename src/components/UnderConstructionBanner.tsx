
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

const UnderConstructionBanner = () => {
  const { t } = useLanguage();
  
  return (
    <Alert variant="destructive" className="mb-6 animate-pulse">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">{t('alerts.underConstruction.title')}</AlertTitle>
      <AlertDescription>
        {t('alerts.underConstruction.description')}
      </AlertDescription>
    </Alert>
  );
};

export default UnderConstructionBanner;
