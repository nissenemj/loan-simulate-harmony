
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { StrategyComparisonGuide } from '@/components/calculator/StrategyComparisonGuide';
import { InteractiveStrategyDemo } from '@/components/calculator/InteractiveStrategyDemo';
import { StrategyComparisonChart } from '@/components/calculator/StrategyComparisonChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Example debts for the comparison chart
const exampleDebts = [
  {
    id: 'cc1',
    name: 'Luottokortti',
    balance: 5000,
    interestRate: 18.5,
    minimumPayment: 150,
    type: 'credit-card'
  },
  {
    id: 'auto1', 
    name: 'Autolaina',
    balance: 15000,
    interestRate: 4.2,
    minimumPayment: 280,
    type: 'loan'
  },
  {
    id: 'student1',
    name: 'Opintolaina', 
    balance: 12000,
    interestRate: 1.5,
    minimumPayment: 200,
    type: 'loan'
  }
];

const StrategiesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Helmet>
        <title>Velkastrategiat | Velkavapaus.fi</title>
        <meta name="description" content="Tutustu velkojen takaisinmaksustrategioihin. Vertaa lumivyöry- ja lumipallostrategioita ja löydä sinulle sopiva lähestymistapa." />
      </Helmet>
      
      <div className="space-y-8">
        <BreadcrumbNav />
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Velkastrategiat</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tutustu tieteellisesti todistetuimpiin velkojen takaisinmaksustrategioihin. 
            Vertaa vaihtoehtoja ja löydä sinulle sopiva lähestymistapa velkavapauteen.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Strategiaoppaat</h3>
              <p className="text-sm text-muted-foreground">Lue yksityiskohtaiset oppaat</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Interaktiivinen demo</h3>
              <p className="text-sm text-muted-foreground">Kokeile eri skenaarioita</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calculator className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Strategialaskuri</h3>
              <p className="text-sm text-muted-foreground">Laske omilla tiedoillasi</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">Onnistumistarinat</h3>
              <p className="text-sm text-muted-foreground">Lue muiden kokemuksia</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Strategy Comparison Guide */}
        <StrategyComparisonGuide />

        {/* Interactive Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Kokeile itse</h2>
          <InteractiveStrategyDemo />
        </div>

        {/* Strategy Comparison Chart */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Visuaalinen vertailu</h2>
          <StrategyComparisonChart debts={exampleDebts} />
        </div>

        {/* Success Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Onnistumistarinoita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Annan tarina - Lumivyöry</h3>
                <p className="text-sm text-blue-700 mb-3">
                  "Minulla oli 45 000€ velkoja eri lähteistä. Lumivyörystrategian avulla säästin 
                  4 200€ korkokuluissa ja pääsin velkavankeudesta 8 kuukautta nopeammin."
                </p>
                <div className="text-xs text-blue-600">
                  <strong>Säästö:</strong> 4 200€ | <strong>Aika säästöä:</strong> 8 kuukautta
                </div>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Markuksen tarina - Lumipallo</h3>
                <p className="text-sm text-green-700 mb-3">
                  "Olin lähes luovuttamassa, mutta lumipallostrategia antoi minulle toivoa. 
                  Jokainen maksettu velka motivoi jatkamaan. Nyt olen velkavapaa!"
                </p>
                <div className="text-xs text-green-600">
                  <strong>Motivaatio:</strong> Korkea | <strong>Onnistuminen:</strong> 100%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
          <h2 className="text-3xl font-bold">Valmis aloittamaan?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nyt kun tiedät strategioiden erot, on aika testata niitä omilla veloillasi
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/calculator">
                <Calculator className="mr-2 h-5 w-5" />
                Aloita laskeminen
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/debt-strategies">
                <TrendingUp className="mr-2 h-5 w-5" />
                Katso lisää työkaluja
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Ilmainen käyttö • Ei rekisteröitymistä • Tiedot pysyvät laitteellasi
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;
