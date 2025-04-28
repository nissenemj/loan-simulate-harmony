
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Käyttöehdot | Velkavapaus.fi</title>
        <meta name="description" content="Käyttöehdot - Velkavapaus.fi" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <NavigationHeader />
        
        <div className="container mx-auto py-8 px-4 max-w-4xl flex-grow">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">Käyttöehdot</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Tervetuloa Velkavapaus.fi -sovellukseen ("Sovellus", "me", "meidän"). Käyttämällä sovellustamme 
              hyväksyt nämä käyttöehdot ("Ehdot") kokonaisuudessaan. Jos et hyväksy näitä ehtoja, älä käytä sovellustamme.
            </p>
            <p className="mb-4">
              Velkavapaus.fi on velkojenhallintasovellus, joka auttaa käyttäjiä suunnittelemaan velkojensa 
              takaisinmaksua ja saavuttamaan taloudellisia tavoitteitaan. Sovellus tarjoaa työkaluja velkojen hallintaan, 
              mutta ei anna taloudellista neuvontaa.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Kelpoisuus</h2>
            <p className="mb-4">
              Käyttääksesi sovellustamme, sinun tulee olla vähintään 18-vuotias ja oikeustoimikelpoinen tekemään sitovia sopimuksia. 
              Käyttämällä sovellusta vahvistat täyttäväsi nämä ehdot.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Sovelluksen käyttö</h2>
            <h3 className="text-xl font-medium mt-6 mb-2">Sallittu käyttö</h3>
            <p className="mb-4">
              Voit käyttää sovellusta:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Omien velkojesi hallintaan ja velanmaksusuunnitelmien luomiseen</li>
              <li>Taloudellisen tilanteesi seuraamiseen</li>
              <li>Sovelluksen toimintojen käyttöön henkilökohtaisiin tarkoituksiin</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Kielletty käyttö</h3>
            <p className="mb-4">
              Et saa käyttää sovellusta:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Laittomiin tarkoituksiin tai lakia rikkovalla tavalla</li>
              <li>Sovelluksen kaatamiseen, häirintään tai vahingoittamiseen</li>
              <li>Sovelluksen kopioimiseen, jäljentämiseen tai muokkaamiseen</li>
              <li>Kaupallisiin tarkoituksiin ilman ennakkolupaa</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttäjätilin vastuut</h2>
            <p className="mb-4">
              Käyttäjänä olet vastuussa:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Käyttäjätunnuksesi ja salasanasi salassapidosta</li>
              <li>Kaikkien käyttäjätililläsi tapahtuvien toimien turvallisuudesta</li>
              <li>Antamiesi tietojen oikeellisuudesta</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietosuoja</h2>
            <p className="mb-4">
              Sovelluksemme ei jaa talouteen liittyviä tietojasi kolmansien osapuolten kanssa. Kaikki sovellukseen 
              syöttämäsi taloudelliset tiedot säilytetään turvallisesti ja niitä käytetään vain velanmaksusuunnitelmien 
              luomiseen ja ylläpitoon.
            </p>
            <p className="mb-4">
              Tarkemmat tiedot henkilötietojesi käsittelystä löydät <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/privacy-policy")}>Tietosuojaselosteestamme</Button>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Affiliate-linkit</h2>
            <p className="mb-4">
              Sovelluksemme sisältää affiliate-linkkejä. Jos klikkaat näitä linkkejä ja suoritat ostoksen tai rekisteröidyt palveluun, 
              saatamme saada komissiota. Tämä ei aiheuta sinulle lisäkustannuksia.
            </p>
            <p className="mb-4">
              Suosittelemme aina tutustumaan huolellisesti kaikkiin palveluihin ennen rekisteröitymistä tai ostoksen tekemistä. 
              Emme ole vastuussa affiliate-kumppaneidemme tarjoamista palveluista tai tuotteista.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Vastuunrajoitus</h2>
            <p className="mb-4">
              Sovelluksemme tarjoaa työkaluja velkojenhallintaan, mutta se EI ole taloudellinen neuvonantaja. 
              Emme takaa, että velanmaksusuunnitelmasi johtaa taloudelliseen menestykseen, emmekä ole vastuussa 
              taloudellisista tappioistasi.
            </p>
            <p className="mb-4">
              Sovellus tarjotaan "sellaisenaan" ilman minkäänlaisia takuita. Emme takaa, että sovellus olisi aina saatavilla, 
              virheetön tai että se täyttäisi kaikki tarpeesi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttöehtojen muutokset</h2>
            <p className="mb-4">
              Pidätämme oikeuden muuttaa näitä käyttöehtoja milloin tahansa. Ilmoitamme muutoksista sähköpostitse 
              tai sovelluksen kautta.
            </p>
            <p className="mb-4">
              Jatkamalla sovelluksen käyttöä päivitysten jälkeen hyväksyt päivitetyt ehdot.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Yhteydenotto</h2>
            <p className="mb-4">
              Jos sinulla on kysyttävää näistä käyttöehdoista, ota yhteyttä: 
            </p>
            <p className="mb-4">
              Sähköposti: <a href="mailto:support@velkavapaus.fi" className="text-primary hover:underline">support@velkavapaus.fi</a>
            </p>
          </section>

          <Separator className="my-6" />
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Velkavapaus.fi. Kaikki oikeudet pidätetään.
          </p>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
