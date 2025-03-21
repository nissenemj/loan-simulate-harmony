import React, { useEffect } from "react";
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
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import UserGuidanceSection from "@/components/UserGuidanceSection";
import AdSenseBanner from "@/components/AdSenseBanner";
import { affiliateBanners } from "@/utils/affiliateData";
import AffiliateBanner from "@/components/affiliate/AffiliateBanner";

const LandingPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Current language:", language);
    console.log("Hero headline translation:", t("landing.hero.headline"));
  }, [language, t]);

  const getTranslatedText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const testimonials = [
    {
      id: 1,
      name: "Anna, Helsinki",
      text: getTranslatedText("landing.testimonial1", "Tämä sovellus auttoi minua maksamaan 5 000 € velkaa vain vuodessa! Visualisointi piti minut motivoituneena."),
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Mikko, Tampere",
      text: getTranslatedText("landing.testimonial2", "Olen kokeillut monia budjetointisovelluksia, mutta tämä on ainoa, joka todella auttoi luomaan realistisen velanmaksusuunnitelman."),
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Laura, Turku",
      text: getTranslatedText("landing.testimonial3", "Velkalumipallomenetelmä muutti elämäni. Olen jo maksanut kolme luottokorttia ja olen matkalla velattomaksi ensi vuoteen mennessä!"),
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop",
    },
  ];

  const faqItems = [
    {
      id: 1,
      question: getTranslatedText("landing.faq.question1", "Miten sovellus toimii?"),
      answer: getTranslatedText("landing.faq.answer1", "Syötä velkasi, mukaan lukien lainan määrät, korot ja vähimmäismaksut. Sovellus laskee optimaalisen takaisinmaksusuunnitelman valitsemasi menetelmän (lumivyöry tai lumipallo) perusteella ja näyttää, milloin olet velaton."),
    },
    {
      id: 2,
      question: getTranslatedText("landing.faq.question2", "Onko sovelluksen käyttö ilmaista?"),
      answer: getTranslatedText("landing.faq.answer2", "Kyllä! Laina Simulaattori on täysin ilmainen käyttää. Uskomme, että kaikilla tulisi olla pääsy työkaluihin, jotka auttavat parantamaan taloudellista tilannettaan."),
    },
    {
      id: 3,
      question: getTranslatedText("landing.faq.question3", "Voinko käyttää sovellusta opintolainoihin?"),
      answer: getTranslatedText("landing.faq.answer3", "Ehdottomasti! Sovellus toimii minkä tahansa tyyppisen lainan kanssa, mukaan lukien opintolainat, luottokortit, henkilökohtaiset lainat, autolainat ja asuntolainat."),
    },
    {
      id: 4,
      question: getTranslatedText("landing.faq.question4", "Mikä on lumivyöry- ja lumipallomenetelmien ero?"),
      answer: getTranslatedText("landing.faq.answer4", "Lumivyörymenetelmässä priorisoidaan korkeakorkoisten velkojen maksaminen ensin säästääksesi eniten korkokuluissa. Lumipallomenetelmässä keskitytään pienimpien velkojen maksamiseen ensin, mikä luo momentin ja motivaation."),
    },
  ];

  const handleCTAClick = () => {
    navigate("/auth");
  };

  const investmentBanners = affiliateBanners.filter(banner => banner.category === 'investment');
  const loanBanners = affiliateBanners.filter(banner => banner.category === 'loan');

  return (
    <>
      <Helmet>
        <title>{getTranslatedText("landing.seo.title", "Velkavapaus.fi – Tie velattomaan elämään | Laina Simulaattori")}</title>
        <meta name="description" content={getTranslatedText("landing.seo.description", "Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!")} />
        <meta name="keywords" content={getTranslatedText("landing.seo.keywords", "velanmaksu, lainahallinta, taloustyökalut, velkalumipallovaikutus, velkavyörymetodi, taloudellinen vapaus, velaton")} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://velkavapaus.fi" />
        <meta property="og:title" content={getTranslatedText("landing.seo.title", "Velkavapaus.fi – Tie velattomaan elämään | Laina Simulaattori")} />
        <meta property="og:description" content={getTranslatedText("landing.seo.description", "Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!")} />
        <meta property="og:image" content="https://velkavapaus.fi/og-image.png" />
        <meta property="og:site_name" content="Velkavapaus.fi" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getTranslatedText("landing.seo.title", "Velkavapaus.fi – Tie velattomaan elämään | Laina Simulaattori")} />
        <meta name="twitter:description" content={getTranslatedText("landing.seo.description", "Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!")} />
        <meta name="twitter:image" content="https://velkavapaus.fi/og-image.png" />
        
        <link rel="canonical" href="https://velkavapaus.fi" />
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Velkavapaus.fi",
              "url": "https://velkavapaus.fi",
              "description": "${getTranslatedText("landing.seo.description", "Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!")}",
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
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Velkavapaus.fi",
              "url": "https://velkavapaus.fi",
              "description": "${getTranslatedText("landing.seo.description", "Luo ilmainen velanmaksusuunnitelma ja ota hallinta taloudestasi Velkavapaus.fi:n avulla. Aloita velaton matkasi tänään!")}",
              "serviceType": "Debt Management",
              "areaServed": {
                "@type": "Country",
                "name": "Finland"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "People with debt concerns"
              },
              "availableLanguage": [
                {
                  "@type": "Language",
                  "name": "Finnish"
                },
                {
                  "@type": "Language",
                  "name": "English"
                }
              ]
            }
          `}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-background to-accent min-h-screen">
        <NavigationHeader />
        
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
                {!user ? (
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
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 transition-colors"
                      onClick={() => navigate("/dashboard")}
                    >
                      {t("landing.hero.loggedInCta")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate("/blog")}
                    >
                      {t("landing.hero.blogCta")}
                    </Button>
                  </div>
                )}
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

        {user && <UserGuidanceSection />}

        {/* Investment Banner Section */}
        <div className="container mx-auto max-w-5xl px-4 py-4">
          {investmentBanners.length > 0 && (
            <div className="flex justify-center mb-6">
              <AffiliateBanner banner={investmentBanners[0]} />
            </div>
          )}
        </div>

        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {getTranslatedText("landing.benefits.title", "Ota hallinta taloudellisesta tulevaisuudestasi")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <HandCoins className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {getTranslatedText("landing.benefits.item1.title", "Personoitu takaisinmaksusuunnitelma")}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText("landing.benefits.item1.description", "Luo räätälöity velanmaksusuunnitelma käyttäen lumivyöry- tai lumipallomenetelmää.")}
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
                      {getTranslatedText("landing.benefits.item2.title", "Seuraa edistymistäsi")}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText("landing.benefits.item2.description", "Visualisoi edistymistäsi interaktiivisella aikajanalla ja pysy motivoituneena.")}
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
                      {getTranslatedText("landing.benefits.item3.title", "Vähennä taloudellista stressiä")}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText("landing.benefits.item3.description", "Saavuta taloudellinen vapaus nopeammin ja vähennä taloudellista stressiäsi.")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              {getTranslatedText("landing.methods.title", "Valitse velanmaksustrategiasi")}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {getTranslatedText("landing.methods.subtitle", "Eri menetelmät toimivat eri ihmisille. Löydä mikä toimii sinulle.")}
            </p>

            <Tabs defaultValue="avalanche" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="avalanche">
                  {getTranslatedText("landing.methods.avalanche.title", "Velkavyöry")}
                </TabsTrigger>
                <TabsTrigger value="snowball">
                  {getTranslatedText("landing.methods.snowball.title", "Velkalumipalllo")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="avalanche" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          {getTranslatedText("landing.methods.avalanche.title", "Velkavyöry")}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {getTranslatedText("landing.methods.avalanche.description", "Velkavyörymenetelmä keskittyy maksamaan korkeakorkoisimmat velat ensin ja tekemään vähimmäismaksut muille veloille.")}
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.avalanche.benefit1", "Matemaattisesti optimaalinen - säästää eniten korkokuluja")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.avalanche.benefit2", "Vähentää kokonaismaksuaikaa")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.avalanche.benefit3", "Paras niille, joita motivoi pitkän aikavälin säästöt")}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
                          alt={getTranslatedText("landing.methods.avalanche.imageAlt", "Kaavio, joka näyttää korkomaksujen vähentymisen ajan myötä")}
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
                          {getTranslatedText("landing.methods.snowball.title", "Velkalumipalllo")}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {getTranslatedText("landing.methods.snowball.description", "Velkalumipalllo-menetelmä keskittyy maksamaan pienimmät velat ensin momentin ja motivaation luomiseksi.")}
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.snowball.benefit1", "Luo varhaisia voittoja motivaation rakentamiseksi")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.snowball.benefit2", "Yksinkertaistaa taloutta vähentämällä maksujen määrää")}</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <span>{getTranslatedText("landing.methods.snowball.benefit3", "Paras niille, jotka tarvitsevat psykologisia voittoja")}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"
                          alt={getTranslatedText("landing.methods.snowball.imageAlt", "Kolikkojen kasa, joka kasvaa suuremmaksi kuvaten lumipallovaikutusta")}
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

        {/* Loan Banner Section */}
        <div className="container mx-auto max-w-5xl px-4 py-4">
          {loanBanners.length > 0 && (
            <div className="flex justify-center mb-6">
              <AffiliateBanner banner={loanBanners[0]} />
            </div>
          )}
        </div>

        <section className="py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {getTranslatedText("landing.faq.title", "Usein kysytyt kysymykset")}
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

        {/* Additional Investment Banner */}
        <div className="container mx-auto max-w-5xl px-4 py-4">
          {investmentBanners.length > 1 && (
            <div className="flex justify-center mb-6">
              <AffiliateBanner banner={investmentBanners[1]} />
            </div>
          )}
        </div>

        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              {getTranslatedText("landing.finalCta.title", "Aloita velaton matkasi tänään")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {getTranslatedText("landing.finalCta.subtitle", "Liity tuhansien käyttäjien joukkoon, jotka ovat jo ottaneet taloudellisen tulevaisuutensa haltuun.")}
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-colors"
              onClick={handleCTAClick}
            >
              {getTranslatedText("landing.finalCta.buttonText", "Rekisteröidy nyt - Se on ilmaista")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
