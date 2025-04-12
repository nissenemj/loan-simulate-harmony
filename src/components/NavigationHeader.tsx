
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const NavigationHeader = () => {
	const [open, setOpen] = useState(false);
	const { user, logout } = useAuth();
	const { t } = useLanguage();
	const isMobile = useIsMobile();
	const navigate = useNavigate();

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

	// Define navigation links based on authentication status
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

	return (
		<header className="bg-background sticky top-0 z-50 w-full border-b">
			<div className="container flex h-16 items-center justify-between">
				<Link to="/" className="flex items-center font-semibold">
					{t("app.title")}
				</Link>

				{isMobile ? (
					// Mobile navigation with sheet/drawer
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="sm:max-w-xs w-[85vw] max-w-xs">
							<SheetHeader>
								<SheetTitle>{t("app.title")}</SheetTitle>
								<SheetDescription>{t("navigation.menu")}</SheetDescription>
							</SheetHeader>
							<div className="grid gap-4 py-4">
								{links.map((link) => (
									<Button
										key={link.href}
										variant="ghost"
										onClick={() => handleNavigation(link.href)}
										className="h-12 text-base justify-start"
									>
										{link.label}
									</Button>
								))}

								<div className="mt-2">
									<LanguageSwitcher />
								</div>

								<div className="mt-2">
									<ModeToggle />
								</div>

								{user ? (
									<Button
										variant="destructive"
										onClick={handleLogout}
										className="mt-4 h-12 text-base"
									>
										{t("auth.logout")}
									</Button>
								) : (
									<Button
										variant="secondary"
										onClick={() => handleNavigation("/auth")}
										className="mt-4 h-12 text-base"
									>
										{t("auth.login")}
									</Button>
								)}
							</div>
						</SheetContent>
					</Sheet>
				) : (
					// Desktop navigation
					<div className="flex items-center gap-4">
						<NavigationMenu>
							<NavigationMenuList>
								{links.map((link) => (
									<NavigationMenuItem key={link.href}>
										<button
											onClick={() => handleNavigation(link.href)}
											className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 data-[active]:bg-muted data-[active]:text-foreground hover:bg-muted hover:text-foreground h-9 px-4 py-2"
										>
											{link.label}
										</button>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>

						<div className="flex items-center gap-2">
							<LanguageSwitcher />

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="ml-2">
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

							<ModeToggle />
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default NavigationHeader;
