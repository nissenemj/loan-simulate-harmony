
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Tietosuojaseloste | Velkavapaus.fi</title>
        <meta 
          name="description" 
          content="Velkavapaus.fi tietosuojaseloste - Miten keräämme, käsittelemme ja suojaamme henkilötietojasi palvelussamme." 
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Tietosuojaseloste | Velkavapaus.fi",
              "description": "Velkavapaus.fi tietosuojaseloste - Miten keräämme, käsittelemme ja suojaamme henkilötietojasi palvelussamme.",
              "publisher": {
                "@type": "Organization",
                "name": "Velkavapaus.fi",
                "url": "https://velkavapaus.fi"
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
          
          <h1 className="text-3xl font-bold mb-6">Tietosuojaseloste</h1>
          <p className="text-muted-foreground mb-6">Voimassa alkaen: 1.5.2023</p>
          
          <Separator className="my-6" />
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Johdanto</h2>
            <p className="mb-4">
              Me Velkavapaus.fi:ssä arvostamme yksityisyyttäsi ja olemme sitoutuneet suojelemaan henkilötietojasi. 
              Tämä tietosuojaseloste kertoo, miten keräämme, käytämme ja suojaamme tietojasi käyttäessäsi sovellustamme.
            </p>
            <p className="mb-4">
              Velkavapaus.fi on velkojenhallintasovellus, joka auttaa sinua suunnittelemaan velkojen takaisinmaksua 
              ja saavuttamaan taloudellisia tavoitteitasi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Keräämämme tiedot</h2>
            <p className="mb-2">
              Keräämme seuraavia tietoja, jotta voimme tarjota sinulle velkojenhallintapalvelun:
            </p>
            <h3 className="text-xl font-medium mt-6 mb-2">Henkilötiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sähköpostiosoite (rekisteröitymisen yhteydessä)</li>
              <li>Salasana (suojattu ja salattu)</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Taloudelliset tiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Lisäämäsi velkatiedot (saldo, korko, minimaksut)</li>
              <li>Sovelluksessa luomasi takaisinmaksusuunnitelmat</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-2">Käyttötiedot</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sovelluksen käyttöön liittyvät anonyymit tiedot analytiikkaa varten</li>
              <li>Evästeet sovelluksen toiminnallisuuden varmistamiseksi</li>
            </ul>
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
              <li>Palvelun toimivuuden varmistamiseen</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietojen jakaminen</h2>
            <p className="mb-4">
              Emme myy, vuokraa tai jaa henkilötietojasi kolmansille osapuolille. Taloustietojasi ei luovuteta muille tahoille.
            </p>
            <p className="mb-4">
              Sivustomme voi sisältää affiliate-linkkejä yhteistyökumppaneidemme sivustoille. Kun napsautat näitä linkkejä, 
              saatat siirtyä pois sivustoltamme. Näillä sivustoilla on omat tietosuojakäytäntönsä, joihin kannustamme tutustumaan.
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
              <li>Oikeus tietojesi poistamiseen</li>
              <li>Oikeus tietojen siirrettävyyteen</li>
              <li>Oikeus peruuttaa suostumuksesi tietojenkäsittelyyn</li>
            </ul>
            <p className="mb-4">
              Voit käyttää näitä oikeuksia lähettämällä pyynnön sähköpostitse osoitteeseen support@velkavapaus.fi.
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
              <li>Säännölliset tietoturvatarkastukset</li>
              <li>Rajatut käyttöoikeudet</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Tietojen säilyttäminen</h2>
            <p className="mb-4">
              Säilytämme tietojasi niin kauan kuin sinulla on aktiivinen tili sovelluksessamme. 
              Voit milloin tahansa poistaa tilisi, jolloin kaikki henkilökohtaiset tietosi poistetaan.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Evästeet</h2>
            <p className="mb-4">
              Velkavapaus.fi käyttää evästeitä sivuston toiminnallisuuden varmistamiseksi. 
              Voit muokata evästeasetuksiasi selaimesi asetuksista.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Muutokset tietosuojaselosteeseen</h2>
            <p className="mb-4">
              Voimme päivittää tätä tietosuojaselostetta ajoittain heijastaaksemme muutoksia palveluissamme tai 
              lainsäädännössä. Ilmoitamme merkittävistä muutoksista sovelluksessa, sähköpostitse tai muulla 
              sopivalla tavalla.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Yhteydenotto</h2>
            <p className="mb-4">
              Jos sinulla on kysyttävää tietosuojaselosteestamme tai tietojesi käsittelystä, ota yhteyttä: 
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

export default PrivacyPolicy;
