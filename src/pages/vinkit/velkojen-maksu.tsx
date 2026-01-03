import React from "react";
import { TipTemplate } from "@/components/templates";
import { ProcessFlow, ComparisonTable, StatCard, StatCardGrid } from "@/components/infographics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const VelkojenMaksuVinkit: React.FC = () => {
  return (
    <TipTemplate
      title="6 vinkkiä velkojen maksuun"
      description="Strategiat ja konkreettiset ohjeet velkojen tehokkaaseen maksamiseen. Lumipallo vai lumivyöry?"
      category="Velkojen maksu"
    >
      <p className="lead text-xl text-muted-foreground">
        Velkojen maksaminen voi tuntua ylivoimaiselta, mutta oikealla strategialla pääset eteenpäin.
        Jokainen maksettu euro on askel kohti vapautta.
      </p>

      <h2>1. Valitse strategia: lumivyöry vai lumipallo?</h2>
      <p>
        Kaksi toimivaa tapaa maksaa velkoja:
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🏔️ Lumivyöry
          </h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
            Maksa ensin velka, jolla on <strong>korkein korko</strong>.
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
            → Säästät eniten rahaa pitkällä aikavälillä
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            ⛄ Lumipallo
          </h4>
          <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">
            Maksa ensin <strong>pienin velka</strong> kokonaan pois.
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
            → Pienet voitot motivoivat jatkamaan
          </p>
        </div>
      </div>

      <Alert className="my-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Kumpi on parempi?</strong> Molemmat toimivat!
          Valitse se, joka tuntuu sinulle sopivammalta.
          Tärkeintä on aloittaa.
        </AlertDescription>
      </Alert>

      <div className="not-prose my-8">
        <ComparisonTable
          title="Lumivyöry vs. lumipallo"
          headers={["", "Lumivyöry", "Lumipallo"]}
          rows={[
            ["Järjestys", "Korkein korko ensin", "Pienin velka ensin"],
            ["Säästö koroissa", "Enemmän", "Vähemmän"],
            ["Motivaatio", "Hitaampi alku", "Nopeat voitot"],
            ["Kenelle sopii?", "Numeroihmisille", "Motivaation tarvitsijoille"],
          ]}
        />
      </div>

      <h2>2. Maksa aina minimierät</h2>
      <p>
        <strong>Tämä on ehdoton sääntö.</strong> Maksa jokaisen velan minimierä ajallaan.
        Myöhästymismaksut ja maksuhäiriömerkinnät tekevät tilanteesta vain pahemman.
      </p>
      <p>
        Jos et pysty maksamaan minimeriä, ota heti yhteyttä velkojaan.
        Useimmat suostuvat maksusuunnitelmaan.
      </p>

      <h2>3. Keskitä lisämaksut yhteen velkaan</h2>
      <p>
        Kun maksat minimierät, laita kaikki ylimääräinen <strong>yhteen velkaan</strong>.
        Älä jaa tasaisesti – se hidastaa.
      </p>

      <div className="not-prose my-8">
        <ProcessFlow
          title="Näin velkojen maksu etenee"
          steps={[
            { emoji: "📋", title: "Listaa", description: "Kaikki velat ylös" },
            { emoji: "🎯", title: "Valitse", description: "Kohdeluotto" },
            { emoji: "💳", title: "Minimierät", description: "Muihin velkoihin" },
            { emoji: "💪", title: "Lisämaksut", description: "Kohdeluottoon" },
            { emoji: "✅", title: "Valmis!", description: "Siirry seuraavaan" },
          ]}
        />
      </div>

      <h2>4. Etsi lisätuloja velkojen maksuun</h2>
      <p>
        Säästämisen lisäksi voit etsiä lisätuloja:
      </p>
      <ul>
        <li><strong>Myy turhaa tavaraa:</strong> Tori.fi, Facebook Marketplace</li>
        <li><strong>Sivutyöt:</strong> Keikkatyö, freelance</li>
        <li><strong>Veronpalautus:</strong> Laita suoraan velkoihin</li>
        <li><strong>Bonukset ja lahjat:</strong> Edes osa velkoihin</li>
      </ul>

      <div className="not-prose my-8">
        <StatCardGrid>
          <StatCard
            emoji="📦"
            number={100}
            unit="€"
            label="Tavaran myynti"
            description="Tavaroita kaapista"
            variant="info"
          />
          <StatCard
            emoji="🎁"
            number={50}
            unit="€"
            label="Lahjarahat"
            description="Suoraan velkaan"
            variant="info"
          />
          <StatCard
            emoji="📈"
            number={150}
            unit="€"
            label="Lisämaksu"
            description="Kuukauden vaikutus"
            variant="success"
          />
        </StatCardGrid>
      </div>

      <h2>5. Neuvottele velkojen kanssa</h2>
      <p>
        Velkojat haluavat saada rahansa takaisin. He usein suostuvat:
      </p>
      <ul>
        <li><strong>Pienentämään korkoa</strong></li>
        <li><strong>Pidentämään maksuaikaa</strong></li>
        <li><strong>Jäädyttämään korot väliaikaisesti</strong></li>
        <li><strong>Sopimaan kertasuorituksesta alennuksella</strong></li>
      </ul>
      <p>
        <strong>Soita ja kysy.</strong> Pahimmassa tapauksessa vastaus on ei.
        Parhaimmassa säästät satoja euroja.
      </p>

      <h2>6. Juhli pieniä voittoja</h2>
      <p>
        Velkojen maksaminen on pitkä projekti. Pidä motivaatio yllä:
      </p>
      <ul>
        <li>Merkitse kalenteri kun velka on maksettu</li>
        <li>Kerro läheisille edistymisestäsi</li>
        <li>Palkitse itseäsi pienillä asioilla (ei uusilla veloilla!)</li>
        <li>Visualisoi tavoite – mitä teet kun olet velkavapaa?</li>
      </ul>

      {/* Important note */}
      <div className="not-prose bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6 my-8 border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Jos velat tuntuvat ylivoimaisilta
        </h3>
        <p className="text-amber-700 dark:text-amber-300">
          Jos et pysty maksamaan edes minimieriä, älä jää yksin.
          Talous- ja velkaneuvonta auttaa <strong>maksutta</strong>.
          Soita: 0295 660 123 (arkisin 8-16).
        </p>
      </div>

      <h2>Yhteenveto</h2>
      <p>
        Velkojen maksaminen vaatii suunnitelman ja kärsivällisyyttä.
        Valitse strategia (lumivyöry tai lumipallo) ja pidä siitä kiinni.
      </p>
      <p>
        <strong>Ensimmäinen askel:</strong> Listaa kaikki velkasi.
        Käytä meidän <a href="/laskuri">velkalaskuria</a> apuna.
      </p>
    </TipTemplate>
  );
};

export default VelkojenMaksuVinkit;
