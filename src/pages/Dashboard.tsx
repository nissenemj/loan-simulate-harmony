
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useDebts } from '@/hooks/use-debts';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, CreditCard as CreditCardIcon, TrendingUp, PlusCircle } from 'lucide-react';
import { DebtPlanning } from '@/components/dashboard/DebtPlanning';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { debts } = useDebts();

  // Adapter to convert Debt (Supabase) to Loan (UI)
  const loans: Loan[] = useMemo(() => debts.map(d => ({
    id: d.id,
    name: d.name,
    amount: d.balance,
    currentBalance: d.balance,
    interestRate: d.interestRate,
    minPayment: d.minimumPayment,
    termYears: 10, // Default
    repaymentType: 'annuity', // Default
    isActive: true,
    monthlyFee: 0
  })), [debts]);

  const [creditCards] = useLocalStorage<CreditCard[]>('creditCards', []);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding && loans.length === 0) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding, loans.length]);

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const totalDebt = loans.reduce((sum, loan) => sum + loan.amount, 0) +
    creditCards.reduce((sum, card) => sum + card.balance, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Kojelauta | Velkavapaus.fi</title>
        <meta name="description" content="Seuraa velkojesi tilannetta ja edistymistäsi" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tervetuloa, {user?.email}</h1>
        <p className="text-muted-foreground">Seuraa velkojesi tilannetta ja edistymistäsi</p>
      </div>

      {loans.length === 0 && creditCards.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
          <h3 className="text-2xl font-semibold mb-2">Tervetuloa Velkavapaus.fi:hin!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Aloita matkasi kohti taloudellista vapautta lisäämällä ensimmäinen velkasi laskuriin.
          </p>
          <Button asChild size="lg">
            <Link to="/calculator">
              <PlusCircle className="mr-2 h-5 w-5" />
              Lisää ensimmäinen velka
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kokonaisvelka</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDebt.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lainoja</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loans.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Luottokortteja</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditCards.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Yleiskatsaus</TabsTrigger>
              <TabsTrigger value="analysis">Analyysi</TabsTrigger>
              <TabsTrigger value="planning">Suunnittelu</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Velkatilanteen yleiskatsaus</CardTitle>
                  <CardDescription>Nykyinen velkatilanteesi yhteenvetona</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Tässä näkyy velkatilanteesi yhteenveto ja tärkeimmät mittarit.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Velkatilanteen analyysi</CardTitle>
                  <CardDescription>Syvempi analyysi velkatilanteestasi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Tässä näkyy yksityiskohtainen analyysi velkatilanteestasi.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-4">
              {loans.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Takaisinmaksusuunnitelma</CardTitle>
                    <CardDescription>Suunnittele velkojesi takaisinmaksua</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Lisää ensin velkasi nähdäksesi suunnittelutyökalut.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/calculator">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Lisää velka
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <DebtPlanning loans={loans} />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      <OnboardingTour
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Dashboard;
