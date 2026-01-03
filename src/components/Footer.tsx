
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CookieSettingsButton from "./CookieSettingsButton";
import CrisisHelp from "./CrisisHelp";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	// Social media links - these would be replaced with actual links
	const socialLinks = [
		{ icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
		{ icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
		{ icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
		{ icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
	];

	return (
		<footer className="py-12 bg-accent/80 border-t dark:bg-bg-secondary dark:border-bg-highlight">
			<div className="container mx-auto max-w-6xl px-4">
				{/* Kriisiapu - PAKOLLINEN jokaisella sivulla */}
				<CrisisHelp variant="compact" className="mb-8" />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
					{/* About Us Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							Tietoa meistä
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/about">Missio</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/contact">Yhteystiedot</Link>
								</Button>
							</li>
						</ul>
						<p className="text-muted-foreground mt-4 text-sm">
							Autamme sinua hallitsemaan velkojasi ja pääsemään kohti taloudellista vapautta
						</p>
					</div>

					{/* Product Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							Tuote
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/calculator">Ominaisuudet</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/#demo">Demo</Link>
								</Button>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							Resurssit
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/blog">Blogi</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/debt-strategies">
										Velkastrategiat
									</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/faq">UKK</Link>
								</Button>
							</li>
						</ul>
					</div>

					{/* Help Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							Apua
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<a href="tel:0295660123">Velkaneuvonta: 0295 660 123</a>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<a href="tel:0925250111">Kriisipuhelin: 09 2525 0111</a>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<a href="tel:080098009">Takuusäätiö: 0800 9 8009</a>
								</Button>
							</li>
						</ul>
					</div>
				</div>

				{/* Legal Links Row */}
				<div className="flex flex-wrap gap-4 mb-8 text-sm">
					<Button
						variant="link"
						className="p-0 h-auto text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link to="/privacy-policy">Tietosuoja</Link>
					</Button>
					<Button
						variant="link"
						className="p-0 h-auto text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link to="/terms-of-service">Käyttöehdot</Link>
					</Button>
					<Button
						variant="link"
						className="p-0 h-auto text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link to="/cookie-policy">Evästeet</Link>
					</Button>
					<CookieSettingsButton className="p-0 h-auto text-muted-foreground hover:text-foreground" />
				</div>

				{/* Social Media */}
				<div className="flex flex-col md:flex-row justify-between items-center border-t pt-8">
					<div className="flex space-x-4 mb-4 md:mb-0">
						{socialLinks.map((link, index) => (
							<a
								key={index}
								href={link.href}
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label={link.label}
							>
								{link.icon}
							</a>
						))}
					</div>

					<div className="flex flex-col md:flex-row items-center gap-4">
						<p className="text-sm text-muted-foreground">
							© {currentYear} Velkavapaus.fi. Kaikki oikeudet pidätetään.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
