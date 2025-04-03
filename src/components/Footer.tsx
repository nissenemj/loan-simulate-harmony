
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CookieSettingsButton from './CookieSettingsButton';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-accent/80 border-t dark:bg-bg-secondary dark:border-bg-highlight">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              {t("footer.about.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("footer.about.description")}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">
              {t("footer.links.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/">{t("footer.links.item1")}</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/terms">{t("footer.links.item2")}</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/debt-summary">{t("footer.links.item3")}</Link>
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">
              {t("footer.legal.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  asChild
                >
                  <Link to="/privacy-policy">{t("footer.legal.privacy")}</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/terms-of-service">{t("footer.legal.terms")}</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  asChild
                >
                  <Link to="/cookie-policy">{t("footer.legal.cookies")}</Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} {t("app.title")}. {t("footer.copyright")}</p>
          <div className="mt-2">
            <CookieSettingsButton className="text-xs h-auto p-0 mx-2" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
