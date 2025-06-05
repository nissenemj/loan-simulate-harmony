
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingDown, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Velkavapaus.fi - Velkalaskuri ja takaisinmaksusuunnittelma</title>
        <meta name="description" content="Laske velkojesi takaisinmaksu tehokkaasti. Ilmainen velkalaskuri ja suunnittelutyökalu velkavapauteen." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Tie velkavapauteen alkaa tästä
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Laske velkojesi takaisinmaksu tehokkaasti ja löydä nopein tie velkavapauteen.
            Ilmainen työkalu kaikille velkastrategioille.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/calculator')}
              className="text-lg px-8 py-3"
            >
              Aloita laskenta
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
              className="text-lg px-8 py-3"
            >
              Lue lisää
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Miksi valita Velkavapaus.fi?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Tarkka laskenta</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ammattimainen velkalaskuri, joka ottaa huomioon kaikki kulut ja korot.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Eri strategiat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vertaile lumipallo-, lumivyöry- ja muita velkastrategioita.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Yksityisyys</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tietosi säilyvät turvassa. Käsittelemme kaiken luottamuksellisesti.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Ilmainen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Kaikki työkalut ovat täysin ilmaisia. Ei piilokustannuksia.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Aloita matkasi velkavapauteen tänään
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Älä anna velkojen hallita elämääsi. Ota ensimmäinen askel kohti taloudellista vapautta.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/calculator')}
            className="text-lg px-8 py-3"
          >
            Aloita ilmainen laskenta
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
