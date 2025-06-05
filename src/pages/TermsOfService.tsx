
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Käyttöehdot | Velkavapaus.fi</title>
        <meta name="description" content="Velkavapaus.fi käyttöehdot" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="rounded-full bg-primary/10 p-3 mr-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Käyttöehdot</h1>
            <p className="text-muted-foreground">Päivitetty 1.1.2024</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Velkavapaus.fi - Käyttöehdot</CardTitle>
            <CardDescription>
              Nämä käyttöehdot määrittelevät palvelumme käyttöä koskevat säännöt ja ehdot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="prose dark:prose-invert">
                <h2>1. Johdanto</h2>
                <p>
                  Tervetuloa käyttämään Velkavapaus.fi -palvelua ("Palvelu"). Nämä käyttöehdot
                  muodostavat sitovan sopimuksen sinun ja Palvelun tarjoajan välille.
                  Käyttämällä Palvelua hyväksyt nämä ehdot.
                </p>

                <h2>2. Palvelun kuvaus</h2>
                <p>
                  Velkavapaus.fi tarjoaa työkaluja velkojen hallintaan ja takaisinmaksusuunnitelmien
                  laatimiseen. Palvelu sisältää mm. laskureita, analyysityökaluja ja tietoa velkojenhallinnasta.
                  Palvelu on tarkoitettu vain tiedoksi ja avuksi, ei korvaamaan ammattimaista taloudellista neuvontaa.
                </p>

                <h2>3. Rekisteröityminen ja käyttäjätilit</h2>
                <p>
                  Osa Palvelun ominaisuuksista edellyttää rekisteröitymistä. Käyttäjänä olet vastuussa
                  käyttäjätilisi turvallisuudesta ja kaikkien käyttäjätililläsi tehtävien toimintojen
                  laillisuudesta. Et saa luovuttaa tilisi käyttöoikeutta muille.
                </p>

                <h2>4. Käyttöoikeus</h2>
                <p>
                  Myönnämme sinulle rajoitetun, henkilökohtaisen, ei-yksinomaisen, ei-siirrettävän
                  ja peruutettavissa olevan oikeuden käyttää Palvelua näiden ehtojen mukaisesti.
                  Et saa kopioida, muokata, levittää, myydä, vuokrata tai muulla tavoin käyttää Palvelua
                  näiden ehtojen vastaisesti.
                </p>

                <h2>5. Käyttäjän vastuu</h2>
                <p>Käyttäessäsi Palvelua sitoudut:</p>
                <ul>
                  <li>Noudattamaan kaikkia sovellettavia lakeja</li>
                  <li>Antamaan tarkat ja ajantasaiset tiedot</li>
                  <li>Olemaan loukkaamatta muiden oikeuksia</li>
                  <li>Olemaan käyttämättä Palvelua haitallisiin tarkoituksiin</li>
                  <li>Olemaan yrittämättä purkaa tai muokata Palvelua</li>
                </ul>

                <h2>6. Sisältö ja immateriaalioikeudet</h2>
                <p>
                  Kaikki Palvelussa oleva sisältö ja siihen liittyvät immateriaalioikeudet ovat
                  Palvelun tarjoajan tai sen lisenssinantajien omaisuutta. Et saa käyttää,
                  kopioida tai jakaa sisältöä ilman nimenomaista lupaa.
                </p>

                <h2>7. Vastuunrajoitus</h2>
                <p>
                  Palvelu tarjotaan "sellaisenaan" ja "sellaisena kuin se on saatavilla", ilman minkäänlaisia
                  takuita. Emme vastaa Palvelun virheettömyydestä, saatavuudesta tai soveltuvuudesta tiettyyn
                  tarkoitukseen.
                </p>
                <p>
                  Palvelun tiedot ovat vain ohjeellisia, eikä niitä tule pitää ammattimaisena taloudellisena
                  neuvontana. Emme vastaa laskelmien tai suositusten seurauksena tehdyistä päätöksistä.
                </p>

                <h2>8. Vastuun rajoitukset</h2>
                <p>
                  Sovellettavan lain sallimissa rajoissa emme ole vastuussa mistään välillisistä, epäsuorista,
                  rangaistusluonteisista tai erityisistä vahingoista, mukaan lukien tulon menetys,
                  jotka johtuvat Palvelun käytöstä tai käytön estymisestä.
                </p>

                <h2>9. Muutokset Palveluun ja käyttöehtoihin</h2>
                <p>
                  Pidätämme oikeuden muuttaa, keskeyttää tai lopettaa Palvelun tai sen osan
                  tarjoamisen milloin tahansa ilman ennakkoilmoitusta. Voimme myös päivittää näitä
                  käyttöehtoja ajoittain. Muutokset tulevat voimaan, kun julkaisemme päivitetyt ehdot.
                </p>

                <h2>10. Irtisanominen</h2>
                <p>
                  Voimme irtisanoa tai keskeyttää pääsysi Palveluun välittömästi ilman ennakkoilmoitusta
                  tai vastuuta, jos rikot näitä ehtoja. Voit myös itse lopettaa Palvelun käytön milloin
                  tahansa poistamalla käyttäjätilisi.
                </p>

                <h2>11. Sovellettava laki ja erimielisyyksien ratkaisu</h2>
                <p>
                  Näihin ehtoihin sovelletaan Suomen lakia, pois lukien sen lainvalintasäännökset.
                  Ehdoista aiheutuvat erimielisyydet ratkaistaan ensisijaisesti neuvotteluin,
                  ja jos sopimukseen ei päästä, Helsingin käräjäoikeudessa.
                </p>

                <h2>12. Koko sopimus</h2>
                <p>
                  Nämä ehdot muodostavat koko sopimuksen sinun ja meidän välillä Palvelun käytöstä
                  ja korvaavat kaikki aiemmat tai samanaikaiset kirjalliset tai suulliset sopimukset.
                </p>

                <h2>13. Yhteydenotto</h2>
                <p>
                  Jos sinulla on kysyttävää näistä ehdoista, ota yhteyttä osoitteeseen: info@velkavapaus.fi
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
