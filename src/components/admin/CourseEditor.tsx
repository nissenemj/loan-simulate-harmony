
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import H5PContent from '@/components/course/H5PContent';

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

const CourseEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('module1');
  
  // Initialize with default data from translations
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

  // Use localStorage to persist course data
  const [courseData, setCourseData] = useLocalStorage<CourseData>('course-data', defaultData);
  
  // State for active module editing
  const [editModule, setEditModule] = useState<ModuleData>({...courseData.modules[activeTab as keyof typeof courseData.modules]});
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEditModule({...courseData.modules[value as keyof typeof courseData.modules]});
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditModule(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    const newCourseData = {
      ...courseData,
      modules: {
        ...courseData.modules,
        [activeTab]: editModule
      }
    };
    
    setCourseData(newCourseData);
    toast.success(t('course.admin.saveSuccess'));
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('course.admin.title')}</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="module1">{t('course.modules.module1.title')}</TabsTrigger>
          <TabsTrigger value="module2">{t('course.modules.module2.title')}</TabsTrigger>
          <TabsTrigger value="module3">{t('course.modules.module3.title')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="module1" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('course.admin.editCourseContent')}: {t('course.modules.module1.title')}</CardTitle>
              <CardDescription>{t('course.admin.moduleSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('course.modules.module1.title')}</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={editModule.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('course.modules.module1.description')}</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={editModule.description} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intro">{t('course.modules.module1.intro')}</Label>
                <Textarea 
                  id="intro" 
                  name="intro" 
                  value={editModule.intro} 
                  onChange={handleInputChange} 
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">{t('course.admin.h5pSettings')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contentId">{t('course.admin.contentId')}</Label>
                  <Input 
                    id="contentId" 
                    name="contentId" 
                    value={editModule.contentId || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 1234"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.contentIdDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="embedUrl">{t('course.admin.embedUrl')}</Label>
                  <Input 
                    id="embedUrl" 
                    name="embedUrl" 
                    value={editModule.embedUrl || ''} 
                    onChange={handleInputChange} 
                    placeholder="https://h5p.org/h5p/embed/12345"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.embedUrlDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="height">{t('course.admin.height')}</Label>
                  <Input 
                    id="height" 
                    name="height" 
                    value={editModule.height || '500px'} 
                    onChange={handleInputChange} 
                    placeholder="500px"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.heightDescription')}</p>
                </div>
              </div>
              
              <div className="pt-6">
                <Button onClick={handleSave}>{t('course.admin.save')}</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('course.modules.module1.title')} - {t('preview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <H5PContent
                contentId={editModule.contentId}
                embedUrl={editModule.embedUrl}
                height={editModule.height}
                title={editModule.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Repeat the same pattern for module2 and module3 */}
        <TabsContent value="module2" className="mt-6">
          {/* Same structure as module1 tab */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.admin.editCourseContent')}: {t('course.modules.module2.title')}</CardTitle>
              <CardDescription>{t('course.admin.moduleSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same input fields as module1 */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('course.modules.module2.title')}</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={editModule.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('course.modules.module2.description')}</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={editModule.description} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intro">{t('course.modules.module2.intro')}</Label>
                <Textarea 
                  id="intro" 
                  name="intro" 
                  value={editModule.intro} 
                  onChange={handleInputChange} 
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">{t('course.admin.h5pSettings')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contentId">{t('course.admin.contentId')}</Label>
                  <Input 
                    id="contentId" 
                    name="contentId" 
                    value={editModule.contentId || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 1234"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.contentIdDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="embedUrl">{t('course.admin.embedUrl')}</Label>
                  <Input 
                    id="embedUrl" 
                    name="embedUrl" 
                    value={editModule.embedUrl || ''} 
                    onChange={handleInputChange} 
                    placeholder="https://h5p.org/h5p/embed/12345"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.embedUrlDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="height">{t('course.admin.height')}</Label>
                  <Input 
                    id="height" 
                    name="height" 
                    value={editModule.height || '500px'} 
                    onChange={handleInputChange} 
                    placeholder="500px"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.heightDescription')}</p>
                </div>
              </div>
              
              <div className="pt-6">
                <Button onClick={handleSave}>{t('course.admin.save')}</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('course.modules.module2.title')} - {t('preview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <H5PContent
                contentId={editModule.contentId}
                embedUrl={editModule.embedUrl}
                height={editModule.height}
                title={editModule.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="module3" className="mt-6">
          {/* Same structure as module1 tab */}
          <Card>
            <CardHeader>
              <CardTitle>{t('course.admin.editCourseContent')}: {t('course.modules.module3.title')}</CardTitle>
              <CardDescription>{t('course.admin.moduleSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same input fields as module1 */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('course.modules.module3.title')}</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={editModule.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('course.modules.module3.description')}</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={editModule.description} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intro">{t('course.modules.module3.intro')}</Label>
                <Textarea 
                  id="intro" 
                  name="intro" 
                  value={editModule.intro} 
                  onChange={handleInputChange} 
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">{t('course.admin.h5pSettings')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contentId">{t('course.admin.contentId')}</Label>
                  <Input 
                    id="contentId" 
                    name="contentId" 
                    value={editModule.contentId || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 1234"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.contentIdDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="embedUrl">{t('course.admin.embedUrl')}</Label>
                  <Input 
                    id="embedUrl" 
                    name="embedUrl" 
                    value={editModule.embedUrl || ''} 
                    onChange={handleInputChange} 
                    placeholder="https://h5p.org/h5p/embed/12345"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.embedUrlDescription')}</p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="height">{t('course.admin.height')}</Label>
                  <Input 
                    id="height" 
                    name="height" 
                    value={editModule.height || '500px'} 
                    onChange={handleInputChange} 
                    placeholder="500px"
                  />
                  <p className="text-sm text-muted-foreground">{t('course.admin.heightDescription')}</p>
                </div>
              </div>
              
              <div className="pt-6">
                <Button onClick={handleSave}>{t('course.admin.save')}</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('course.modules.module3.title')} - {t('preview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <H5PContent
                contentId={editModule.contentId}
                embedUrl={editModule.embedUrl}
                height={editModule.height}
                title={editModule.title}
                className="p-6 bg-gray-50 dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseEditor;
