import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, User } from "lucide-react";
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
				description:
					"There was a problem navigating to the page. Please try again.",
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
		return location.pathname === path || 
		       (path !== "/" && location.pathname.startsWith(`${path}/`));
	};

	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b">
			<div className="container flex h-16 items-center justify-between px-4">
				<div 
					className="flex items-center cursor-pointer" 
					onClick={() => navigate("/")}
				>
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
							<div className="border-b px-6 py-4">
								<SheetTitle>{t("app.title")}</SheetTitle>
							</div>
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
							<div className="border-t p-4 space-y-4">
								<div className="flex items-center gap-2">
									<LanguageSwitcher />
									<ModeToggle />
								</div>
								{user ? (
									<Button
										variant="destructive"
										onClick={handleLogout}
										className="w-full"
									>
										{t("auth.logout")}
									</Button>
								) : (
									<Button
										variant="default"
										onClick={() => handleNavigation("/auth")}
										className="w-full"
									>
										{t("auth.login")}
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
										<Button
											onClick={() => handleNavigation(link.href)}
											variant={isActive(link.href) ? "secondary" : "ghost"}
											className="h-9"
										>
											{link.label}
										</Button>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>

						<div className="flex items-center gap-2">
							<LanguageSwitcher />
							<ModeToggle />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm">
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
				)}
			</div>
		</header>
	);
};

export default NavigationHeader;
