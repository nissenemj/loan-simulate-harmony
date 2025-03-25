
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { path: "/dashboard", label: t('tabs.dashboard') },
    { path: "/loans", label: t('tabs.loans') },
    { path: "/debt-summary", label: t('tabs.debtSummary') },
    { path: "/blog", label: t('tabs.blog') || "Blogi" },
    { path: "/terms", label: t('tabs.glossary') }
  ];
  
  const handleMobileNavigation = (path: string) => {
    setIsOpen(false); // Close the mobile menu
    navigate(path);
  };
  
  return (
    <header className="border-b sticky top-0 z-50 bg-white shadow-sm">
      <div className="container py-3 md:py-4 px-3 md:px-6 flex justify-between items-center">
        <Link to="/">
          <VelkavapausLogo />
        </Link>
        
        {isMobile ? (
          <div className="flex items-center gap-1 justify-end">
            <LanguageSwitcher />
            <AuthButtons />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  aria-label="Menu"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary ml-1"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[85%] sm:w-[385px]">
                <div className="flex justify-center mt-6 mb-8">
                  <VelkavapausLogo size="sm" />
                </div>
                <nav className="flex flex-col gap-3 mt-6">
                  {menuItems.map((item) => (
                    <button 
                      key={item.path}
                      onClick={() => handleMobileNavigation(item.path)}
                      className={cn(
                        "px-4 py-3 rounded-md font-medium text-center transition-colors w-full",
                        location.pathname === item.path ? 
                          "bg-primary text-primary-foreground" : 
                          "text-foreground hover:bg-accent/50"
                      )}
                    >
                      {item.label}
                    </button>
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
