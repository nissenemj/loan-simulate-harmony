
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, Navigation } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { toast } from "@/components/ui/use-toast";
import VelkavapausLogo from "./VelkavapausLogo";

const NavigationHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
      if (open) setOpen(false);
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation error",
        description: "There was a problem navigating to the page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const links = user
    ? [
        { href: "/dashboard", label: t("navigation.dashboard") },
        { href: "/calculator", label: t("navigation.calculator") },
        { href: "/debt-strategies", label: t("navigation.debtStrategies") },
        { href: "/courses", label: t("navigation.courses") },
        { href: "/blog", label: t("navigation.blog") },
        { href: "/feedback", label: t("navigation.feedback") }
      ]
    : [
        { href: "/calculator", label: t("navigation.calculator") },
        { href: "/debt-strategies", label: t("navigation.debtStrategies") },
        { href: "/courses", label: t("navigation.courses") },
        { href: "/blog", label: t("navigation.blog") },
        { href: "/feedback", label: t("navigation.feedback") }
      ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t("navigation.menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>{t("app.title")}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={isActive(link.href) ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation(link.href)}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {link.label}
            </Button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-col gap-2">
            {!user ? (
              <Button
                className="w-full"
                onClick={() => handleNavigation("/auth")}
              >
                {t("auth.login")}
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleLogout}
              >
                {t("auth.logout")}
              </Button>
            )}
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <div className="hidden md:flex items-center gap-4">
      <nav className="flex items-center gap-1">
        {links.map((link) => (
          <Button
            key={link.href}
            variant={isActive(link.href) ? "secondary" : "ghost"}
            className="px-4"
            onClick={() => handleNavigation(link.href)}
          >
            {link.label}
          </Button>
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-4">
        <LanguageSwitcher />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {user ? user.email : t("navigation.account")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {!user ? (
              <DropdownMenuItem onClick={() => handleNavigation("/auth")}>
                {t("auth.login")}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavigation("/")}
          >
            <VelkavapausLogo />
          </div>
        </div>
        <MobileNav />
        <DesktopNav />
      </div>
    </header>
  );
};

export default NavigationHeader;
