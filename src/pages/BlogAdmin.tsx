
import React from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const BlogAdmin: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blogin hallinta | Velkavapaus</title>
        <meta name="description" content="Hallitse blogikirjoituksia" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Blogin hallinta</h1>
        <p className="text-lg">Luo ja muokkaa blogikirjoituksia</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blogikirjoitukset</CardTitle>
          <CardDescription>Hallitse sivuston blogikirjoituksia</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Uusi kirjoitus
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogAdmin;
