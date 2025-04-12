
import React from 'react';
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>About | {t('app.title')}</title>
        <meta name="description" content="About our service" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-lg">Learn more about our mission and team</p>
      </div>

      <div className="prose max-w-none dark:prose-invert">
        <p>Welcome to our about page. This is where you can learn more about our organization and mission.</p>
        <p>Our team is dedicated to providing valuable resources and tools to help people manage their finances better.</p>
      </div>
    </div>
  );
};

export default AboutPage;
