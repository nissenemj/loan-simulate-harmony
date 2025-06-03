
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CookieSettingsButton from "./CookieSettingsButton";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
	const { t } = useLanguage();
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
					{/* About Us Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							{t("footer.aboutUs.title")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/about">{t("footer.aboutUs.mission")}</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/contact">{t("footer.aboutUs.contact")}</Link>
								</Button>
							</li>
						</ul>
						<p className="text-muted-foreground mt-4 text-sm">
							{t("footer.about.description")}
						</p>
					</div>

					{/* Product Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							{t("footer.product.title")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/calculator">{t("footer.product.features")}</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/#demo">{t("footer.product.demo")}</Link>
								</Button>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							{t("footer.resources.title")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/blog">{t("footer.resources.blog")}</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/debt-strategies">
										{t("footer.resources.debtStrategies")}
									</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/faq">{t("footer.resources.faq")}</Link>
								</Button>
							</li>
						</ul>
					</div>

					{/* Legal Column */}
					<div>
						<h3 className="font-bold text-lg mb-4">
							{t("footer.legal.title")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/privacy-policy">{t("footer.legal.privacy")}</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/terms-of-service">{t("footer.legal.terms")}</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									className="p-0 h-auto text-muted-foreground hover:text-foreground"
									asChild
								>
									<Link to="/cookie-policy">{t("footer.legal.cookies")}</Link>
								</Button>
							</li>
							<li>
								<CookieSettingsButton className="p-0 h-auto text-muted-foreground hover:text-foreground" />
							</li>
						</ul>
					</div>
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
							© {currentYear} {t("app.title")}. {t("footer.copyright")}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
