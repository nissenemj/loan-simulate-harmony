
import React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import CourseEditor from '@/components/admin/CourseEditor';

const CourseAdmin: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('course.admin.title', { fallback: 'Course Administration' })} | {t('app.title')}</title>
      </Helmet>
      
      <CourseEditor />
    </div>
  );
};

export default CourseAdmin;
