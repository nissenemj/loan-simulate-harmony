
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Asetukset | Velkavapaus.fi</title>
        <meta name="description" content="Hallitse tiliäsi ja sovelluksen asetuksia" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Asetukset</h1>
          <p className="text-muted-foreground">Hallitse tiliäsi ja sovelluksen asetuksia</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tilin tiedot</CardTitle>
            <CardDescription>Näytä ja muokkaa tilin perustietoja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Sähköpostiosoite</Label>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <Separator />
            <Button variant="outline">Muokkaa profiilia</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sovelluksen asetukset</CardTitle>
            <CardDescription>Mukauta sovelluksen toimintaa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tumma teema</Label>
                <p className="text-sm text-muted-foreground">
                  Käytä tummaa teemaa sovelluksessa
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Oletusvaluutta</Label>
              <Select defaultValue="eur">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                  <SelectItem value="usd">Dollari ($)</SelectItem>
                  <SelectItem value="gbp">Punta (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sähköposti-ilmoitukset</Label>
                <p className="text-sm text-muted-foreground">
                  Vastaanota ilmoituksia sähköpostitse
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tietojen hallinta</CardTitle>
            <CardDescription>Hallitse tallennettuja tietojasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Lataa tiedot</Button>
            <Button variant="destructive">Poista kaikki tiedot</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
