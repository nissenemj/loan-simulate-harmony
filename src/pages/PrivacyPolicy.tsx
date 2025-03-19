
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Tietosuojaseloste | Loan Simulate Harmony</title>
        <meta name="description" content="Tietosuojaseloste - Loan Simulate Harmony" />
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
          
          <h1 className="text-3xl font-bold mb-6">Tietosuojaseloste</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Me Loan Simulate Harmonyssa arvostamme yksityisyyttäsi ja olemme sitoutuneet suojelemaan henkilötietojasi. 
              Tämä tietosuojaseloste kertoo, miten keräämme, käytämme ja suojaamme tietojasi käyttäessäsi sovellustamme.
            </p>
            <p className="mb-4">
              Loan Simulate Harmony on velkojenhallintasovellus, joka auttaa sinua suunnittelemaan velkojen takaisinmaksua 
              ja saavuttamaan taloudellisia tavoitteitasi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Keräämämme tiedot</h2>
            <p className="mb-2">
              Keräämme seuraavia tietoja, jotta voimme tarjota sinulle parhaan mahdollisen palvelun:
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">Henkilötiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Nimi ja sähköpostiosoite (rekisteröitymisen yhteydessä)</li>
              <li>Salasana (suojattu ja salattu)</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Taloudelliset tiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Velkojen tiedot (saldo, korko, minimaksut)</li>
              <li>Takaisinmaksusuunnitelmat</li>
              <li>Budjettitiedot</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Käyttötiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sovelluksen käyttöön liittyvät tiedot</li>
              <li>IP-osoite ja laitetiedot</li>
              <li>Selaimen tyyppi ja versio</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Evästeet ja seurantatekniikat</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Välttämättömät evästeet sovelluksen toiminnallisuuden varmistamiseksi</li>
              <li>Analytiikkaevästeet käyttökokemuksen parantamiseksi (esim. Google Analytics)</li>
              <li>Mieltymysevästeet asetustesi tallentamiseksi</li>
              <li>Markkinointievästeet affiliate-linkkien seurantaa varten</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Lisätietoja evästeistä löydät <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/cookie-policy")}>Evästekäytännöstämme</Button>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietojen käyttötarkoitukset</h2>
            <p className="mb-2">
              Käytämme keräämiämme tietoja seuraaviin tarkoituksiin:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Käyttäjätilin luomiseen ja hallintaan</li>
              <li>Henkilökohtaisen velanmaksusuunnitelman luomiseen</li>
              <li>Sovelluksen toiminnan ja käyttökokemuksen parantamiseen</li>
              <li>Analytiikkaan ja tutkimukseen (anonymisoitua dataa)</li>
              <li>Lakisääteisten velvoitteiden täyttämiseen</li>
              <li>Käyttäjätuen tarjoamiseen</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietojen jakaminen</h2>
            <p className="mb-4">
              Emme myy, vuokraa tai jaa henkilötietojasi kolmansille osapuolille markkinointitarkoituksiin. 
              Jaamme tietoja vain seuraavissa tilanteissa:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Palveluntarjoajille, jotka auttavat meitä tarjoamaan sovelluksen palveluita (esim. hosting-palvelut)</li>
              <li>Analytiikkatyökalujen tarjoajille (esim. Google Analytics) anonymisoidussa muodossa</li>
              <li>Viranomaisten pyynnöstä tai lakisääteisten velvoitteiden täyttämiseksi</li>
            </ul>
            <p className="mb-4">
              Sovelluksessamme on affiliate-linkkejä (esim. Ferratum Business Adtractionin kautta ja Nordnet Adservicen kautta). 
              Napsauttaessasi näitä linkkejä saatat päätyä kolmansien osapuolten sivustoille, joilla on omat tietosuojakäytäntönsä.
              Emme ole vastuussa näiden sivustojen käytännöistä tai sisällöstä.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttäjän oikeudet</h2>
            <p className="mb-4">
              GDPR:n mukaisesti sinulla on seuraavat oikeudet:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Oikeus päästä tietoihisi ja saada niistä kopio</li>
              <li>Oikeus virheellisten tietojen oikaisemiseen</li>
              <li>Oikeus tietojesi poistamiseen ("oikeus tulla unohdetuksi")</li>
              <li>Oikeus käsittelyn rajoittamiseen tietyissä tilanteissa</li>
              <li>Oikeus tietojen siirrettävyyteen</li>
              <li>Oikeus vastustaa tietojesi käsittelyä tietyissä tilanteissa</li>
              <li>Oikeus peruuttaa suostumuksesi tietojenkäsittelyyn</li>
            </ul>
            <p className="mb-4">
              Voit käyttää näitä oikeuksia lähettämällä pyynnön sähköpostitse osoitteeseen support@loansimulateharmony.fi. 
              Pyrimme vastaamaan pyyntöösi 30 päivän kuluessa.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietoturva</h2>
            <p className="mb-4">
              Olemme toteuttaneet asianmukaiset tekniset ja organisatoriset toimenpiteet tietojesi suojaamiseksi. 
              Näihin kuuluvat:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Tietojen salaus sekä tiedonsiirrossa että tietokannoissa</li>
              <li>Suojatut palvelimet ja säännölliset tietoturvatarkastukset</li>
              <li>Rajatut käyttöoikeudet henkilöstölle</li>
              <li>Säännölliset varmuuskopiot</li>
            </ul>
            <p className="mb-4">
              Huomaa kuitenkin, että mikään verkossa tapahtuva tiedonsiirto ei ole täysin turvallista, 
              emmekä voi taata 100% turvallisuutta.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietojen säilyttäminen</h2>
            <p className="mb-4">
              Säilytämme tietojasi niin kauan kuin sinulla on aktiivinen tili sovelluksessamme, tai niin kauan kuin on 
              tarpeen palveluidemme tarjoamiseksi. Tämän jälkeen säilytämme tietoja vain siinä määrin ja niin kauan 
              kuin on tarpeen lakisääteisten velvoitteiden täyttämiseksi.
            </p>
            <p className="mb-4">
              Inaktiivisen tilin tiedot säilytetään 12 kuukautta, jonka jälkeen ne voidaan poistaa.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Kansainväliset tiedonsiirrot</h2>
            <p className="mb-4">
              Palvelumme saattaa käyttää palveluntarjoajia, jotka sijaitsevat Euroopan talousalueen (ETA) ulkopuolella. 
              Kaikissa tällaisissa tiedonsiirroissa noudatamme GDPR:n vaatimuksia käyttäen EU:n hyväksymiä 
              vakiosopimuslausekkeita ja muita asianmukaisia suojatoimia tietojesi suojaamiseksi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Lasten tietosuoja</h2>
            <p className="mb-4">
              Sovelluksemme ei ole tarkoitettu alle 18-vuotiaille, emmekä tietoisesti kerää tietoja alle 18-vuotiailta. 
              Jos olet vanhempi tai huoltaja ja uskot lapsesi antaneen meille henkilötietoja, ota yhteyttä, 
              jotta voimme ryhtyä asianmukaisiin toimiin.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Muutokset tietosuojaselosteeseen</h2>
            <p className="mb-4">
              Voimme päivittää tätä tietosuojaselostetta ajoittain heijastaaksemme muutoksia palveluissamme tai 
              lainsäädännössä. Ilmoitamme merkittävistä muutoksista sovelluksessa, sähköpostitse tai muulla 
              sopivalla tavalla.
            </p>
            <p className="mb-4">
              Suosittelemme tarkistamaan tämän selosteen säännöllisesti.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Yhteydenotto</h2>
            <p className="mb-4">
              Jos sinulla on kysyttävää tietosuojaselosteestamme tai tietojesi käsittelystä, ota yhteyttä: 
            </p>
            <p className="mb-4">
              Sähköposti: support@loansimulateharmony.fi
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

export default PrivacyPolicy;
