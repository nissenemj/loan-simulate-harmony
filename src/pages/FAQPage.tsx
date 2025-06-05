
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "Miten velkalaskuri toimii?",
      answer: "Velkalaskuri analysoi velkatilanteesi ja laskee optimaalisen takaisinmaksusuunnitelman eri strategioilla."
    },
    {
      question: "Ovatko tietoni turvassa?",
      answer: "Kyllä, kaikki tiedot tallennetaan turvallisesti ja niitä käsitellään luottamuksellisesti."
    },
    {
      question: "Voiko laskuri auttaa kaikenlaisissa velkatilanteissa?",
      answer: "Laskuri sopii useimpiin velkatilanteisiin, mukaan lukien lainat ja luottokorttivelat."
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Usein kysytyt kysymykset | Velkavapaus.fi</title>
        <meta name="description" content="Vastauksia yleisimpiin kysymyksiin velkalaskurin käytöstä" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Usein kysytyt kysymykset</h1>
          <p className="text-xl text-muted-foreground">
            Vastauksia yleisimpiin kysymyksiin velkalaskurin käytöstä
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kysymykset ja vastaukset</CardTitle>
            <CardDescription>Löydä vastauksia yleisimpiin kysymyksiin</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
