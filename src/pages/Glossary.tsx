
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const financialTerms = {
  en: [
    {
      term: "Interest Rate",
      definition: "The percentage charged by a lender for borrowing money."
    },
    {
      term: "Principal",
      definition: "The original amount of money borrowed before interest."
    },
    // Add more financial terms
  ],
  fi: [
    {
      term: "Korko",
      definition: "Prosenttiosuus, jonka lainanantaja veloittaa lainasta."
    },
    {
      term: "Pääoma",
      definition: "Alkuperäinen lainattu rahamäärä ennen korkoja."
    },
    // Add more financial terms
  ]
};

const Glossary: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const terms = financialTerms[language];
  const filteredTerms = terms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Helmet>
        <title>{t('navigation.glossary')} | {t('app.title')}</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t('navigation.glossary')}</h1>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTerms.length > 0 ? (
        <div className="space-y-4">
          {filteredTerms.map((term, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{term.term}</h3>
                <p className="text-muted-foreground">{term.definition}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          {t('common.noResults')}
        </p>
      )}
    </div>
  );
};

export default Glossary;
