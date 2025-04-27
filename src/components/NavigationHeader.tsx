
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
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
import { Menu, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { toast } from "@/components/ui/use-toast";
import VelkavapausLogo from "./VelkavapausLogo";
import { cn } from "@/lib/utils";

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
      ]
    : [
        { href: "/calculator", label: t("navigation.calculator") },
        { href: "/debt-strategies", label: t("navigation.debtStrategies") },
        { href: "/courses", label: t("navigation.courses") },
        { href: "/blog", label: t("navigation.blog") },
      ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`))
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <VelkavapausLogo />
        </div>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("navigation.menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>{t("app.title")}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {links.map((link) => (
                  <Button
                    key={link.href}
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation(link.href)}
                  >
                    {link.label}
                  </Button>
                ))}
              </nav>
              <div className="mt-auto p-4 border-t">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full h-12 text-base font-medium"
                  onClick={() => handleNavigation("/calculator")}
                >
                  {t("navigation.startFreeCalculation")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-4">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {links.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Button
                      onClick={() => handleNavigation(link.href)}
                      variant={isActive(link.href) ? "secondary" : "ghost"}
                      className={cn(
                        "h-9 px-4 py-2",
                        isActive(link.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      {link.label}
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="lg"
                className="h-10 px-6 text-base font-medium hidden md:flex"
                onClick={() => handleNavigation("/calculator")}
              >
                {t("navigation.startFreeCalculation")}
              </Button>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <User className="h-4 w-4 mr-2" />
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
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
