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
import {
	Menu,
	User,
	ChevronDown,
	Calculator,
	BarChart3,
	BookOpen,
	Mail,
	Home,
	LogIn,
	UserPlus,
	LogOut,
	Settings,
	CreditCard,
	PieChart,
	DollarSign,
} from "lucide-react";
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

	// Define navigation items based on user authentication status
	const mainNavItems = user
		? [
				// Dashboard link removed from main nav to avoid duplication with user dropdown
				{
					href: "/calculator",
					label: t("navigation.calculator"),
					icon: <Calculator className="h-4 w-4" />,
				},
				{
					href: "#",
					label: t("navigation.strategies"),
					icon: <BarChart3 className="h-4 w-4" />,
					children: [
						{
							href: "/debt-strategies",
							label: t("navigation.debtStrategies"),
							description: t("navigation.debtStrategiesDescription"),
						},
						{
							href: "/debt-summary",
							label: t("navigation.debtSummary"),
							description: t("navigation.debtSummaryDescription"),
						},
					],
				},
				{
					href: "/blog",
					label: t("navigation.blog"),
					icon: <BookOpen className="h-4 w-4" />,
				},
				{
					href: "/contact",
					label: t("navigation.contact"),
					icon: <Mail className="h-4 w-4" />,
				},
		  ]
		: [
				{
					href: "#",
					label: t("navigation.features"),
					icon: <DollarSign className="h-4 w-4" />,
					children: [
						{
							href: "/calculator",
							label: t("navigation.calculator"),
							description: t("navigation.calculatorDescription"),
						},
						{
							href: "/debt-summary",
							label: t("navigation.debtSummary"),
							description: t("navigation.debtSummaryDescription"),
						},
					],
				},
				{
					href: "/debt-strategies",
					label: t("navigation.strategies"),
					icon: <BarChart3 className="h-4 w-4" />,
				},
				// Placeholder for future pricing page
				// {
				// 	href: "/pricing",
				// 	label: t("navigation.pricing"),
				// 	icon: <CreditCard className="h-4 w-4" />
				// },
				{
					href: "/blog",
					label: t("navigation.blog"),
					icon: <BookOpen className="h-4 w-4" />,
				},
				{
					href: "/contact",
					label: t("navigation.contact"),
					icon: <Mail className="h-4 w-4" />,
				},
		  ];

	const isActive = (path: string) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		if (path === "#") {
			return false;
		}
		return (
			location.pathname === path ||
			(path !== "/" && location.pathname.startsWith(`${path}/`))
		);
	};

	// Function to render dropdown menu for navigation items with children
	const renderDropdownMenu = (item: any) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant={isActive(item.href) ? "secondary" : "ghost"}
						className="flex items-center gap-1"
					>
						{item.icon && <span className="mr-1">{item.icon}</span>}
						{item.label}
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center" className="w-56">
					{item.children.map((child: any) => (
						<DropdownMenuItem
							key={child.href}
							onClick={() => handleNavigation(child.href)}
							className="flex flex-col items-start"
						>
							<div className="font-medium">{child.label}</div>
							{child.description && (
								<div className="text-xs text-muted-foreground">
									{child.description}
								</div>
							)}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	return (
		<header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
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
							<Button variant="ghost" size="sm" className="px-2 -mr-2">
								<Menu className="h-5 w-5" />
								<span className="sr-only">{t("navigation.menu")}</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[85vw] max-w-xs p-0">
							<div className="border-b px-6 py-4">
								<SheetTitle>{t("app.title")}</SheetTitle>
							</div>
							<nav className="flex flex-col gap-1 p-4">
								{mainNavItems.map((item) =>
									item.children ? (
										<div key={item.href} className="space-y-1">
											<div className="px-3 py-2 text-sm font-medium flex items-center">
												{item.icon && <span className="mr-2">{item.icon}</span>}
												{item.label}
											</div>
											<div className="pl-4 space-y-1">
												{item.children.map((child: any) => (
													<Button
														key={child.href}
														variant={
															isActive(child.href) ? "secondary" : "ghost"
														}
														className="w-full justify-start text-sm"
														onClick={() => handleNavigation(child.href)}
													>
														{child.label}
													</Button>
												))}
											</div>
										</div>
									) : (
										<Button
											key={item.href}
											variant={isActive(item.href) ? "secondary" : "ghost"}
											className="w-full justify-start"
											onClick={() => handleNavigation(item.href)}
										>
											{item.icon && <span className="mr-2">{item.icon}</span>}
											{item.label}
										</Button>
									)
								)}
							</nav>
							<div className="border-t p-4 space-y-4">
								<div className="flex items-center justify-between gap-2">
									<LanguageSwitcher />
									<ModeToggle />
								</div>
								{user ? (
									<>
										<Button
											variant="default"
											onClick={() => handleNavigation("/dashboard")}
											className="w-full"
										>
											<PieChart className="h-4 w-4 mr-2" />
											{t("navigation.dashboard")}
										</Button>
										<Button
											variant="destructive"
											onClick={handleLogout}
											className="w-full"
										>
											<LogOut className="h-4 w-4 mr-2" />
											{t("auth.logout")}
										</Button>
									</>
								) : (
									<div className="space-y-2">
										<Button
											variant="default"
											onClick={() => handleNavigation("/auth")}
											className="w-full"
										>
											<LogIn className="h-4 w-4 mr-2" />
											{t("auth.login")}
										</Button>
										<Button
											variant="outline"
											onClick={() => handleNavigation("/auth?tab=register")}
											className="w-full"
										>
											<UserPlus className="h-4 w-4 mr-2" />
											{t("auth.signUp")}
										</Button>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
				) : (
					<div className="flex flex-1 items-center justify-between">
						<nav className="flex items-center space-x-1 mx-4">
							<Button
								variant={isActive("/") ? "secondary" : "ghost"}
								onClick={() => handleNavigation("/")}
								className="hidden md:flex"
							>
								<Home className="h-4 w-4 mr-1" />
								{t("navigation.home")}
							</Button>

							{mainNavItems.map((item) =>
								item.children ? (
									<div key={item.href}>{renderDropdownMenu(item)}</div>
								) : (
									<Button
										key={item.href}
										variant={isActive(item.href) ? "secondary" : "ghost"}
										onClick={() => handleNavigation(item.href)}
									>
										{item.icon && <span className="mr-1">{item.icon}</span>}
										{item.label}
									</Button>
								)
							)}
						</nav>

						<div className="flex items-center gap-2">
							<LanguageSwitcher />
							<ModeToggle />

							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm" className="h-9">
											<User className="h-4 w-4 mr-2" />
											{user.email}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuLabel>{user.email}</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => handleNavigation("/dashboard")}
										>
											<PieChart className="h-4 w-4 mr-2" />
											{t("navigation.dashboard")}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleNavigation("/settings")}
										>
											<Settings className="h-4 w-4 mr-2" />
											{t("navigation.settings")}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleLogout}>
											<LogOut className="h-4 w-4 mr-2" />
											{t("auth.logout")}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleNavigation("/auth")}
									>
										<LogIn className="h-4 w-4 mr-1" />
										{t("auth.login")}
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={() => handleNavigation("/auth?tab=register")}
									>
										{t("auth.signUp")}
									</Button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default NavigationHeader;
