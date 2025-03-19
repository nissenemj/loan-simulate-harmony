
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const NavigationHeader: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { path: "/", label: t('tabs.loans') },
    { path: "/debt-summary", label: t('tabs.debtSummary') },
    { path: "/terms", label: t('tabs.loanTerms') }
  ];
  
  return (
    <header className="border-b mb-6">
      <div className="container py-4 px-4 md:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <p className="text-sm text-muted-foreground max-w-xs md:max-w-none">{t('app.subtitle')}</p>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={cn(
                        "px-4 py-2 rounded-md font-medium",
                        location.pathname === item.path ? 
                          "bg-accent text-accent-foreground" : 
                          "text-foreground hover:bg-accent/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === item.path && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
