
import React from 'react';
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('aboutUs.title')} | {t('app.title')}</title>
        <meta name="description" content={t('footer.about.mission')} />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('aboutUs.title')}</h1>
        <p className="text-lg">{t('aboutUs.subtitle')}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose max-w-none dark:prose-invert">
            {t('aboutUs.content').split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold mb-4">{t('footer.about.title')}</h2>
        <p className="mb-4">{t('footer.about.description')}</p>
        <p className="text-primary font-medium">{t('footer.about.mission')}</p>
      </div>
    </div>
  );
};

export default AboutPage;
