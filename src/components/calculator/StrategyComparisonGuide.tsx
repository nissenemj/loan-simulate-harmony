
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, TrendingUp, Clock, DollarSign, Target, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategyExample {
  name: string;
  debts: Array<{
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
  }>;
  extraPayment: number;
  avalancheResult: {
    months: number;
    totalInterest: number;
    order: string[];
  };
  snowballResult: {
    months: number;
    totalInterest: number;
    order: string[];
  };
}

const exampleCase: StrategyExample = {
  name: "Matin velkatilanne",
  debts: [
    { name: "Luottokortti", balance: 5000, rate: 18.5, minPayment: 150 },
    { name: "Autolaina", balance: 15000, rate: 4.2, minPayment: 280 },
    { name: "Opintolaina", balance: 12000, rate: 1.5, minPayment: 200 }
  ],
  extraPayment: 300,
  avalancheResult: {
    months: 42,
    totalInterest: 3420,
    order: ["Luottokortti", "Autolaina", "Opintolaina"]
  },
  snowballResult: {
    months: 45,
    totalInterest: 3680,
    order: ["Luottokortti", "Opintolaina", "Autolaina"]
  }
};

export function StrategyComparisonGuide() {
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [showCalculation, setShowCalculation] = useState(false);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(amount);

  const strategies = {
    avalanche: {
      title: "Lumivyörystrategia",
      subtitle: "Korkein korko ensin",
      icon: TrendingDown,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      pros: [
        "Säästää eniten rahaa koroissa",
        "Matemaattisesti tehokkain",
        "Sopii analyyttisille ihmisille",
        "Paras pitkän aikavälin säästöjen kannalta"
      ],
      cons: [
        "Voi tuntua hitaalta alussa",
        "Vaatii kärsivällisyyttä",
        "Ei anna psykologista tyydytystä nopeasti"
      ],
      bestFor: "Sinulle joka haluat säästää mahdollisimman paljon rahaa ja pystyt pysymään motivoituneena pitkän aikavälin tavoitteilla."
    },
    snowball: {
      title: "Lumipallostrategia", 
      subtitle: "Pienin velka ensin",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50", 
      borderColor: "border-green-200",
      pros: [
        "Antaa nopeita voittoja",
        "Rakentaa motivaatiota",
        "Yksinkertaistaa velkatilannetta",
        "Sopii psykologisesti monille"
      ],
      cons: [
        "Maksaa enemmän korkoja",
        "Matemaattisesti vähemmän tehokas",
        "Suuret korot jäävät viimeiseksi"
      ],
      bestFor: "Sinulle joka tarvitset psykologista tukea ja motivaatiota velkojen maksussa."
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Velkastrategioiden vertailu</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tutustu kahteen tehokkaimpaan velkojen takaisinmaksustrategiaan ja löydä sinulle sopiva lähestymistapa
        </p>
      </div>

      {/* Strategy Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(strategies).map(([key, strategy]) => {
          const IconComponent = strategy.icon;
          const isSelected = selectedStrategy === key;
          
          return (
            <Card 
              key={key}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedStrategy(key as 'avalanche' | 'snowball')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", strategy.bgColor)}>
                    <IconComponent className={cn("h-6 w-6", strategy.color)} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{strategy.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{strategy.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Edut:</h4>
                  <ul className="space-y-1">
                    {strategy.pros.map((pro, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Haitat:</h4>
                  <ul className="space-y-1">
                    {strategy.cons.map((con, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={cn("p-3 rounded-lg", strategy.bgColor)}>
                  <h4 className="font-semibold mb-1">Sopii sinulle jos:</h4>
                  <p className="text-sm">{strategy.bestFor}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Interaktiivinen esimerkki: {exampleCase.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tilanne</TabsTrigger>
              <TabsTrigger value="comparison">Vertailu</TabsTrigger>
              <TabsTrigger value="calculation">Laskenta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-3">Matin velat:</h3>
                  <div className="space-y-2">
                    {exampleCase.debts.map((debt, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <span className="font-medium">{debt.name}</span>
                          <div className="text-sm text-muted-foreground">
                            Korko: {debt.rate}% | Vähimmäismaksu: {formatCurrency(debt.minPayment)}
                          </div>
                        </div>
                        <span className="font-semibold">{formatCurrency(debt.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg">
                  <div>
                    <span className="text-sm text-muted-foreground">Kokonaisvelka</span>
                    <p className="text-2xl font-bold">
                      {formatCurrency(exampleCase.debts.reduce((sum, debt) => sum + debt.balance, 0))}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Lisämaksu kuukaudessa</span>
                    <p className="text-2xl font-bold text-primary">+{formatCurrency(exampleCase.extraPayment)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      Lumivyörystrategia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span>Aika velkojen maksamiseen:</span>
                      <Badge variant="secondary">{exampleCase.avalancheResult.months} kk</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Korot yhteensä:</span>
                      <span className="font-semibold">{formatCurrency(exampleCase.avalancheResult.totalInterest)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Maksujärjestys:</span>
                      <div className="mt-1 space-y-1">
                        {exampleCase.avalancheResult.order.map((debt, index) => (
                          <div key={index} className="text-sm flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            {debt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Lumipallostrategia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span>Aika velkojen maksamiseen:</span>
                      <Badge variant="secondary">{exampleCase.snowballResult.months} kk</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Korot yhteensä:</span>
                      <span className="font-semibold">{formatCurrency(exampleCase.snowballResult.totalInterest)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Maksujärjestys:</span>
                      <div className="mt-1 space-y-1">
                        {exampleCase.snowballResult.order.map((debt, index) => (
                          <div key={index} className="text-sm flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            {debt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Vertailun tulos:</h4>
                <p className="text-sm text-yellow-700">
                  Lumivyörystrategia säästää Matille <strong>{formatCurrency(exampleCase.snowballResult.totalInterest - exampleCase.avalancheResult.totalInterest)}</strong> korkokuluissa 
                  ja lyhentää takaisinmaksuaikaa <strong>{exampleCase.snowballResult.months - exampleCase.avalancheResult.months} kuukaudella</strong>.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="calculation" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Laskentaperiaatteet:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Lumivyörystrategia:</strong>
                    <p>1. Maksa kaikkien velkojen vähimmäismaksut</p>
                    <p>2. Käytä kaikki ylimääräinen raha korkeimman koron velkaan</p>
                    <p>3. Kun velkaa maksettu, siirry seuraavaksi korkeimpaan korkoon</p>
                  </div>
                  <div>
                    <strong>Lumipallostrategia:</strong>
                    <p>1. Maksa kaikkien velkojen vähimmäismaksut</p>
                    <p>2. Käytä kaikki ylimääräinen raha pienimpään velkaan</p>
                    <p>3. Kun velka maksettu, siirry seuraavaksi pienimpään</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Strategy Selector Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mikä strategia sopii sinulle?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">Vastaa näihin kysymyksiin löytääksesi sinulle sopivimman strategian:</p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Mikä motivoi sinua enemmän?</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="motivation" value="quick-wins" className="text-primary" />
                    <span>Nopeat voitot ja konkreettiset edistysaskeleet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="motivation" value="maximum-savings" className="text-primary" />
                    <span>Maksimaalinen rahallinen säästö pitkällä aikavälillä</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Miten suhtaudut riskiin?</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="risk" value="safe" className="text-primary" />
                    <span>Haluan varman ja yksinkertaisen lähestymistavan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="risk" value="optimized" className="text-primary" />
                    <span>Olen valmis optimoimaan säästöjeni maksimoimiseksi</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="mt-4">
                Näytä suositus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-4 py-8">
        <h3 className="text-2xl font-bold">Valmis testaamaan strategiaa?</h3>
        <p className="text-muted-foreground">
          Syötä omat velkasi laskuriin ja katso kumpi strategia toimii parhaiten sinulle
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Kokeile strategiaa omilla veloillasi →
        </Button>
      </div>
    </div>
  );
}
