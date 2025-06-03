
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UnderConstructionBanner = () => {
  return (
    <Alert variant="destructive" className="mb-6 animate-pulse">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">Sivusto kehitteillä</AlertTitle>
      <AlertDescription>
        Tämä sivusto on vielä kehitteillä. Jotkut toiminnot voivat olla puutteellisia tai toimimattomia.
      </AlertDescription>
    </Alert>
  );
};

export default UnderConstructionBanner;
