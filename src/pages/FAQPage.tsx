import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import NewsletterSignup from "@/components/NewsletterSignup";

const FAQPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Define FAQ categories
  const categories = [
    { id: "general", label: t("faq.categories.general") },
    { id: "calculator", label: t("faq.categories.calculator") },
    { id: "strategies", label: t("faq.categories.strategies") },
    { id: "account", label: t("faq.categories.account") }
  ];
  
  // Define FAQ questions by category
  const faqQuestions = {
    general: [
      { id: "howItWorks", question: t("faq.questions.howItWorks.question"), answer: t("faq.questions.howItWorks.answer") },
      { id: "isFree", question: t("faq.questions.isFree.question"), answer: t("faq.questions.isFree.answer") },
      { id: "studentLoans", question: t("faq.questions.studentLoans.question"), answer: t("faq.questions.studentLoans.answer") },
      { id: "dataPrivacy", question: t("faq.questions.dataPrivacy.question"), answer: t("faq.questions.dataPrivacy.answer") }
    ],
    calculator: [
      { id: "calculationAccuracy", question: t("faq.questions.calculationAccuracy.question"), answer: t("faq.questions.calculationAccuracy.answer") },
      { id: "extraPayments", question: t("faq.questions.extraPayments.question"), answer: t("faq.questions.extraPayments.answer") }
    ],
    strategies: [
      { id: "avalancheVsSnowball", question: t("faq.questions.avalancheVsSnowball.question"), answer: t("faq.questions.avalancheVsSnowball.answer") },
      { id: "bestStrategy", question: t("faq.questions.bestStrategy.question"), answer: t("faq.questions.bestStrategy.answer") }
    ],
    account: [
      { id: "saveData", question: t("faq.questions.saveData.question"), answer: t("faq.questions.saveData.answer") },
      { id: "deleteAccount", question: t("faq.questions.deleteAccount.question"), answer: t("faq.questions.deleteAccount.answer") }
    ]
  };
  
  // Filter questions based on search term
  const filteredQuestions = searchTerm.trim() === "" 
    ? faqQuestions 
    : Object.keys(faqQuestions).reduce((acc, category) => {
        acc[category] = faqQuestions[category].filter(
          q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return acc;
      }, {} as typeof faqQuestions);
  
  // Check if there are any results after filtering
  const hasResults = Object.values(filteredQuestions).some(category => category.length > 0);
  
  // Generate structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Object.values(faqQuestions)
      .flat()
      .map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
  };
  
  return (
    <>
      <Helmet>
        <title>{t("faq.pageTitle")} | {t("app.name")}</title>
        <meta name="description" content={t("faq.metaDescription")} />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <BreadcrumbNav />
        
        <h1 className="text-3xl font-bold mb-6">{t("faq.title")}</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t("faq.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {searchTerm.trim() === "" ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqQuestions[category.id].map((faq, index) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="space-y-6">
            {hasResults ? (
              Object.keys(filteredQuestions).map(category => 
                filteredQuestions[category].length > 0 && (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{categories.find(c => c.id === category)?.label}</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredQuestions[category].map(faq => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-start gap-3">
                              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-8 text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              )
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p>{t("faq.noResults")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
};

export default FAQPage;
