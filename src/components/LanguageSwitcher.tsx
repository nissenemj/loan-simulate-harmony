
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground mr-1 hidden sm:inline">
        <Globe className="inline h-3 w-3 mr-1" />
        {t('app.language')}:
      </span>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="px-3 py-1 h-auto text-xs"
        aria-label="English"
      >
        {t('language.en')}
      </Button>
      <Button
        variant={language === 'fi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('fi')}
        className="px-3 py-1 h-auto text-xs"
        aria-label="Suomi"
      >
        {t('language.fi')}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
