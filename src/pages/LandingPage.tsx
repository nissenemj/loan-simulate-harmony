import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	HandCoins,
	LineChart,
	SmilePlus,
	ArrowRight,
	HelpCircle,
	CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import UserGuidanceSection from "@/components/UserGuidanceSection";
import AdSenseBanner from "@/components/AdSenseBanner";
import { affiliateBanners } from "@/utils/affiliateData";
import AffiliateBanner from "@/components/affiliate/AffiliateBanner";
import LandingPageDemo from "@/components/landing/LandingPageDemo";
import LazyImage from "@/components/ui/lazy-image";

const LandingPage = () => {
	const { t, language } = useLanguage();
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		console.log("Current language:", language);
		console.log("Hero headline translation:", t("landing.hero.headline"));
	}, [language, t]);

	const handleCTAClick = () => {
		navigate("/auth");
	};

	const investmentBanners = affiliateBanners.filter(
		(banner) => banner.category === "investment"
	);
	const loanBanners = affiliateBanners.filter(
		(banner) => banner.category === "loan"
	);

	return (
		<>
			<Helmet>
				<title>{t("landing.seo.title")}</title>
				<meta name="description" content={t("landing.seo.description")} />
				<meta name="keywords" content={t("landing.seo.keywords")} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://velkavapaus.fi" />
				<meta property="og:title" content={t("landing.seo.title")} />
				<meta
					property="og:description"
					content={t("landing.seo.description")}
				/>
				<meta
					property="og:image"
					content="https://velkavapaus.fi/og-image.png"
				/>
				<meta property="og:site_name" content="Velkavapaus.fi" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={t("landing.seo.title")} />
				<meta
					name="twitter:description"
					content={t("landing.seo.description")}
				/>
				<meta
					name="twitter:image"
					content="https://velkavapaus.fi/og-image.png"
				/>

				<link rel="canonical" href="https://velkavapaus.fi" />

				<script type="application/ld+json">
					{`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Velkavapaus.fi",
              "url": "https://velkavapaus.fi",
              "description": "${t("landing.seo.description")}",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "provider": {
                "@type": "Organization",
                "name": "Velkavapaus.fi",
                "url": "https://velkavapaus.fi"
              }
            }
          `}
				</script>
			</Helmet>

			<div className="hero-gradient">
				<section className="pt-12 pb-16 px-4 md:pt-20 md:pb-24">
					<div className="container mx-auto max-w-5xl">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<div className="space-y-6">
								<div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
									{t("landing.hero.badge") || "Velkavapaus.fi"}
								</div>
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
									{t("landing.hero.headline")}
								</h1>
								<p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
									{t("landing.hero.subheadline")}
								</p>
								{!user ? (
									<div className="flex flex-col sm:flex-row gap-4 pt-2">
										<Button
											size="lg"
											className="bg-primary hover:bg-primary/90 transition-colors h-12 px-6 text-base"
											onClick={handleCTAClick}
										>
											{t("landing.hero.cta")}
											<ArrowRight className="ml-2 h-5 w-5" />
										</Button>
										<Button
											variant="outline"
											size="lg"
											className="h-12 px-6 text-base"
											onClick={() => navigate("/terms")}
										>
											{t("landing.hero.secondaryCta")}
										</Button>
									</div>
								) : (
									<div className="flex flex-col sm:flex-row gap-4 pt-2">
										<Button
											size="lg"
											className="bg-primary hover:bg-primary/90 transition-colors h-12 px-6 text-base"
											onClick={() => navigate("/dashboard")}
										>
											{t("landing.hero.loggedInCta")}
											<ArrowRight className="ml-2 h-5 w-5" />
										</Button>
										<Button
											variant="outline"
											size="lg"
											className="h-12 px-6 text-base"
											onClick={() => navigate("/blog")}
										>
											{t("landing.hero.blogCta")}
										</Button>
									</div>
								)}

								<div className="pt-4 flex items-center text-sm text-muted-foreground">
									<CheckCircle className="h-4 w-4 mr-2 text-primary" />
									<span>
										{t("landing.hero.feature1") || "Ilmainen käyttää"}
									</span>
									<span className="mx-2">•</span>
									<CheckCircle className="h-4 w-4 mr-2 text-primary" />
									<span>
										{t("landing.hero.feature2") || "Ei rekisteröintiä"}
									</span>
								</div>
							</div>
							<div className="rounded-2xl shadow-xl overflow-hidden hidden md:block border border-muted/20 bg-card">
								<LazyImage
									src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
									alt={t("landing.hero.imageAlt")}
									className="w-full h-auto object-cover"
									wrapperClassName="aspect-[4/3]"
								/>
							</div>
						</div>
					</div>
				</section>

				{user && <UserGuidanceSection />}

				{/* Interactive Demo Section */}
				<LandingPageDemo />

				{/* Investment Banner Section */}
				<div className="container mx-auto max-w-5xl px-4 py-4">
					{investmentBanners.length > 0 && (
						<div className="flex justify-center mb-6">
							<AffiliateBanner banner={investmentBanners[0]} />
						</div>
					)}
				</div>

				<section className="py-16 bg-background dark:bg-accent/5">
					<div className="container mx-auto max-w-5xl">
						<h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
							{t("landing.benefits.title")}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px] dark:bg-secondary/10 dark:border-secondary/20">
								<CardContent className="pt-6">
									<div className="flex flex-col items-center text-center space-y-4">
										<div className="rounded-full bg-primary/10 p-3">
											<HandCoins className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">
											{t("landing.benefits.item1.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("landing.benefits.item1.description")}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px] dark:bg-secondary/10 dark:border-secondary/20">
								<CardContent className="pt-6">
									<div className="flex flex-col items-center text-center space-y-4">
										<div className="rounded-full bg-primary/10 p-3">
											<LineChart className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">
											{t("landing.benefits.item2.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("landing.benefits.item2.description")}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px] dark:bg-secondary/10 dark:border-secondary/20">
								<CardContent className="pt-6">
									<div className="flex flex-col items-center text-center space-y-4">
										<div className="rounded-full bg-primary/10 p-3">
											<SmilePlus className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-xl font-semibold">
											{t("landing.benefits.item3.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("landing.benefits.item3.description")}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className="py-16 bg-accent/50 dark:bg-accent/10">
					<div className="container mx-auto max-w-5xl">
						<h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
							{t("landing.methods.title")}
						</h2>
						<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
							{t("landing.methods.subtitle")}
						</p>

						<Tabs defaultValue="avalanche" className="w-full">
							<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
								<TabsTrigger value="avalanche">
									{t("landing.methods.avalanche.title")}
								</TabsTrigger>
								<TabsTrigger value="snowball">
									{t("landing.methods.snowball.title")}
								</TabsTrigger>
							</TabsList>

							<TabsContent value="avalanche" className="space-y-4">
								<Card>
									<CardContent className="pt-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
											<div>
												<h3 className="text-xl font-semibold mb-4">
													{t("landing.methods.avalanche.title")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{t("landing.methods.avalanche.description")}
												</p>
												<ul className="space-y-2">
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.avalanche.benefit1")}
														</span>
													</li>
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.avalanche.benefit2")}
														</span>
													</li>
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.avalanche.benefit3")}
														</span>
													</li>
												</ul>
											</div>
											<div className="rounded-lg overflow-hidden shadow-md">
												<LazyImage
													src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
													alt={t("landing.methods.avalanche.imageAlt")}
													className="w-full h-auto"
													wrapperClassName="aspect-[4/3]"
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="snowball" className="space-y-4">
								<Card>
									<CardContent className="pt-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
											<div>
												<h3 className="text-xl font-semibold mb-4">
													{t("landing.methods.snowball.title")}
												</h3>
												<p className="text-muted-foreground mb-4">
													{t("landing.methods.snowball.description")}
												</p>
												<ul className="space-y-2">
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.snowball.benefit1")}
														</span>
													</li>
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.snowball.benefit2")}
														</span>
													</li>
													<li className="flex items-start">
														<CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
														<span>
															{t("landing.methods.snowball.benefit3")}
														</span>
													</li>
												</ul>
											</div>
											<div className="rounded-lg overflow-hidden shadow-md">
												<LazyImage
													src="https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
													alt={t("landing.methods.snowball.imageAlt")}
													className="w-full h-auto"
													wrapperClassName="aspect-[4/3]"
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</section>

				{/* Loan Banner Section */}
				<div className="container mx-auto max-w-5xl px-4 py-4">
					{loanBanners.length > 0 && (
						<div className="flex justify-center mb-6">
							<AffiliateBanner banner={loanBanners[0]} />
						</div>
					)}
				</div>

				<section className="py-16 bg-background dark:bg-accent/5">
					<div className="container mx-auto max-w-5xl">
						<h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
							{t("landing.faq.title")}
						</h2>
						<div className="space-y-6 max-w-3xl mx-auto">
							<Card className="border shadow dark:border-secondary/20 dark:bg-secondary/10">
								<CardContent className="pt-6">
									<h3 className="text-xl font-semibold mb-2 flex items-start">
										<HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
										{t("landing.faq.question1")}
									</h3>
									<p className="text-muted-foreground ml-7">
										{t("landing.faq.answer1")}
									</p>
								</CardContent>
							</Card>

							<Card className="border shadow dark:border-secondary/20 dark:bg-secondary/10">
								<CardContent className="pt-6">
									<h3 className="text-xl font-semibold mb-2 flex items-start">
										<HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
										{t("landing.faq.question2")}
									</h3>
									<p className="text-muted-foreground ml-7">
										{t("landing.faq.answer2")}
									</p>
								</CardContent>
							</Card>

							<Card className="border shadow dark:border-secondary/20 dark:bg-secondary/10">
								<CardContent className="pt-6">
									<h3 className="text-xl font-semibold mb-2 flex items-start">
										<HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
										{t("landing.faq.question3")}
									</h3>
									<p className="text-muted-foreground ml-7">
										{t("landing.faq.answer3")}
									</p>
								</CardContent>
							</Card>

							<Card className="border shadow dark:border-secondary/20 dark:bg-secondary/10">
								<CardContent className="pt-6">
									<h3 className="text-xl font-semibold mb-2 flex items-start">
										<HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
										{t("landing.faq.question4")}
									</h3>
									<p className="text-muted-foreground ml-7">
										{t("landing.faq.answer4")}
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Additional Investment Banner */}
				<div className="container mx-auto max-w-5xl px-4 py-4">
					{investmentBanners.length > 1 && (
						<div className="flex justify-center mb-6">
							<AffiliateBanner banner={investmentBanners[1]} />
						</div>
					)}
				</div>

				<section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/5 dark:to-background">
					<div className="container mx-auto max-w-5xl text-center">
						<h2 className="text-2xl md:text-4xl font-bold mb-6">
							{t("landing.finalCta.title")}
						</h2>
						<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
							{t("landing.finalCta.subtitle")}
						</p>
						<Button
							size="lg"
							className="bg-primary hover:bg-primary/90 transition-colors"
							onClick={handleCTAClick}
						>
							{t("landing.finalCta.buttonText")}
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</div>
				</section>
			</div>
		</>
	);
};

export default LandingPage;
