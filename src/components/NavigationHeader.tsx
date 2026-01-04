
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Menu, User, LogOut, Settings, Calculator, BookOpen, Lightbulb, Heart, HandHeart, ChevronDown, Download } from "lucide-react";


const NavigationHeader: React.FC = () => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await signOut();
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

	const mainNavItems = [
		{ href: "/calculator", label: "Laskuri" },
		{ href: "/debt-strategies", label: "Strategiat" },
	];

	const contentDropdowns = [
		{
			label: "Oppaat",
			icon: <BookOpen className="h-4 w-4" />,
			items: [
				{ href: "/oppaat", label: "Kaikki oppaat" },
				{ href: "/oppaat/velkajarjestely", label: "Velkajärjestely" },
				{ href: "/oppaat/ulosotto", label: "Ulosotto" },
				{ href: "/oppaat/maksuhairio", label: "Maksuhäiriö" },
				{ href: "/oppaat/perinta", label: "Perintä" },
			],
		},
		{
			label: "Vinkit",
			icon: <Lightbulb className="h-4 w-4" />,
			items: [
				{ href: "/vinkit", label: "Kaikki vinkit" },
				{ href: "/vinkit/budjetointi", label: "Budjetointi" },
				{ href: "/vinkit/saastaminen", label: "Säästäminen" },
				{ href: "/vinkit/velkojen-maksu", label: "Velkojen maksu" },
			],
		},
	];

	const secondaryNavItems = [
		{ href: "/materiaalit", label: "Materiaalit", icon: <Download className="h-4 w-4" /> },
		{ href: "/tarinat", label: "Tarinat", icon: <Heart className="h-4 w-4" /> },
		{ href: "/apua", label: "Apua", icon: <HandHeart className="h-4 w-4" /> },
		{ href: "/blog", label: "Blogi" },
	];

	const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
		<>
			{/* Main nav items */}
			{mainNavItems.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					onClick={mobile ? handleLinkClick : undefined}
					className={`transition-colors hover:text-primary ${isActive(item.href)
						? "text-primary font-medium"
						: "text-muted-foreground"
						} ${mobile ? "block py-2" : ""}`}
				>
					{item.label}
				</Link>
			))}

			{/* Content dropdowns - Desktop only */}
			{!mobile && contentDropdowns.map((dropdown) => (
				<DropdownMenu key={dropdown.label}>
					<DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
						{dropdown.icon}
						{dropdown.label}
						<ChevronDown className="h-3 w-3" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{dropdown.items.map((item) => (
							<DropdownMenuItem key={item.href} asChild>
								<Link to={item.href}>{item.label}</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			))}

			{/* Mobile: Flat list for content sections */}
			{mobile && contentDropdowns.map((dropdown) => (
				<div key={dropdown.label} className="py-2">
					<Link
						to={dropdown.items[0].href}
						onClick={handleLinkClick}
						className="flex items-center gap-2 font-medium text-foreground"
					>
						{dropdown.icon}
						{dropdown.label}
					</Link>
					<div className="ml-6 mt-1 space-y-1">
						{dropdown.items.slice(1).map((item) => (
							<Link
								key={item.href}
								to={item.href}
								onClick={handleLinkClick}
								className="block text-sm text-muted-foreground hover:text-primary py-1"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			))}

			{/* Secondary nav items */}
			{secondaryNavItems.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					onClick={mobile ? handleLinkClick : undefined}
					className={`transition-colors hover:text-primary flex items-center gap-1 ${isActive(item.href)
						? "text-primary font-medium"
						: "text-muted-foreground"
						} ${mobile ? "py-2" : ""}`}
				>
					{"icon" in item && item.icon}
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
						Velkavapaus
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
									<span>Hallintapaneeli</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => navigate("/settings")}
									className="cursor-pointer"
								>
									<Settings className="mr-2 h-4 w-4" />
									<span>Asetukset</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
									<LogOut className="mr-2 h-4 w-4" />
									<span>Kirjaudu ulos</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild>
							<Link to="/auth">Kirjaudu sisään</Link>
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
								<span className="sr-only">Valikko</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[280px]">
							<div className="flex flex-col space-y-4 mt-6">
								<Link
									to="/"
									onClick={handleLinkClick}
									className="text-lg font-semibold"
								>
									Velkavapaus
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
												Hallintapaneeli
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
												Asetukset
											</Button>
											<Button
												variant="ghost"
												className="w-full justify-start"
												onClick={handleLogout}
											>
												<LogOut className="mr-2 h-4 w-4" />
												Kirjaudu ulos
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
											Kirjaudu sisään
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
