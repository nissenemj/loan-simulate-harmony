
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="px-3 py-1 h-auto text-xs"
      >
        {t('language.en')}
      </Button>
      <Button
        variant={language === 'fi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('fi')}
        className="px-3 py-1 h-auto text-xs"
      >
        {t('language.fi')}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
