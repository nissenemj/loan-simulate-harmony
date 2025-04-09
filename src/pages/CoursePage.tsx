
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import H5PContent from '@/components/course/H5PContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CoursePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('course.title')} | {t('app.title')}</title>
        <meta name="description" content={t('course.description')} />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('course.title')}</h1>
        <p className="text-lg">{t('course.description')}</p>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>{t('course.howToUseTitle')}</AlertTitle>
        <AlertDescription>{t('course.howToUseDescription')}</AlertDescription>
      </Alert>

      <Tabs defaultValue="module1" className="mb-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="module1">{t('course.modules.module1.title')}</TabsTrigger>
          <TabsTrigger value="module2">{t('course.modules.module2.title')}</TabsTrigger>
          <TabsTrigger value="module3">{t('course.modules.module3.title')}</TabsTrigger>
        </TabsList>

        <TabsContent value="module1" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('course.modules.module1.title')}</CardTitle>
              <CardDescription>{t('course.modules.module1.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('course.modules.module1.intro')}</p>
              
              {/* Using the specific H5P content for Module 1 with added padding */}
              <H5PContent 
                embedUrl="https://velkavapausfi.h5p.com/content/1292556501856760507/embed"
                height="637px" 
                title="Moduuli 1: Henkilökohtaisen talouden hallinta"
                className="p-4 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module2" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('course.modules.module2.title')}</CardTitle>
              <CardDescription>{t('course.modules.module2.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('course.modules.module2.intro')}</p>
              
              {/* Example H5P content - replace with actual content when available */}
              <H5PContent 
                contentId="43" 
                height="500px" 
                title={t('course.modules.module2.title')}
                className="p-4 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module3" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('course.modules.module3.title')}</CardTitle>
              <CardDescription>{t('course.modules.module3.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('course.modules.module3.intro')}</p>
              
              {/* Example H5P content - replace with actual content when available */}
              <H5PContent 
                contentId="44" 
                height="500px" 
                title={t('course.modules.module3.title')}
                className="p-4 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4">{t('course.furtherLearning')}</h2>
        <p className="mb-4">{t('course.furtherLearningDescription')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Add some related resources or links here */}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
