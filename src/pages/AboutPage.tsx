
import React from 'react';
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Tietoa meistä | Velkavapaus.fi</title>
        <meta name="description" content="Autamme sinua pääsemään eroon veloista tehokkaasti ja kestävästi" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tietoa meistä</h1>
        <p className="text-lg">Velkavapaus.fi - tiesi kohti taloudellista vapautta</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose max-w-none dark:prose-invert">
            <p className="mb-4">
              Velkavapaus.fi on suomalainen verkkopalvelu, joka auttaa sinua hallitsemaan velkojasi ja pääsemään kohti taloudellista vapautta.
            </p>
            <p className="mb-4">
              Tarjoamme ilmaisia työkaluja ja oppaita, joiden avulla voit luoda tehokkaan suunnitelman velkojen maksamiseksi.
            </p>
            <p className="mb-4">
              Uskomme, että jokaisella on oikeus taloudelliseen vapauteen ja haluamme tehdä sen saavuttamisesta mahdollisimman helppoa.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold mb-4">Miksi Velkavapaus.fi?</h2>
        <p className="mb-4">
          Velkavapaus.fi syntyi tarpeesta tarjota suomalaisille helppokäyttöinen ja ilmainen työkalu velkojen hallintaan.
        </p>
        <p className="text-primary font-medium">
          Autamme sinua pääsemään eroon veloista tehokkaasti ja kestävästi.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
