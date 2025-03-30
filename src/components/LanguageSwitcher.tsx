
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const handleLanguageChange = (newLanguage: 'en' | 'fi') => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      toast.success(
        newLanguage === 'en' 
          ? 'Language changed to English' 
          : 'Kieli vaihdettu suomeksi'
      );
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground mr-1 hidden sm:inline">
        <Globe className="inline h-3 w-3 mr-1" />
        {t('app.language')}:
      </span>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        className="px-3 py-1 h-auto text-xs"
        aria-label={t('language.en')}
      >
        {t('language.en')}
      </Button>
      <Button
        variant={language === 'fi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('fi')}
        className="px-3 py-1 h-auto text-xs"
        aria-label={t('language.fi')}
      >
        {t('language.fi')}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
