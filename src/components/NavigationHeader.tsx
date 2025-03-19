
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';

const NavigationHeader: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
  return (
    <div className="border-b mb-6">
      <div className="container py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('app.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === "/" && "bg-accent text-accent-foreground"
                )}>
                  {t('tabs.loans')}
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/terms" className={cn(
                  navigationMenuTriggerStyle(),
                  location.pathname === "/terms" && "bg-accent text-accent-foreground"
                )}>
                  {t('tabs.loanTerms')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
