
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const LoanTerms: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Lainaehdot | Velkavapaus.fi</title>
        <meta name="description" content="Velkavapaus.fi lainaehdot ja -säännöt" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Lainaehdot</h1>
            <p className="text-muted-foreground">Päivitetty 1.1.2024</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Velkavapaus.fi - Lainaehdot</CardTitle>
            <CardDescription>
              Nämä lainaehdot määrittelevät lainasopimuksia koskevat säännöt ja ehdot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="prose dark:prose-invert">
                <h2>1. Johdanto</h2>
                <p>
                  Nämä lainaehdot koskevat Velkavapaus.fi -palvelun kautta tarjottavia lainapalveluita.
                  Lainanantaja on kumppaniverkostomme jäsen ja lainanottaja hyväksyy nämä ehdot
                  lainasopimusta tehdessään.
                </p>

                <h2>2. Lainan myöntäminen</h2>
                <p>
                  Lainan myöntäminen edellyttää luottotietojen tarkistusta ja riittävää maksukykyä.
                  Lainanantaja pidättää oikeuden hylätä lainahakemus perustellusta syystä.
                  Lainan ehdot määräytyvät hakijan luottokelpoisuuden ja lainan käyttötarkoituksen mukaan.
                </p>

                <h2>3. Korko ja kulut</h2>
                <p>Lainasta peritään:</p>
                <ul>
                  <li>Vuosikorko, joka määräytyy markkinatilanteen ja luottokelpoisuuden mukaan</li>
                  <li>Mahdollisia järjestelykuluja</li>
                  <li>Viivästyskorko myöhästyneistä maksuista</li>
                  <li>Muistutus- ja perintäkuluja</li>
                </ul>

                <h2>4. Takaisinmaksu</h2>
                <p>
                  Laina maksetaan takaisin sovitussa aikataulussa tasaerinä. Lyhennykset sisältävät
                  sekä koron että pääoman maksua. Lainanottaja voi maksaa lainan ennenaikaisesti
                  kokonaan tai osittain ilman erillistä rangaistusta.
                </p>

                <h2>5. Vakuudet</h2>
                <p>
                  Lainanantaja voi vaatia lainalle vakuuden luottokelpoisuuden tai lainamäärän mukaan.
                  Vakuutena voi toimia kiinteistökiinnitys, takaus tai muu hyväksyttävä vakuus.
                </p>

                <h2>6. Lainanottajan velvollisuudet</h2>
                <p>Lainanottaja sitoutuu:</p>
                <ul>
                  <li>Maksamaan lainan takaisin sovitun mukaisesti</li>
                  <li>Ilmoittamaan välittömästi yhteystietojen muutoksista</li>
                  <li>Ilmoittamaan taloudellisen tilanteen olennaisista muutoksista</li>
                  <li>Säilyttämään mahdolliset vakuudet kunnossa</li>
                </ul>

                <h2>7. Laiminlyönti</h2>
                <p>
                  Jos lainanottaja laiminlyö maksunsa, lainanantajalla on oikeus:
                </p>
                <ul>
                  <li>Periä viivästyskorkoa</li>
                  <li>Vaatia koko jäljellä oleva laina heti takaisin maksettavaksi</li>
                  <li>Realisoida vakuudet</li>
                  <li>Ryhtyä muihin laillisiin perintätoimiin</li>
                </ul>

                <h2>8. Tietojen käsittely</h2>
                <p>
                  Lainanantaja käsittelee hakijan henkilötietoja luotonannon edellyttämässä laajuudessa
                  tietosuojalainsäädännön mukaisesti. Tiedot voidaan tarkistaa luottotietorekistereistä
                  ja merkitä niihin.
                </p>

                <h2>9. Muutokset ehtoihin</h2>
                <p>
                  Lainanantaja voi muuttaa näitä ehtoja ilmoittamalla siitä lainanottajalle vähintään
                  kaksi kuukautta etukäteen. Jos lainanottaja ei hyväksy muutoksia, hänellä on oikeus
                  irtisanoa sopimus.
                </p>

                <h2>10. Kuluttajansuoja</h2>
                <p>
                  Kuluttajalainoja koskevat Kuluttajansuojalain säännökset. Kuluttajalla on 14 päivän
                  peruutusoikeus lainasopimuksen tekemisestä. Lainanantaja noudattaa vastuullisen
                  luotonannon periaatteita.
                </p>

                <h2>11. Riidanratkaisu</h2>
                <p>
                  Mahdolliset erimielisyydet pyritään ratkaisemaan ensisijaisesti neuvotteluin.
                  Kuluttajariita-asiat voidaan viedä Kuluttajariitalautakunnan käsiteltäväksi.
                  Muut riidat ratkaistaan Suomen tuomioistuimissa.
                </p>

                <h2>12. Sovellettava laki</h2>
                <p>
                  Lainasopimukseen sovelletaan Suomen lakia. Lainanantaja noudattaa Finanssivalvonnan
                  määräyksiä ja ohjeita.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanTerms;
