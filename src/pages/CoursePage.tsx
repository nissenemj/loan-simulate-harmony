
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import H5PContent from '@/components/course/H5PContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useLocalStorage } from '@/hooks/use-local-storage';

// Default module data structure
interface ModuleData {
  title: string;
  description: string;
  intro: string;
  contentId?: string;
  embedUrl?: string;
  height?: string;
}

interface CourseData {
  modules: {
    module1: ModuleData;
    module2: ModuleData;
    module3: ModuleData;
  }
}

const CoursePage: React.FC = () => {
  const { t } = useLanguage();
  
  // Default data from translations
  const defaultData: CourseData = {
    modules: {
      module1: {
        title: t(`course.modules.module1.title`),
        description: t(`course.modules.module1.description`),
        intro: t(`course.modules.module1.intro`),
        contentId: '',
        embedUrl: 'https://velkavapausfi.h5p.com/content/1292556501856760507/embed',
        height: '637px'
      },
      module2: {
        title: t(`course.modules.module2.title`),
        description: t(`course.modules.module2.description`),
        intro: t(`course.modules.module2.intro`),
        contentId: '43',
        embedUrl: '',
        height: '500px'
      },
      module3: {
        title: t(`course.modules.module3.title`),
        description: t(`course.modules.module3.description`),
        intro: t(`course.modules.module3.intro`),
        contentId: '44',
        embedUrl: '',
        height: '500px'
      }
    }
  };

  // Get stored course data or use defaults
  const [courseData] = useLocalStorage<CourseData>('course-data', defaultData);

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
          <TabsTrigger value="module1">{courseData.modules.module1.title}</TabsTrigger>
          <TabsTrigger value="module2">{courseData.modules.module2.title}</TabsTrigger>
          <TabsTrigger value="module3">{courseData.modules.module3.title}</TabsTrigger>
        </TabsList>

        <TabsContent value="module1" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{courseData.modules.module1.title}</CardTitle>
              <CardDescription>{courseData.modules.module1.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{courseData.modules.module1.intro}</p>
              
              <H5PContent 
                embedUrl={courseData.modules.module1.embedUrl}
                contentId={courseData.modules.module1.contentId}
                height={courseData.modules.module1.height} 
                title={courseData.modules.module1.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module2" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{courseData.modules.module2.title}</CardTitle>
              <CardDescription>{courseData.modules.module2.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{courseData.modules.module2.intro}</p>
              
              <H5PContent 
                contentId={courseData.modules.module2.contentId} 
                embedUrl={courseData.modules.module2.embedUrl}
                height={courseData.modules.module2.height}
                title={courseData.modules.module2.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module3" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{courseData.modules.module3.title}</CardTitle>
              <CardDescription>{courseData.modules.module3.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{courseData.modules.module3.intro}</p>
              
              <H5PContent 
                contentId={courseData.modules.module3.contentId}
                embedUrl={courseData.modules.module3.embedUrl} 
                height={courseData.modules.module3.height}
                title={courseData.modules.module3.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
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
