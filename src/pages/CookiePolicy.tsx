
import React from "react";
import { Helmet } from "react-helmet-async";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Evästekäytäntö | Velkavapaus.fi</title>
        <meta 
          name="description" 
          content="Selvitä miten Velkavapaus.fi käyttää evästeitä parantaakseen käyttäjäkokemustasi. Tutustu evästekäytäntöihimme ja opi hallitsemaan evästeasetuksiasi." 
        />
        <meta name="keywords" content="evästeet, evästekäytäntö, cookies, verkkopalvelu, yksityisyys" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Evästekäytäntö | Velkavapaus.fi",
              "description": "Velkavapaus.fi evästekäytäntö - Tietoa siitä, miten käytämme evästeitä sivustollamme ja miten voit hallita niitä.",
              "publisher": {
                "@type": "Organization",
                "name": "Velkavapaus.fi",
                "url": "https://velkavapaus.fi"
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Etusivu",
                    "item": "https://velkavapaus.fi"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Evästekäytäntö",
                    "item": "https://velkavapaus.fi/cookie-policy"
                  }
                ]
              },
              "datePublished": "2023-05-01",
              "dateModified": "${new Date().toISOString().split('T')[0]}"
            }
          `}
        </script>
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
          
          <h1 className="text-3xl font-bold mb-6">Evästekäytäntö</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Tämä evästekäytäntö selittää, mitä evästeet ovat ja miten niitä käytämme Velkavapaus.fi-sivustolla. 
              Käyttämällä sivustoamme hyväksyt evästeiden käytön tämän käytännön mukaisesti.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Mitä evästeet ovat?</h2>
            <p className="mb-4">
              Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan laitteellesi (tietokoneelle, tabletille, älypuhelimelle) 
              vieraillessasi verkkosivustolla. Evästeet auttavat sivustoa muistamaan tietojasi, kuten kirjautumistietoja, 
              kieliasetuksia ja muita asetuksia.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Miten käytämme evästeitä?</h2>
            <p className="mb-4">
              Käytämme evästeitä seuraaviin tarkoituksiin:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Välttämättömät evästeet:</strong> Nämä evästeet ovat välttämättömiä sivuston toiminnalle ja 
                  mahdollistavat perustoiminnot, kuten sivustolla navigoinnin ja suojattujen alueiden käytön.</li>
              <li><strong>Toiminnalliset evästeet:</strong> Nämä evästeet mahdollistavat sivuston muistamaan valintasi 
                  (kuten kieliasetukset) ja tarjoamaan paremman käyttökokemuksen.</li>
              <li><strong>Suorituskykyevästeet:</strong> Nämä evästeet keräävät tietoja siitä, miten käytät sivustoa, 
                  esimerkiksi mitä sivuja vierailet useimmin. Näiden tietojen avulla voimme parantaa sivuston toimintaa.</li>
              <li><strong>Markkinointievästeet:</strong> Nämä evästeet käytetään seuraamaan kävijöitä eri sivustoilla. 
                  Niitä käytetään näyttämään mainoksia, jotka ovat osuvia ja kiinnostavia yksittäisille käyttäjille.</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Mainontaan liittyvät evästeet</h2>
            <p className="mb-4">
              Käytämme Google AdSense -palvelua näyttääksemme mainoksia sivustollamme. Google AdSense käyttää evästeitä
              näyttääkseen sinulle kiinnostustesi mukaisia mainoksia. Nämä evästeet voivat tallentaa tietoja 
              selainhistoriastasi, käyttämistäsi sivustoista ja muista selaintiedoista tarjotakseen osuvampaa mainontaa.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-2">Google AdSense -evästeet</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>_ga, _gid: Google Analytics -evästeet, joita käytetään kävijätilastojen keräämiseen</li>
              <li>IDE, DSID: Doubleclick-evästeet, joita Google käyttää mainontaan</li>
              <li>APISID, HSID, NID, SID: Google-evästeet, joita käytetään tunnistamaan käyttäjiä ja heidän mieltymyksiään</li>
            </ul>
            
            <p className="mb-4">
              Voit hallita Googlen käyttämiä mainontaevästeitä tai kieltäytyä personoidusta mainonnasta osoitteessa: 
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                https://adssettings.google.com
              </a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Kolmannen osapuolen evästeet</h2>
            <p className="mb-4">
              Saatamme käyttää kolmannen osapuolen palveluita, jotka asettavat omia evästeitään laitteellesi. 
              Tällaisia palveluita voivat olla esimerkiksi sosiaalisen median jakopainikkeet ja upotetut videot. 
              Emme voi hallita näitä evästeitä, joten suosittelemme tarkistamaan kyseisten kolmansien osapuolten 
              evästekäytännöt saadaksesi lisätietoja.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Evästeiden hallinta</h2>
            <p className="mb-4">
              Voit hallita evästeitä selaimesi asetuksista. Voit estää evästeiden käytön kokonaan, poistaa 
              olemassa olevia evästeitä tai asettaa selaimesi ilmoittamaan, kun uusi eväste yritetään asettaa 
              laitteellesi. Huomaa, että evästeiden estäminen voi vaikuttaa sivuston toimintaan ja käyttökokemukseen.
            </p>
            <p className="mb-4">
              Lisätietoja evästeiden hallinnasta löydät selaimesi ohjeista tai osoitteesta 
              <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                www.aboutcookies.org
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Muutokset evästekäytäntöön</h2>
            <p className="mb-4">
              Saatamme päivittää tätä evästekäytäntöä ajoittain. Muutokset astuvat voimaan, kun päivitetty 
              käytäntö julkaistaan sivustollamme. Suosittelemme tarkistamaan tämän käytännön säännöllisesti 
              pysyäksesi ajan tasalla evästeiden käytöstämme.
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
            © {new Date().getFullYear()} Velkavapaus.fi. Kaikki oikeudet pidätetään.
          </p>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default CookiePolicy;
