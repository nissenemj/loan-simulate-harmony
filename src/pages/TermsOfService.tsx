
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Käyttöehdot | Loan Simulate Harmony</title>
        <meta name="description" content="Käyttöehdot - Loan Simulate Harmony" />
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
          
          <h1 className="text-3xl font-bold mb-6">Käyttöehdot</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Tervetuloa Loan Simulate Harmony -sovellukseen ("Sovellus", "me", "meidän"). Käyttämällä sovellustamme 
              hyväksyt nämä käyttöehdot ("Ehdot") kokonaisuudessaan. Jos et hyväksy näitä ehtoja, älä käytä sovellustamme.
            </p>
            <p className="mb-4">
              Loan Simulate Harmony on velkojenhallintasovellus, joka auttaa käyttäjiä suunnittelemaan velkojensa 
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
              <li>Tietomurtoihin tai luvattomaan pääsyyn sovelluksen osiin</li>
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
              <li>Antamiesi tietojen oikeellisuudesta ja ajantasaisuudesta</li>
            </ul>
            <p className="mb-4">
              Sinut voidaan pitää vastuussa menetyksistä, jotka aiheutuvat toiselle henkilölle antamiesi 
              käyttäjätilitietojen käytöstä. Ilmoita meille välittömästi, jos epäilet tietojesi joutuneen vääriin käsiin.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Immateriaalioikeudet</h2>
            <p className="mb-4">
              Kaikki sovellukseen liittyvät immateriaalioikeudet (kuten tekijänoikeudet, tavaramerkit, patentit) ovat 
              meidän tai lisenssinantajiemme omaisuutta. Sovelluksen käyttö ei anna sinulle minkäänlaisia oikeuksia näihin 
              immateriaalioikeuksiin.
            </p>
            <p className="mb-4">
              Et saa kopioida, jäljentää, muokata, julkaista, levittää tai luoda johdannaisteoksia sovelluksesta tai 
              mistään sen osasta ilman ennakkolupaa.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Affiliate-linkit</h2>
            <p className="mb-4">
              Sovelluksemme sisältää affiliate-linkkejä (esim. Ferratum Business Adtractionin kautta ja Nordnet Adservicen kautta). 
              Jos klikkaat näitä linkkejä ja suoritat ostoksen tai rekisteröidyt palveluun, saatamme saada komissiota. 
              Tämä ei aiheuta sinulle lisäkustannuksia.
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
              Sovellus tarjotaan "sellaisenaan" ja "sellaisena kuin se on saatavilla" ilman minkäänlaisia takuita, 
              joko suoria tai epäsuoria. Emme takaa, että:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sovellus vastaa vaatimuksiasi</li>
              <li>Sovellus toimii keskeytyksettä, on ajantasainen tai virheettömä</li>
              <li>Virheitä korjataan</li>
              <li>Sovellus on vapaa viruksista tai muista haitallisista komponenteista</li>
            </ul>
            <p className="mb-4">
              Emme ole sovellettavan lain sallimissa rajoissa vastuussa mistään epäsuorista, satunnaisista, 
              erityisistä tai välillisistä vahingoista, jotka aiheutuvat sovelluksen käytöstä tai käytön 
              estymisestä.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttäjätilin päättäminen</h2>
            <p className="mb-4">
              Voimme oman harkintamme mukaan päättää, keskeyttää tai rajoittaa pääsyäsi sovellukseen välittömästi 
              ilman ennakkoilmoitusta tai vastuuta seuraavissa tapauksissa:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Rikot näitä käyttöehtoja</li>
              <li>Epäilemme perustellusti, että olet osallistunut petolliseen toimintaan</li>
              <li>Käytät sovellusta laittomiin tarkoituksiin</li>
              <li>Käyttäjätilisi on ollut passiivinen yli 12 kuukautta</li>
            </ul>
            <p className="mb-4">
              Voit myös itse poistaa käyttäjätilisi milloin tahansa sovelluksen asetuksista tai ottamalla yhteyttä 
              asiakaspalveluumme.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Käyttöehtojen muutokset</h2>
            <p className="mb-4">
              Pidätämme oikeuden muuttaa näitä käyttöehtoja milloin tahansa. Ilmoitamme muutoksista sähköpostitse, 
              sovelluksen kautta tai julkaisemalla päivitetyt ehdot sovelluksessa.
            </p>
            <p className="mb-4">
              Muutokset tulevat voimaan heti, kun ne on julkaistu. Jatkamalla sovelluksen käyttöä päivitysten jälkeen 
              hyväksyt päivitetyt ehdot.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Sovellettava laki</h2>
            <p className="mb-4">
              Näihin käyttöehtoihin sovelletaan Suomen lakia. Kaikki riidat, jotka johtuvat näistä ehdoista tai 
              liittyvät niihin, ratkaistaan ensisijaisesti neuvottelemalla. Jos neuvottelut eivät johda ratkaisuun, 
              riita ratkaistaan Suomen tuomioistuimissa.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Yhteydenotto</h2>
            <p className="mb-4">
              Jos sinulla on kysyttävää näistä käyttöehdoista, ota yhteyttä: 
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

export default TermsOfService;
