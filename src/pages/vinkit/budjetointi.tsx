import React from "react";
import { TipTemplate } from "@/components/templates";
import { StatCard, StatCardGrid } from "@/components/infographics";
import { CheckCircle } from "lucide-react";

const BudjetointiVinkit: React.FC = () => {
  return (
    <TipTemplate
      title="7 vinkkiä budjetointiin"
      description="Konkreettiset ohjeet budjetin tekemiseen. Aloita tänään – se on helpompaa kuin luulet."
      category="Budjetointi"
    >
      <p className="lead text-xl text-muted-foreground">
        Budjetti on kartta, joka näyttää minne rahasi menevät.
        Kun tiedät, säästät automaattisesti.
      </p>

      {/* Key numbers */}
      <div className="not-prose my-8">
        <StatCardGrid>
          <StatCard
            emoji="📊"
            number={50}
            unit="%"
            label="Pakollisiin"
            description="Asuminen, ruoka, laskut"
            variant="default"
          />
          <StatCard
            emoji="🎯"
            number={30}
            unit="%"
            label="Haluihin"
            description="Harrastukset, viihde"
            variant="info"
          />
          <StatCard
            emoji="💰"
            number={20}
            unit="%"
            label="Säästöihin"
            description="Tai velkojen maksuun"
            variant="success"
          />
        </StatCardGrid>
        <p className="text-center text-sm text-muted-foreground mt-2">
          50/30/20-sääntö on hyvä lähtökohta. Muokkaa omaan tilanteeseesi.
        </p>
      </div>

      <h2>1. Kirjaa kaikki tulot</h2>
      <p>
        Aloita selvittämällä, paljonko rahaa tulee kuukaudessa.
        Laske yhteen:
      </p>
      <ul>
        <li>Palkka (verojen jälkeen)</li>
        <li>Tuet (asumistuki, lapsilisä, työttömyyskorvaus)</li>
        <li>Muut tulot (vuokratulot, sivutyöt)</li>
      </ul>
      <p>
        <strong>Esimerkki:</strong> Palkka 2000 € + asumistuki 300 € = 2300 € kuukaudessa.
      </p>

      <h2>2. Listaa pakolliset menot</h2>
      <p>
        Pakolliset menot ovat niitä, joita ei voi jättää maksamatta:
      </p>

      <div className="not-prose bg-muted/30 rounded-lg p-4 my-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Vuokra tai vastike</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Sähkö ja vesi</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Ruoka</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Lääkkeet</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Puhelinlasku</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Vakuutukset</span>
          </div>
        </div>
      </div>

      <h2>3. Laske velkamaksut erikseen</h2>
      <p>
        Velat ovat erillinen kategoria. Kirjaa ylös:
      </p>
      <ul>
        <li>Lainan nimi</li>
        <li>Kuukausierä</li>
        <li>Korko</li>
        <li>Jäljellä oleva summa</li>
      </ul>
      <p>
        Näin näet kokonaiskuvan. Käytä meidän{" "}
        <a href="/laskuri">velkalaskuria</a> auttamaan.
      </p>

      <h2>4. Seuraa kulutusta viikon ajan</h2>
      <p>
        <strong>Älä arvaa – mittaa.</strong> Kirjaa jokainen ostos viikon ajan.
        Yllätyt, minne rahat menevät.
      </p>
      <p>
        Käytä puhelimen muistiinpanoja tai yksinkertaista sovellusta.
        Ei tarvitse olla monimutkaista.
      </p>

      <h2>5. Etsi säästökohteita</h2>
      <p>
        Kun tiedät minne rahat menevät, löydät säästökohteita:
      </p>
      <ul>
        <li><strong>Tilaukset:</strong> Käytätkö kaikkia suoratoistopalveluita?</li>
        <li><strong>Ruoka:</strong> Voisitko tehdä ruokaa kotona useammin?</li>
        <li><strong>Vakuutukset:</strong> Oletko kilpailuttanut viime aikoina?</li>
        <li><strong>Puhelin:</strong> Onko liittymäsi sopiva tarpeisiisi?</li>
      </ul>

      <h2>6. Maksa itsellesi ensin</h2>
      <p>
        Kun palkka tulee, siirrä heti osa säästöön tai velkojen maksuun.
        Älä odota kuukauden loppuun – silloin rahaa ei ole.
      </p>
      <p>
        <strong>Esimerkki:</strong> Siirrä 100 € heti tilipäivänä erilliselle tilille.
      </p>

      <h2>7. Tarkista budjetti kuukausittain</h2>
      <p>
        Budjetti ei ole kiveen hakattu. Tarkista se kerran kuukaudessa:
      </p>
      <ul>
        <li>Piditkö kiinni budjetista?</li>
        <li>Muuttuivatko tulot tai menot?</li>
        <li>Mikä toimi, mikä ei?</li>
      </ul>

      {/* Encouragement */}
      <div className="not-prose bg-green-50 dark:bg-green-950/30 rounded-xl p-6 my-8 border border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
          Muista: täydellinen on hyvän vihollinen
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Epätäydellinen budjetti on parempi kuin ei budjettia ollenkaan.
          Aloita yksinkertaisesti. Voit hienosäätää myöhemmin.
        </p>
      </div>

      <h2>Yhteenveto</h2>
      <p>
        Budjetointi on taito, joka kehittyy harjoittelemalla.
        Aloita näillä vinkeillä ja muokkaa omaan tilanteeseesi.
      </p>
      <p>
        <strong>Ensimmäinen askel:</strong> Kirjaa tämän viikon kaikki ostokset ylös.
      </p>
    </TipTemplate>
  );
};

export default BudjetointiVinkit;
