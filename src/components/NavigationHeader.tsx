import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ModeToggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Menu, User } from "lucide-react";

const NavigationHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  const handleLanguageChange = (newLanguage: 'en' | 'fi') => {
    setLanguage(newLanguage);
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const links = [];

  if (user) {
    links.push(
      { href: "/dashboard", label: t("navigation.dashboard") },
      { href: "/app", label: t("navigation.calculator") },
      { href: "/debt-strategies", label: t("navigation.debtStrategies") },
      { href: "/blog", label: t("navigation.blog") }
    );
  } else {
    links.push(
      { href: "/app", label: t("navigation.calculator") },
      { href: "/debt-strategies", label: t("navigation.debtStrategies") },
      { href: "/blog", label: t("navigation.blog") }
    );
  }

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center font-semibold">
          {t("app.name")}
        </Link>
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64">
              <SheetHeader>
                <SheetTitle>{t("app.name")}</SheetTitle>
                <SheetDescription>
                  {t("navigation.menu")}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {links.map((link) => (
                  <Button key={link.href} variant="ghost" asChild onClick={() => setOpen(false)}>
                    <Link to={link.href}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {t("navigation.language")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{t("navigation.selectLanguage")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                      {t("navigation.english")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange('fi')}>
                      {t("navigation.finnish")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
                {user ? (
                  <>
                    <Button variant="destructive" onClick={handleLogout}>
                      {t("auth.logout")}
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" asChild onClick={() => setOpen(false)}>
                    <Link to="/auth">{t("auth.login")}</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {links.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      to={link.href}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 data-[active]:bg-muted data-[active]:text-foreground hover:bg-muted hover:text-foreground h-9 px-4 py-2"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  {user ? user.email : t("navigation.account")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {!user ? (
                  <DropdownMenuItem asChild>
                    <Link to="/auth">{t("auth.login")}</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t("navigation.language")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  {t("navigation.english")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('fi')}>
                  {t("navigation.finnish")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
