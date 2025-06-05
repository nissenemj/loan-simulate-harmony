import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2 } from 'lucide-react';

interface CourseSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
}

const CourseEditor: React.FC = () => {
  const [course, setCourse] = useState<Course>({
    id: '',
    title: '',
    description: '',
    sections: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [id]: value
    }));
  };

  const addSection = () => {
    const newSection: CourseSection = {
      id: Math.random().toString(36).substring(2, 15),
      title: '',
      content: '',
      order: course.sections.length + 1
    };
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: [...prevCourse.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            [field]: value
          };
        }
        return section;
      })
    }));
  };

  const deleteSection = (sectionId: string) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      sections: prevCourse.sections.filter(section => section.id !== sectionId)
    }));
  };

  const saveCourse = () => {
    // Implement save logic here (e.g., API call)
    alert('Course saved!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kurssin muokkaus</CardTitle>
          <CardDescription>Luo ja muokkaa kurssisisältöä</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Kurssin nimi</Label>
            <Input
              id="title"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              placeholder="Syötä kurssin nimi"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Kuvaus</Label>
            <Textarea
              id="description"
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              placeholder="Syötä kurssin kuvaus"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={saveCourse}>
              <Save className="h-4 w-4 mr-2" />
              Tallenna kurssi
            </Button>
            <Button variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Lisää osio
            </Button>
          </div>
        </CardContent>
      </Card>

      {course.sections.map(section => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>Osio {section.order}</CardTitle>
            <CardDescription>Muokkaa osion sisältöä</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`section-title-${section.id}`}>Otsikko</Label>
              <Input
                id={`section-title-${section.id}`}
                value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                placeholder="Syötä osion otsikko"
              />
            </div>
            <div>
              <Label htmlFor={`section-content-${section.id}`}>Sisältö</Label>
              <Textarea
                id={`section-content-${section.id}`}
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                placeholder="Syötä osion sisältö"
                rows={5}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteSection(section.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Poista osio
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseEditor;
