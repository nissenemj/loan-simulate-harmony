
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
import { AuthButtons } from './AuthButtons'; 
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import VelkavapausLogo from './VelkavapausLogo';

const NavigationHeader: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { path: "/dashboard", label: t('tabs.dashboard') },
    { path: "/loans", label: t('tabs.loans') },
    { path: "/debt-summary", label: t('tabs.debtSummary') },
    { path: "/terms", label: t('tabs.glossary') }
  ];
  
  return (
    <header className="border-b mb-6 bg-white">
      <div className="container py-4 px-4 md:px-6 flex justify-between items-center">
        <VelkavapausLogo />
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <AuthButtons />
            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex justify-center mt-6 mb-8">
                  <VelkavapausLogo size="sm" />
                </div>
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={cn(
                        "px-4 py-2 rounded-md font-medium text-center",
                        location.pathname === item.path ? 
                          "bg-primary text-primary-foreground" : 
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
                        location.pathname === item.path && "bg-primary text-primary-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <AuthButtons />
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
