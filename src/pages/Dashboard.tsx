
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loan } from '@/utils/loanCalculations';
import { CreditCard } from '@/utils/creditCardCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CreditCard as CreditCardIcon, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loans] = useLocalStorage<Loan[]>('loans', []);
  const [creditCards] = useLocalStorage<CreditCard[]>('creditCards', []);

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
          <Card>
            <CardHeader>
              <CardTitle>Takaisinmaksusuunnitelma</CardTitle>
              <CardDescription>Suunnittele velkojesi takaisinmaksua</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tässä voit suunnitella ja optimoida velkojesi takaisinmaksua.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
