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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-90" 
            onClick={() => handleNavigation("/")}
          >
            <VelkavapausLogo />
          </div>
          
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="min-w-[120px] justify-start gap-2"
                >
                  <span className="truncate">
                    {user ? user.email : t("navigation.account")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {!user ? (
                  <DropdownMenuItem onClick={() => handleNavigation("/auth")}>
                    {t("auth.login")}
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("navigation.menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle className="text-left">{t("app.title")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {links.map((link) => (
                  <Button
                    key={link.href}
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 h-11"
                    onClick={() => handleNavigation(link.href)}
                  >
                    <Navigation className="h-4 w-4" />
                    {link.label}
                  </Button>
                ))}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-col gap-3">
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
        </div>
      </div>
    </header>
  );
};

const DesktopNav = () => (
  <nav className="hidden md:flex items-center gap-1">
    {links.map((link) => (
      <Button
        key={link.href}
        variant={isActive(link.href) ? "secondary" : "ghost"}
        className="px-3 h-9"
        onClick={() => handleNavigation(link.href)}
      >
        {link.label}
      </Button>
    ))}
  </nav>
);

export default NavigationHeader;
