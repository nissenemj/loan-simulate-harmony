
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Tietosuojaseloste | Velkavapaus.fi</title>
        <meta name="description" content="Velkavapaus.fi tietosuojakäytännöt" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tietosuojaseloste</h1>
            <p className="text-muted-foreground">Päivitetty 1.1.2024</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Velkavapaus.fi - Tietosuojaseloste</CardTitle>
            <CardDescription>
              Tässä tietosuojaselosteessa kerromme, miten käsittelemme henkilötietojasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="prose dark:prose-invert">
                <h2>1. Rekisterinpitäjä</h2>
                <p>
                  Velkavapaus.fi<br />
                  Sähköposti: info@velkavapaus.fi<br />
                  Osoite: Velkatie 1, 00100 Helsinki
                </p>

                <h2>2. Mitä tietoja keräämme</h2>
                <p>Keräämme seuraavia henkilötietoja:</p>
                <ul>
                  <li>Perustiedot: nimi, sähköpostiosoite</li>
                  <li>Käyttäjätili: käyttäjätunnus, salasana (salattu)</li>
                  <li>Taloudelliset tiedot: lainat, velat, maksusuunnitelmat</li>
                  <li>Tekniset tiedot: IP-osoite, selaintiedot, laitteen tiedot</li>
                  <li>Käyttäytymistiedot: verkkosivun käyttö, klikkaustiedot, vierailut sivustolla</li>
                </ul>

                <h2>3. Miksi käsittelemme tietojasi</h2>
                <p>Käsittelemme henkilötietojasi seuraaviin tarkoituksiin:</p>
                <ul>
                  <li>Palvelun tarjoaminen: velkalaskurit ja -suunnitelmat</li>
                  <li>Käyttäjätilin hallinta</li>
                  <li>Palvelun kehittäminen ja tilastointi</li>
                  <li>Asiakasviestintä ja tuki</li>
                  <li>Lakisääteisten velvoitteiden täyttäminen</li>
                </ul>

                <h2>4. Käsittelyn oikeusperusteet</h2>
                <p>Käsittelemme henkilötietojasi seuraavilla perusteilla:</p>
                <ul>
                  <li>Sopimuksen täyttäminen: kun käytät palveluitamme</li>
                  <li>Suostumus: esim. markkinointiin</li>
                  <li>Oikeutettu etu: asiakassuhteen hoitaminen, palvelun kehittäminen</li>
                  <li>Lakisääteiset velvoitteet</li>
                </ul>

                <h2>5. Tietojen säilytysaika</h2>
                <p>
                  Säilytämme henkilötietojasi vain niin kauan kuin on tarpeen määriteltyjen
                  käyttötarkoitusten toteuttamiseksi tai lakisääteisten velvoitteiden täyttämiseksi.
                  Käyttäjätili ja siihen liittyvät tiedot säilytetään niin kauan kuin tili on aktiivinen.
                  Voit milloin tahansa poistaa käyttäjätilisi, jolloin tietosi poistetaan järjestelmistämme.
                </p>

                <h2>6. Tietojen luovutukset ja siirrot</h2>
                <p>
                  Emme luovuta tietojasi kolmansille osapuolille ilman suostumustasi,
                  paitsi jos laki niin velvoittaa. Voimme käyttää luotettavia palveluntarjoajia
                  (kuten pilvipalveluita) tietojen käsittelyyn puolestamme.
                </p>

                <h2>7. Tietojen siirrot EU/ETA-alueen ulkopuolelle</h2>
                <p>
                  Emme siirrä tietojasi EU/ETA-alueen ulkopuolelle. Jos tällainen siirto tulee
                  tarpeelliseksi, varmistamme riittävän tietosuojan tason käyttämällä asianmukaisia
                  suojatoimia, kuten EU:n mallisopimuslausekkeita.
                </p>

                <h2>8. Tietojen suojaus</h2>
                <p>
                  Käytämme teknisiä ja organisatorisia toimenpiteitä tietojesi suojaamiseksi.
                  Näihin kuuluvat mm. salausteknologiat, pääsynhallinta, koulutus ja tietoturvatestaus.
                </p>

                <h2>9. Sinun oikeutesi</h2>
                <p>Sinulla on seuraavat oikeudet:</p>
                <ul>
                  <li>Oikeus saada pääsy tietoihin</li>
                  <li>Oikeus tietojen oikaisemiseen</li>
                  <li>Oikeus tietojen poistamiseen ("oikeus tulla unohdetuksi")</li>
                  <li>Oikeus käsittelyn rajoittamiseen</li>
                  <li>Oikeus siirtää tiedot järjestelmästä toiseen</li>
                  <li>Oikeus vastustaa käsittelyä</li>
                  <li>Oikeus peruuttaa suostumus</li>
                </ul>

                <h2>10. Evästeet</h2>
                <p>
                  Käytämme evästeitä ja muita vastaavia teknologioita parantaaksemme
                  käyttäjäkokemusta ja kerätäksemme tilastotietoa sivuston käytöstä.
                  Voit hallita evästeiden käyttöä selaimesi asetuksista.
                </p>

                <h2>11. Yhteydenotot</h2>
                <p>
                  Jos haluat käyttää oikeuksiasi tai sinulla on kysyttävää henkilötietojesi
                  käsittelystä, ota yhteyttä: tietosuoja@velkavapaus.fi
                </p>

                <h2>12. Valitusoikeus</h2>
                <p>
                  Sinulla on oikeus tehdä valitus tietosuojavaltuutetulle, jos koet, että
                  henkilötietojesi käsittelyssä on rikottu tietosuojalainsäädäntöä.
                </p>

                <h2>13. Muutokset tietosuojaselosteeseen</h2>
                <p>
                  Voimme päivittää tätä tietosuojaselostetta ajoittain. Merkitsemme
                  muutokset päivämäärällä selosteen alkuun.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
