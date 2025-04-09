
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ModuleData {
  id: string;
  title: string;
  description: string;
  intro: string;
  h5pContent: {
    type: "contentId" | "embedUrl";
    value: string;
    height: string;
  };
}

interface CourseData {
  title: string;
  description: string;
  modules: Record<string, ModuleData>;
}

const CourseEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("module1");
  
  // Initial course data - in a real app, this would come from a database
  const [courseData, setCourseData] = useState<CourseData>({
    title: t('course.title'),
    description: t('course.description'),
    modules: {
      module1: {
        id: "module1",
        title: t('course.modules.module1.title'),
        description: t('course.modules.module1.description'),
        intro: t('course.modules.module1.intro'),
        h5pContent: {
          type: "embedUrl",
          value: "https://velkavapausfi.h5p.com/content/1292556501856760507/embed",
          height: "637px"
        }
      },
      module2: {
        id: "module2",
        title: t('course.modules.module2.title'),
        description: t('course.modules.module2.description'),
        intro: t('course.modules.module2.intro'),
        h5pContent: {
          type: "contentId",
          value: "43",
          height: "500px"
        }
      },
      module3: {
        id: "module3",
        title: t('course.modules.module3.title'),
        description: t('course.modules.module3.description'),
        intro: t('course.modules.module3.intro'),
        h5pContent: {
          type: "contentId",
          value: "44",
          height: "500px"
        }
      }
    }
  });

  const handleInputChange = (module: string, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: {
          ...prev.modules[module],
          [field]: value
        }
      }
    }));
  };

  const handleH5PChange = (module: string, field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: {
          ...prev.modules[module],
          h5pContent: {
            ...prev.modules[module].h5pContent,
            [field]: value
          }
        }
      }
    }));
  };

  const handleH5PTypeChange = (module: string, type: "contentId" | "embedUrl") => {
    setCourseData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: {
          ...prev.modules[module],
          h5pContent: {
            ...prev.modules[module].h5pContent,
            type,
            value: "" // Reset value when changing type
          }
        }
      }
    }));
  };

  const handleCourseDataChange = (field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    // In a real application, this would save to a database
    console.log("Saving course data:", courseData);
    
    // For demo purposes, we'll just show a success message
    toast.success(language === 'fi' ? "Kurssin tiedot tallennettu onnistuneesti" : "Course data saved successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{language === 'fi' ? "Kurssien hallinta" : "Course Management"}</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{language === 'fi' ? "Kurssitiedot" : "Course Information"}</CardTitle>
          <CardDescription>{language === 'fi' ? "Muokkaa kurssin yleisiä tietoja" : "Edit general course information"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="courseTitle">{language === 'fi' ? "Kurssin otsikko" : "Course Title"}</Label>
                <Input 
                  id="courseTitle" 
                  value={courseData.title} 
                  onChange={(e) => handleCourseDataChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="courseDescription">{language === 'fi' ? "Kurssin kuvaus" : "Course Description"}</Label>
                <Textarea 
                  id="courseDescription" 
                  value={courseData.description} 
                  onChange={(e) => handleCourseDataChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="module1">{t('course.modules.module1.title')}</TabsTrigger>
          <TabsTrigger value="module2">{t('course.modules.module2.title')}</TabsTrigger>
          <TabsTrigger value="module3">{t('course.modules.module3.title')}</TabsTrigger>
        </TabsList>

        {Object.keys(courseData.modules).map((moduleKey) => (
          <TabsContent key={moduleKey} value={moduleKey} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fi' ? "Moduulin muokkaus" : "Edit Module"}</CardTitle>
                <CardDescription>
                  {language === 'fi' 
                    ? `Muokkaa moduulin "${courseData.modules[moduleKey].title}" sisältöä` 
                    : `Edit content for module "${courseData.modules[moduleKey].title}"`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`${moduleKey}-title`}>{language === 'fi' ? "Otsikko" : "Title"}</Label>
                    <Input 
                      id={`${moduleKey}-title`} 
                      value={courseData.modules[moduleKey].title} 
                      onChange={(e) => handleInputChange(moduleKey, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${moduleKey}-description`}>{language === 'fi' ? "Kuvaus" : "Description"}</Label>
                    <Input 
                      id={`${moduleKey}-description`} 
                      value={courseData.modules[moduleKey].description} 
                      onChange={(e) => handleInputChange(moduleKey, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${moduleKey}-intro`}>{language === 'fi' ? "Johdanto" : "Introduction"}</Label>
                    <Textarea 
                      id={`${moduleKey}-intro`} 
                      value={courseData.modules[moduleKey].intro} 
                      onChange={(e) => handleInputChange(moduleKey, "intro", e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">{language === 'fi' ? "H5P Sisältö" : "H5P Content"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>{language === 'fi' ? "Sisältötyyppi" : "Content Type"}</Label>
                        <div className="flex space-x-4 mt-2">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id={`${moduleKey}-contentId`} 
                              name={`${moduleKey}-h5pType`} 
                              value="contentId" 
                              checked={courseData.modules[moduleKey].h5pContent.type === "contentId"} 
                              onChange={() => handleH5PTypeChange(moduleKey, "contentId")}
                              className="mr-2"
                            />
                            <Label htmlFor={`${moduleKey}-contentId`}>Content ID</Label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id={`${moduleKey}-embedUrl`} 
                              name={`${moduleKey}-h5pType`} 
                              value="embedUrl" 
                              checked={courseData.modules[moduleKey].h5pContent.type === "embedUrl"} 
                              onChange={() => handleH5PTypeChange(moduleKey, "embedUrl")}
                              className="mr-2"
                            />
                            <Label htmlFor={`${moduleKey}-embedUrl`}>Embed URL</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`${moduleKey}-h5pHeight`}>{language === 'fi' ? "Korkeus" : "Height"}</Label>
                        <Input 
                          id={`${moduleKey}-h5pHeight`} 
                          value={courseData.modules[moduleKey].h5pContent.height} 
                          onChange={(e) => handleH5PChange(moduleKey, "height", e.target.value)}
                          placeholder="e.g., 500px"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`${moduleKey}-h5pValue`}>
                        {courseData.modules[moduleKey].h5pContent.type === "contentId" 
                          ? "Content ID" 
                          : (language === 'fi' ? "Upotus-URL" : "Embed URL")}
                      </Label>
                      <Input 
                        id={`${moduleKey}-h5pValue`} 
                        value={courseData.modules[moduleKey].h5pContent.value} 
                        onChange={(e) => handleH5PChange(moduleKey, "value", e.target.value)}
                        placeholder={courseData.modules[moduleKey].h5pContent.type === "contentId" 
                          ? "e.g., 42" 
                          : "e.g., https://velkavapausfi.h5p.com/content/1292556501856760507/embed"}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>
          {language === 'fi' ? "Tallenna muutokset" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default CourseEditor;
