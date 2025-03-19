import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/NavigationHeader";
import {
  HandCoins,
  LineChart,
  SmilePlus,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Clipboard,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AffiliateLink } from "@/utils/affiliateData";
import AffiliateSection from "@/components/affiliate/AffiliateSection";

const LandingPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Fictional testimonials
  const testimonials = [
    {
      id: 1,
      name: "Anna, Helsinki",
      text: t("landing.testimonial1"),
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Mikko, Tampere",
      text: t("landing.testimonial2"),
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Laura, Turku",
      text: t("landing.testimonial3"),
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop",
    },
  ];

  // FAQ items
  const faqItems = [
    {
      id: 1,
      question: t("landing.faq.question1"),
      answer: t("landing.faq.answer1"),
    },
    {
      id: 2,
      question: t("landing.faq.question2"),
      answer: t("landing.faq.answer2"),
    },
    {
      id: 3,
      question: t("landing.faq.question3"),
      answer: t("landing.faq.answer3"),
    },
    {
      id: 4,
      question: t("landing.faq.question4"),
      answer: t("landing.faq.answer4"),
    },
  ];

  // Handler for CTA buttons
  const handleCTAClick = () => {
    navigate("/auth");
  };

  return (
    <>
      <Helmet>
        <title>{t("landing.seo.title")}</title>
        <meta name="description" content={t("landing.seo.description")} />
        <meta name="keywords" content={t("landing.seo.keywords")} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Loan Simulate Harmony",
              "url": "https://loansimulateharmony.fi",
              "description": "${t("landing.seo.description")}",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${faqItems.map(
                  (item) => `{
                  "@type": "Question",
                  "name": "${item.question}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${item.answer}"
                  }
                }`
                )}
              ]
            }
          `}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-background to-accent min-h-screen">
        <NavigationHeader />
        
        {/* Hero Section */}
        <section className="pt-10 pb-16 px-4 md:pt-16 md:pb-20">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {t("landing.hero.headline")}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                  {t("landing.hero.subheadline")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 transition-colors"
                    onClick={handleCTAClick}
                  >
                    {t("landing.hero.cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/terms")}
                  >
                    {t("landing.hero.secondaryCta")}
                  </Button>
                </div>
              </div>
              <div className="rounded-lg shadow-xl overflow-hidden hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
                  alt={t("landing.hero.imageAlt")}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {t("landing.benefits.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
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

              <Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
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

              <Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
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

        {/* Repayment Methods Section */}
        <section className="py-16 bg-accent/50">
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
                            <span>{t("landing.methods.avalanche.benefit1")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{t("landing.methods.avalanche.benefit2")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{t("landing.methods.avalanche.benefit3")}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
                          alt={t("landing.methods.avalanche.imageAlt")}
                          className="w-full h-auto"
                          loading="lazy"
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
                            <span>{t("landing.methods.snowball.benefit1")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{t("landing.methods.snowball.benefit2")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{t("landing.methods.snowball.benefit3")}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
                          alt={t("landing.methods.snowball.imageAlt")}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Affiliate Marketing Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              {t("landing.affiliate.title")}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t("landing.affiliate.subtitle")}
            </p>

            <AffiliateSection />

            <p className="text-sm text-muted-foreground text-center mt-8">
              {t("landing.affiliate.disclaimer")}
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {t("landing.testimonials.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={testimonial.img}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-muted-foreground italic">
                        "{testimonial.text}"
                      </p>
                      <p className="font-semibold">{testimonial.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {t("landing.faq.title")}
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {faqItems.map((item) => (
                <Card key={item.id} className="border shadow">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-start">
                      <HelpCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground ml-7">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
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

        {/* Footer */}
        <footer className="py-8 bg-accent/80 border-t">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">
                  {t("landing.footer.about.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.footer.about.description")}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">
                  {t("landing.footer.links.title")}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate("/")}
                    >
                      {t("landing.footer.links.item1")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate("/terms")}
                    >
                      {t("landing.footer.links.item2")}
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate("/debt-summary")}
                    >
                      {t("landing.footer.links.item3")}
                    </Button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">
                  {t("landing.footer.legal.title")}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" className="p-0 h-auto">
                      {t("landing.footer.legal.privacy")}
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0 h-auto">
                      {t("landing.footer.legal.terms")}
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0 h-auto">
                      {t("landing.footer.legal.cookies")}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Loan Simulate Harmony. {t("landing.footer.copyright")}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
