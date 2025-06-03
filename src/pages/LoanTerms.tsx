
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, Search, Home, InfoIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/use-mobile';

const LoanTerms: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const terms = [
    {
      id: 'interest-rate',
      title: 'Korko',
      content: 'Korko on hinta, jonka maksat rahan lainaamisesta. Se ilmaistaan prosentteina vuodessa ja vaikuttaa merkittävästi lainan kokonaiskustannuksiin.'
    },
    {
      id: 'annuity',
      title: 'Annuiteetti',
      content: 'Annuiteetti on tasaerälaina, jossa kuukausierä pysyy samana koko laina-ajan. Alkuvaiheessa suurempi osa erästä menee korkoihin ja loppuvaiheessa pääomaan.'
    },
    {
      id: 'principal',
      title: 'Pääoma',
      content: 'Pääoma on alkuperäinen lainasumma, jonka olet lainannut. Kuukausierissäsi osa menee pääoman lyhennykseen ja osa korkoihin.'
    },
    {
      id: 'euribor',
      title: 'Euribor',
      content: 'Euribor on eurooppalainen pankkien välinen viitekorko, johon monet vaihtuvakorkoisen lainat perustuvat. Lainakorko muodostuu Euriborista plus pankin marginaalista.'
    },
    {
      id: 'total-interest',
      title: 'Kokonaiskorko',
      content: 'Kokonaiskorko on kaikkien laina-aikana maksamiesi korkojen summa. Se riippuu lainan määrästä, korosta ja maksuajasta.'
    },
    {
      id: 'term-years',
      title: 'Laina-aika',
      content: 'Laina-aika on ajanjakso, jonka kuluessa laina maksetaan takaisin. Pidempi laina-aika tarkoittaa pienempiä kuukauseriä mutta suurempia kokonaiskorkoja.'
    },
    {
      id: 'equal-principal',
      title: 'Tasalyhennys',
      content: 'Tasalyhennyksessä pääoman lyhennys on joka kuukausi sama, mutta kokonaiserä pienenee ajan myötä korkojen vähentyessä.'
    },
    {
      id: 'fixed-installment',
      title: 'Kiinteä erä',
      content: 'Kiinteässä erässä kuukausierä pysyy samana koko laina-ajan. Tämä helpottaa talouden suunnittelua ja budjetointia.'
    }
  ];

  const filteredTerms = terms.filter(term => 
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": terms.map(term => ({
      "@type": "Question",
      "name": term.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": term.content
      }
    }))
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Lainaehdot ja rahoitustermit | Velkavapaus.fi</title>
        <meta name="description" content="Ymmärrä rahoitustermejä kuten korko ja annuiteetti selkeällä kielellä. Opi mitä tarkoittaa Euribor, kuinka lainan pääoma toimii ja paljon muuta." />
        <meta name="keywords" content="lainaehdot, korko, annuiteetti, euribor, lainan pääoma, lainan maksuaika, tasalyhennys, tasaerä" />
        
        {/* Canonical link */}
        <link rel="canonical" href="https://velkavapaus.fi/terms" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Lainaehdot ja rahoitustermit | Velkavapaus.fi" />
        <meta property="og:description" content="Ymmärrä rahoitustermejä kuten korko ja annuiteetti selkeällä kielellä. Opi mitä tarkoittaa Euribor, kuinka lainan pääoma toimii ja paljon muuta." />
        <meta property="og:url" content="https://velkavapaus.fi/terms" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://velkavapaus.fi/og-image.png" />
        
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Lainaehdot ja rahoitustermit",
              "description": "Ymmärrä rahoitustermejä kuten korko ja annuiteetti selkeällä kielellä.",
              "url": "https://velkavapaus.fi/terms",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Etusivu",
                    "item": "https://velkavapaus.fi"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Lainaehdot",
                    "item": "https://velkavapaus.fi/terms"
                  }
                ]
              }
            }
          `}
        </script>
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)}
              aria-label="Takaisin"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Lainaehdot ja rahoitustermit</h1>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Tutustu tärkeimpiin rahoitustermeihin ja ymmärrä paremmin lainojesi ehtoja. <span className="font-medium">Rahoitusterminologian ymmärtäminen auttaa sinua tekemään parempia päätöksiä</span> lainoistasi.
              </p>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <Link to="/" className="inline-flex items-center text-primary hover:underline">
                  <Home className="h-3 w-3 mr-1" />
                  Lainat
                </Link>
                <span>•</span>
                <Link to="/terms#interest-rate" className="text-primary hover:underline">
                  Korko
                </Link>
                <span>•</span>
                <Link to="/terms#euribor" className="text-primary hover:underline">
                  Euribor
                </Link>
              </div>

              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Etsi termejä..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredTerms.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {filteredTerms.map(term => (
              <AccordionItem key={term.id} value={term.id} id={term.id} className="border rounded-md px-4 mb-2">
                <AccordionTrigger className="text-lg font-medium py-4">
                  <div className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-2 text-primary" />
                    {term.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0">
                  <div className="prose text-muted-foreground">
                    {term.content}
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-sm text-primary">
                      <Link to="/" className="hover:underline">
                        Kokeile laskuria
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Hakusanallasi ei löytynyt tuloksia.</p>
          </div>
        )}
        
        <div className="mt-10 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-3">Liittyvät työkalut</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">Lainalaskuri</h3>
                  <p className="text-sm text-muted-foreground">Laske lainasi kuukausierä ja kokonaiskulut</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">Parhaat lainatarjoukset</h3>
                  <p className="text-sm text-muted-foreground">Vertaile eri lainanantajien tarjouksia</p>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanTerms;
