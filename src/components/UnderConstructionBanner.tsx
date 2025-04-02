
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UnderConstructionBanner = () => {
  return (
    <Alert variant="destructive" className="mb-6 animate-pulse">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">Under Construction...</AlertTitle>
      <AlertDescription>
        We are currently improving this page. Some features may not work as expected.
      </AlertDescription>
    </Alert>
  );
};

export default UnderConstructionBanner;
