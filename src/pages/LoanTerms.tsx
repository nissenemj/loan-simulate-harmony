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
        <title>{t('loanTerms.pageTitle')} | Loan Calculator</title>
        <meta name="description" content="Understand financial terms like interest rate and annuity in plain English. Learn what Euribor means, how loan principal works, and more." />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
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
                  What is interest rate?
                </Link>
                <span>•</span>
                <Link to="/terms#euribor" className="text-primary hover:underline">
                  Euribor explained
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
                        Try our calculator to see how this affects your loan →
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
          <h2 className="text-xl font-semibold mb-3">Related Financial Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">Loan Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate your loan payments with various repayment methods</p>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/" className="block">
                  <h3 className="font-medium">Find the Best Loan Offers</h3>
                  <p className="text-sm text-muted-foreground">Compare mortgage rates and loan options from trusted providers</p>
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
