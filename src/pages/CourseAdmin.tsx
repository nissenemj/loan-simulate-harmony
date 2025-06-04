
import React from 'react';
import { Helmet } from "react-helmet-async";
import CourseEditor from '@/components/admin/CourseEditor';

const CourseAdmin: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Kurssin hallinta | Velkavapaus</title>
      </Helmet>
      
      <CourseEditor />
    </div>
  );
};

export default CourseAdmin;
