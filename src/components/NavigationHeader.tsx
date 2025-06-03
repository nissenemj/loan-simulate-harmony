
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, User, LogOut, Settings, Calculator } from "lucide-react";

const NavigationHeader: React.FC = () => {
	const { t } = useLanguage();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleLinkClick = () => {
		setIsSheetOpen(false);
	};

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const navItems = [
		{ href: "/", label: t("navigation.home") },
		{ href: "/calculator", label: t("navigation.calculator") },
		{ href: "/debt-strategies", label: t("navigation.strategies") },
		{ href: "/blog", label: t("navigation.blog") },
		{ href: "/contact", label: t("navigation.contact") },
	];

	const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
		<>
			{navItems.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					onClick={mobile ? handleLinkClick : undefined}
					className={`transition-colors hover:text-primary ${
						isActive(item.href)
							? "text-primary font-medium"
							: "text-muted-foreground"
					} ${mobile ? "block py-2" : ""}`}
				>
					{item.label}
				</Link>
			))}
		</>
	);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold text-primary">
						{t("app.name")}
					</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-6">
					<NavItems />
				</nav>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center space-x-4">
					<ThemeToggle />
					
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="relative h-8 w-8 rounded-full">
									<Avatar className="h-8 w-8">
										<AvatarFallback>
											{user.email?.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuItem
									onClick={() => navigate("/dashboard")}
									className="cursor-pointer"
								>
									<User className="mr-2 h-4 w-4" />
									<span>{t("auth.dashboard")}</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate("/settings")}
									className="cursor-pointer"
								>
									<Settings className="mr-2 h-4 w-4" />
									<span>{t("navigation.settings")}</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
									<LogOut className="mr-2 h-4 w-4" />
									<span>{t("auth.logout")}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild>
							<Link to="/auth">{t("auth.login")}</Link>
						</Button>
					)}
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden flex items-center space-x-2">
					<ThemeToggle />
					<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">{t("navigation.menu")}</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[280px]">
							<div className="flex flex-col space-y-4 mt-6">
								<Link
									to="/"
									onClick={handleLinkClick}
									className="text-lg font-semibold"
								>
									{t("app.name")}
								</Link>
								
								<nav className="flex flex-col space-y-3">
									<NavItems mobile />
								</nav>

								<div className="pt-4 border-t">
									{user ? (
										<div className="space-y-3">
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => {
													navigate("/dashboard");
													handleLinkClick();
												}}
											>
												<User className="mr-2 h-4 w-4" />
												{t("auth.dashboard")}
											</Button>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={() => {
													navigate("/settings");
													handleLinkClick();
												}}
											>
												<Settings className="mr-2 h-4 w-4" />
												{t("navigation.settings")}
											</Button>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={handleLogout}
											>
												<LogOut className="mr-2 h-4 w-4" />
												{t("auth.logout")}
											</Button>
										</div>
									) : (
										<Button
											className="w-full"
											onClick={() => {
												navigate("/auth");
												handleLinkClick();
											}}
										>
											{t("auth.login")}
										</Button>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};

export default NavigationHeader;
