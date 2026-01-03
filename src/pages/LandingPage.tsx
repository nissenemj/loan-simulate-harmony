
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingDown, Shield, Users, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingPageDemo from '@/components/landing/LandingPageDemo';
import CrisisHelp from '@/components/CrisisHelp';
import { ProcessFlow, StatCard, StatCardGrid, ComparisonTable } from '@/components/infographics';

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
          
          {/* Arvolupaus */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <p className="text-2xl font-semibold text-primary mb-2">
              Säästä jopa 1000€ korkokuluja ja lyhennä velanmaksuaikaa 2 vuodella
            </p>
            <p className="text-lg text-muted-foreground">
              Älykäs velkastrategia voi merkittävästi vähentää maksamiasi korkoja
            </p>
          </div>

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
              Laske oma säästösi nyt
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

      {/* 3-vaiheinen ohjeistus */}
      <section className="py-16 bg-white dark:bg-muted/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Näin pääset alkuun 3 helpossa vaiheessa
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Syötä velkasi tiedot</h3>
              <p className="text-muted-foreground">
                Kirjaa velkojesi saldot, korot ja vähimmäismaksut. Tiedot pysyvät turvassa ja yksityisinä.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Valitse strategia</h3>
              <p className="text-muted-foreground">
                Vertaile kahta tapaa maksaa velkoja:
                <br />
                <strong>Lumipallo</strong> = pienin velka ensin (pikavoittoja!)
                <br />
                <strong>Lumivyöry</strong> = korkein korko ensin (säästät eniten)
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Seuraa edistymistä</h3>
              <p className="text-muted-foreground">
                Saat yksityiskohtaisen suunnitelman ja voit seurata matkaasi kohti velkavapautta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infografiikat - Velkavapauden matka */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Matka velkavapauteen
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Näin prosessi etenee – askel kerrallaan kohti taloudellista vapautta
          </p>

          <ProcessFlow
            title="Velkavapauden 5 askelta"
            steps={[
              { emoji: "📋", title: "Listaa", description: "Kokoa kaikki velkasi yhteen" },
              { emoji: "🧮", title: "Laske", description: "Käytä laskuriamme" },
              { emoji: "📊", title: "Vertaa", description: "Valitse paras strategia" },
              { emoji: "💪", title: "Toteuta", description: "Seuraa suunnitelmaa" },
              { emoji: "🎉", title: "Vapaudu", description: "Nauti velattomasta elämästä" },
            ]}
          />

          {/* Tilastokortit */}
          <StatCardGrid>
            <StatCard
              emoji="💰"
              number={2300}
              unit="€"
              label="Keskimääräinen säästö"
              description="korkokuluja vähemmän"
              variant="success"
            />
            <StatCard
              emoji="📅"
              number={18}
              unit="kk"
              label="Nopeammin velaton"
              description="oikealla strategialla"
              variant="info"
            />
            <StatCard
              emoji="👥"
              number={5000}
              unit="+"
              label="Käyttäjää"
              description="on jo löytänyt avun"
              variant="default"
            />
          </StatCardGrid>

          {/* Strategiavertailu */}
          <ComparisonTable
            title="Kumpi strategia sopii sinulle?"
            headers={["🏔️ Lumivyöry", "❄️ Lumipallo"]}
            rows={[
              { label: "Periaate", values: ["Korkein korko ensin", "Pienin velka ensin"] },
              { label: "Säästät rahaa", values: ["✅ Eniten", "Vähemmän"] },
              { label: "Motivaatio", values: ["Hitaampi alku", "✅ Nopeita voittoja"] },
              { label: "Sopii kun", values: ["Haluat säästää", "Tarvitset motivaatiota"] },
            ]}
          />
        </div>
      </section>

      {/* Sosiaalinen todiste */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Liity tuhansien tyytyväisten käyttäjien joukkoon
            </h2>
            <p className="text-xl text-muted-foreground">
              Yli 5000 suomalaista on jo säästänyt keskimäärin 2300€ korkokuluja
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Maria, Helsinki</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Säästin 1850€ korkoja ja pääsin velkavaspaaksi 18 kuukautta aiemmin. Suosittelen lämpimästi!"
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Jukka, Tampere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Yksinkertainen työkalu, joka todella toimii. Lumivyöry-strategia oli minulle oikea valinta."
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Anna, Oulu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Selkeä suunnitelma antoi minulle toivoa ja motivaatiota. Kiitos tästä mahtavasta työkalusta!"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tilastot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Tyytyväistä käyttäjää</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2300€</div>
              <div className="text-sm text-muted-foreground">Keskimääräinen säästö</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15kk</div>
              <div className="text-sm text-muted-foreground">Lyhentää maksuaikaa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Ilmainen käyttö</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Calculator Section */}
      <LandingPageDemo />

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

      {/* Kriisiapu-osio */}
      <section className="py-12 bg-white dark:bg-muted/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <CrisisHelp variant="default" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ensimmäinen askel on usein helpoin
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Monet ovat jo löytäneet tien velkavapauteen. Sinäkin voit – ja me autamme sinua matkalla.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/calculator')}
            className="text-lg px-8 py-3"
          >
            Kokeile ilmaista laskuria
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
