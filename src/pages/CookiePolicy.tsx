
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CookiePolicy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Evästekäytäntö | Loan Simulate Harmony</title>
        <meta name="description" content="Evästekäytäntö - Loan Simulate Harmony" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationHeader />
        
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">Evästekäytäntö</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Käytämme evästeitä parantaaksemme käyttökokemustasi Loan Simulate Harmony -sovelluksessa. 
              Tämä evästekäytäntö selittää, mitä evästeet ovat, miten käytämme niitä, mitä vaihtoehtoja sinulla on 
              liittyen evästeisiin, ja kuinka voit hallinnoida evästeasetuksiasi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Mitä evästeet ovat?</h2>
            <p className="mb-4">
              Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan laitteeseesi (tietokone, tabletti, puhelin) 
              kun vierailet verkkosivustolla tai käytät verkkopalvelua. Evästeet auttavat meitä tunnistamaan laitteesi 
              seuraavalla vierailullasi, muistamaan asetuksesi ja parantamaan käyttökokemustasi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttämämme evästetyypit</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-2">Välttämättömät evästeet</h3>
            <p className="mb-4">
              Nämä evästeet ovat välttämättömiä sovelluksen toiminnan kannalta. Niiden avulla voit navigoida 
              sovelluksessa ja käyttää sen toimintoja, kuten kirjautumista. Näitä evästeitä ei voi poistaa käytöstä.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Nimi</th>
                  <th className="border p-2 text-left">Tarkoitus</th>
                  <th className="border p-2 text-left">Säilytysaika</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">session_id</td>
                  <td className="border p-2">Tunnistaa käyttäjäistuntosi</td>
                  <td className="border p-2">Istunnon ajan</td>
                </tr>
                <tr>
                  <td className="border p-2">auth_token</td>
                  <td className="border p-2">Pitää sinut kirjautuneena</td>
                  <td className="border p-2">30 päivää</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-medium mt-6 mb-2">Analytiikkaevästeet</h3>
            <p className="mb-4">
              Näiden evästeiden avulla keräämme tietoa siitä, miten käyttäjät käyttävät sovellustamme. 
              Tämä auttaa meitä parantamaan sovellusta ja varmistamaan, että se vastaa käyttäjien tarpeita.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Nimi</th>
                  <th className="border p-2 text-left">Tarkoitus</th>
                  <th className="border p-2 text-left">Säilytysaika</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">_ga (Google Analytics)</td>
                  <td className="border p-2">Käyttäjien erottamiseen</td>
                  <td className="border p-2">2 vuotta</td>
                </tr>
                <tr>
                  <td className="border p-2">_gat (Google Analytics)</td>
                  <td className="border p-2">Pyyntöjen rajoittamiseen</td>
                  <td className="border p-2">1 minuutti</td>
                </tr>
                <tr>
                  <td className="border p-2">_gid (Google Analytics)</td>
                  <td className="border p-2">Käyttäjien erottamiseen</td>
                  <td className="border p-2">24 tuntia</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-medium mt-6 mb-2">Mieltymysevästeet</h3>
            <p className="mb-4">
              Nämä evästeet mahdollistavat sovelluksen muistamaan valintasi ja asetuksesi, kuten kielivalinnat, 
              teema-asetukset ja muut mukautukset.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Nimi</th>
                  <th className="border p-2 text-left">Tarkoitus</th>
                  <th className="border p-2 text-left">Säilytysaika</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">language_preference</td>
                  <td className="border p-2">Tallentaa kielivalintasi</td>
                  <td className="border p-2">1 vuosi</td>
                </tr>
                <tr>
                  <td className="border p-2">theme_setting</td>
                  <td className="border p-2">Tallentaa teema-asetuksesi (vaalea/tumma)</td>
                  <td className="border p-2">1 vuosi</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-medium mt-6 mb-2">Markkinointievästeet</h3>
            <p className="mb-4">
              Näitä evästeitä käytetään seuraamaan vierailujasi sovelluksessamme ja erityisesti affiliate-linkkien 
              klikkauksia. Niiden avulla voimme seurata, mitä kumppaneidemme sivustoja käyttäjämme vierailevat.
            </p>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Nimi</th>
                  <th className="border p-2 text-left">Tarkoitus</th>
                  <th className="border p-2 text-left">Säilytysaika</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">adtraction_cookie</td>
                  <td className="border p-2">Seuraa Adtraction-kumppanuuslinkkien klikkauksia</td>
                  <td className="border p-2">30 päivää</td>
                </tr>
                <tr>
                  <td className="border p-2">adservice_cookie</td>
                  <td className="border p-2">Seuraa Adservice-kumppanuuslinkkien klikkauksia</td>
                  <td className="border p-2">30 päivää</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Kolmannen osapuolen evästeet</h2>
            <p className="mb-4">
              Sovelluksemme käyttää myös kolmansien osapuolten evästeitä:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Google Analytics:</strong> Käytämme Google Analyticsia analysoidaksemme, miten käyttäjät 
                käyttävät sovellustamme. Lisätietoja Google Analyticsin evästeistä: 
                <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                  Google-evästekäytäntö
                </a>
              </li>
              <li>
                <strong>Affiliate-kumppanit:</strong> Kun napsautat affiliate-linkkejämme (esim. Ferratum Business, Nordnet), 
                nämä kumppanit saattavat asettaa evästeitä laitteeseesi. Meillä ei ole pääsyä tai hallintaa näihin evästeisiin. 
                Tutustu kumppaneidemme omiin evästekäytäntöihin saadaksesi lisätietoja.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Evästeiden hallinta</h2>
            <p className="mb-4">
              Voit hallita evästeasetuksia sovelluksessamme käyttämällä evästebanneriamme, joka näkyy, kun käytät 
              sovellusta ensimmäistä kertaa. Voit milloin tahansa muuttaa asetuksiasi sovelluksen alatunnisteessa 
              olevan "Evästeasetukset"-linkin kautta.
            </p>
            <p className="mb-4">
              Voit myös hallita evästeitä selaimesi asetuksista. Useimmat selaimet mahdollistavat evästeiden 
              poistamisen tai hylkäämisen. Selainkohtaiset ohjeet löytyvät selaimesi ohjevalikosta tai seuraavilta 
              sivustoilta:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/fi/kb/evasteet-tiedot-jotka-sivustot-tallentavat-tietokoneeseesi" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/fi-fi/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/fi-fi/microsoft-edge/poista-ev%C3%A4steet-microsoft-edgess%C3%A4-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="mb-4">
              Huomaa, että evästeiden poistaminen käytöstä saattaa vaikuttaa sovelluksen toiminnallisuuteen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Suostumus</h2>
            <p className="mb-4">
              Kun käytät sovellustamme ensimmäistä kertaa, pyydämme suostumuksesi evästeiden käyttöön. 
              Välttämättömät evästeet eivät vaadi suostumusta, koska ne ovat tarpeellisia sovelluksen toiminnan kannalta.
            </p>
            <p className="mb-4">
              Voit milloin tahansa muuttaa tai peruuttaa suostumuksesi evästebannerin tai evästeasetukset-linkin kautta.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Muutokset evästekäytäntöön</h2>
            <p className="mb-4">
              Voimme päivittää tätä evästekäytäntöä ajoittain. Suosittelemme tarkistamaan tämän sivun säännöllisesti 
              saadaksesi tietoa mahdollisista muutoksista. Muutokset tulevat voimaan heti, kun ne on julkaistu tällä sivulla.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Yhteydenotto</h2>
            <p className="mb-4">
              Jos sinulla on kysyttävää evästekäytännöstämme, ota yhteyttä: 
            </p>
            <p className="mb-4">
              Sähköposti: support@velkavapaus.fi
            </p>
          </section>

          <Separator className="my-6" />
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Loan Simulate Harmony. Kaikki oikeudet pidätetään.
          </p>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
