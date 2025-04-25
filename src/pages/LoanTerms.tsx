
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
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LoanTerms: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const terms = [
    {
      id: 'interest-rate',
      title: t('loanTerms.interestRate.title'),
      content: t('loanTerms.interestRate.description')
    },
    {
      id: 'annuity',
      title: t('loanTerms.annuity.title'),
      content: t('loanTerms.annuity.description')
    },
    {
      id: 'principal',
      title: t('loanTerms.principal.title'),
      content: t('loanTerms.principal.description')
    },
    {
      id: 'euribor',
      title: t('loanTerms.euribor.title'),
      content: t('loanTerms.euribor.description')
    },
    {
      id: 'total-interest',
      title: t('loanTerms.totalInterest.title'),
      content: t('loanTerms.totalInterest.description')
    },
    {
      id: 'term-years',
      title: t('loanTerms.termYears.title'),
      content: t('loanTerms.termYears.description')
    },
    {
      id: 'equal-principal',
      title: t('loanTerms.equalPrincipal.title'),
      content: t('loanTerms.equalPrincipal.description')
    },
    {
      id: 'fixed-installment',
      title: t('loanTerms.fixedInstallment.title'),
      content: t('loanTerms.fixedInstallment.description')
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
        <title>{t('loanTerms.pageTitle')} | Velkavapaus.fi</title>
        <meta name="description" content="Ymmärrä rahoitustermejä kuten korko ja annuiteetti selkeällä kielellä. Opi mitä tarkoittaa Euribor, kuinka lainan pääoma toimii ja paljon muuta." />
        <meta name="keywords" content="lainaehdot, korko, annuiteetti, euribor, lainan pääoma, lainan maksuaika, tasalyhennys, tasaerä" />
        
        {/* Canonical link */}
        <link rel="canonical" href="https://velkavapaus.fi/terms" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${t('loanTerms.pageTitle')} | Velkavapaus.fi`} />
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
              "name": "${t('loanTerms.pageTitle')}",
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
                    "name": "${t('loanTerms.pageTitle')}",
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
              aria-label={t('loanTerms.backButton')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">{t('loanTerms.pageTitle')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                {t('loanTerms.introduction')} <span className="font-medium">Understanding financial terminology helps you make better decisions</span> about your loans.
              </p>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <Link to="/" className="inline-flex items-center text-primary hover:underline">
                  <Home className="h-3 w-3 mr-1" />
                  {t('tabs.loans')}
                </Link>
                <span>•</span>
                <Link to="/terms#interest-rate" className="text-primary hover:underline">
                  {t('loanTerms.interestRate.title')}
                </Link>
                <span>•</span>
                <Link to="/terms#euribor" className="text-primary hover:underline">
                  {t('loanTerms.euribor.title')}
                </Link>
              </div>

              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('loanTerms.searchPlaceholder')}
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
                        {t('loanTerms.tryCalculator')}
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">{t('loanTerms.noResults')}</p>
          </div>
        )}
        
        <div className="mt-10 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-3">{t('loanTerms.relatedTools')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">{t('loanTerms.loanCalculator')}</h3>
                  <p className="text-sm text-muted-foreground">{t('loanTerms.loanCalculatorDesc')}</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">{t('loanTerms.bestLoanOffers')}</h3>
                  <p className="text-sm text-muted-foreground">{t('loanTerms.bestLoanOffersDesc')}</p>
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
