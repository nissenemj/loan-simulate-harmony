
import React from 'react';
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FileStorage from '@/components/admin/FileStorage';

const FileStoragePage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>File Storage | {t('app.title')}</title>
        <meta name="description" content="Manage file uploads and storage" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">File Storage</h1>
        <p className="text-lg">Upload and manage files to share on your website</p>
      </div>

      <FileStorage />
    </div>
  );
};

export default FileStoragePage;
