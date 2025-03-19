
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LoanTerms: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
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
          <p className="text-muted-foreground mb-4">{t('loanTerms.introduction')}</p>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('loanTerms.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {filteredTerms.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {filteredTerms.map(term => (
            <AccordionItem key={term.id} value={term.id} className="border rounded-md px-4 mb-2">
              <AccordionTrigger className="text-lg font-medium py-4">
                {term.title}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <div className="prose text-muted-foreground">
                  {term.content}
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
    </div>
  );
};

export default LoanTerms;
