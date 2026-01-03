import React from "react";
import { GuideTemplate } from "@/components/templates";
import { ProcessFlow, StatCard, StatCardGrid } from "@/components/infographics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle, XCircle } from "lucide-react";

const VelkajarjestelyOpas: React.FC = () => {
  return (
    <GuideTemplate
      title="Velkajärjestely"
      description="Kattava opas velkajärjestelyyn: mikä se on, kuka voi hakea ja miten prosessi etenee. Selkokielellä."
      readTime="15 min"
      updatedAt="Tammikuu 2025"
    >
      {/* Intro */}
      <p className="lead text-xl text-muted-foreground">
        Velkajärjestely on laillinen tapa päästä eroon veloista, kun et enää pysty maksamaan niitä.
        Se antaa sinulle uuden alun.
      </p>

      {/* Key points */}
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 my-8 not-prose">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          Tärkeimmät asiat lyhyesti
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• Velkajärjestely on <strong>laillinen tapa</strong> päästä veloista eroon</li>
          <li>• Maksat velkoja 3-5 vuotta <strong>maksukykysi mukaan</strong></li>
          <li>• Lopuksi loput velat <strong>annetaan anteeksi</strong></li>
          <li>• Hakeminen on <strong>ilmaista</strong> velkaneuvonnan kautta</li>
        </ul>
      </div>

      <h2>Mikä on velkajärjestely?</h2>

      <p>
        Velkajärjestely tarkoittaa sitä, että käräjäoikeus vahvistaa sinulle maksuohjelman.
        Maksat velkoja 3-5 vuotta sen verran kuin sinulla on varaa.
      </p>

      <p>
        Kun maksuohjelma päättyy, loput velat annetaan anteeksi.
        Saat puhtaan pöydän ja voit aloittaa alusta.
      </p>

      {/* Process visualization */}
      <div className="not-prose my-8">
        <ProcessFlow
          title="Näin velkajärjestely etenee"
          steps={[
            { emoji: "📞", title: "Soita", description: "Velkaneuvontaan" },
            { emoji: "📋", title: "Selvitys", description: "Taloustilanne kartoitetaan" },
            { emoji: "📝", title: "Hakemus", description: "Käräjäoikeuteen" },
            { emoji: "⏳", title: "Käsittely", description: "3-6 kuukautta" },
            { emoji: "✅", title: "Päätös", description: "Maksuohjelma alkaa" },
          ]}
        />
      </div>

      <h2>Kuka voi hakea velkajärjestelyä?</h2>

      <p>Voit hakea velkajärjestelyä, jos täytät nämä ehdot:</p>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        {/* Can apply */}
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5" />
            Voit hakea, jos:
          </h4>
          <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
            <li>• Et pysty maksamaan velkojasi</li>
            <li>• Tilanne ei ole väliaikainen</li>
            <li>• Asut Suomessa</li>
            <li>• Olet yrittänyt sopia velkojien kanssa</li>
          </ul>
        </div>

        {/* Cannot apply */}
        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            Esteenä voi olla:
          </h4>
          <ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
            <li>• Velat syntyneet rikoksesta</li>
            <li>• Tahallinen velkaantuminen</li>
            <li>• Aiempi velkajärjestely</li>
            <li>• Omaisuuden piilottelu</li>
          </ul>
        </div>
      </div>

      <Alert className="my-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Huom!</strong> Nämä ovat yleisiä periaatteita. Jokainen tilanne arvioidaan erikseen.
          Ota yhteyttä velkaneuvontaan – he kertovat, sopiiko velkajärjestely juuri sinulle.
        </AlertDescription>
      </Alert>

      <h2>Kuinka kauan velkajärjestely kestää?</h2>

      <p>Maksuohjelma kestää yleensä 3-5 vuotta. Kesto riippuu tilanteestasi:</p>

      <div className="not-prose my-8">
        <StatCardGrid>
          <StatCard
            emoji="📅"
            number={3}
            unit="vuotta"
            label="Lyhyin kesto"
            description="Jos velkasi ovat pieniä"
            variant="success"
          />
          <StatCard
            emoji="📅"
            number={5}
            unit="vuotta"
            label="Pisin kesto"
            description="Yleensä maksimissaan"
            variant="info"
          />
          <StatCard
            emoji="💰"
            number={0}
            unit="€"
            label="Velat lopussa"
            description="Loput annetaan anteeksi"
            variant="success"
          />
        </StatCardGrid>
      </div>

      <h2>Mitä velkajärjestely maksaa?</h2>

      <p>
        <strong>Hakeminen on ilmaista</strong> kun käytät talous- ja velkaneuvontaa.
        He auttavat sinua hakemuksen tekemisessä maksutta.
      </p>

      <p>
        Velkajärjestelyn aikana maksat velkoja <strong>maksukykysi mukaan</strong>.
        Jos sinulla ei ole varaa maksaa mitään, et maksa mitään.
      </p>

      <h2>Miten haen velkajärjestelyä?</h2>

      <ol>
        <li>
          <strong>Soita velkaneuvontaan</strong><br />
          Numero: 0295 660 123 (maksuton, arkisin 8-16)
        </li>
        <li>
          <strong>Varaa aika</strong><br />
          Neuvoja kartoittaa tilanteesi ja kertoo vaihtoehdot
        </li>
        <li>
          <strong>Kokoa paperit</strong><br />
          Neuvoja kertoo mitä tarvitaan
        </li>
        <li>
          <strong>Hakemus tehdään</strong><br />
          Neuvoja auttaa hakemuksen tekemisessä
        </li>
        <li>
          <strong>Odota päätöstä</strong><br />
          Käsittely kestää yleensä 3-6 kuukautta
        </li>
      </ol>

      <h2>Usein kysytyt kysymykset</h2>

      <h3>Vaikuttaako velkajärjestely luottotietoihin?</h3>
      <p>
        Kyllä. Velkajärjestelymerkintä näkyy luottotiedoissa maksuohjelman ajan ja 2 vuotta sen jälkeen.
        Mutta: sinulla on jo todennäköisesti maksuhäiriömerkintöjä, joten tilanne ei juuri pahene.
      </p>

      <h3>Voinko pitää asuntoni?</h3>
      <p>
        Usein kyllä. Jos asuntosi on kohtuullinen ja asuntolainan korot ovat maksuvarasi puitteissa,
        saat yleensä pitää asuntosi.
      </p>

      <h3>Entä jos tuloni muuttuvat?</h3>
      <p>
        Maksuohjelmaa voidaan muuttaa, jos tulosi nousevat tai laskevat merkittävästi.
        Ilmoita muutoksista heti.
      </p>

      <h2>Yhteenveto</h2>

      <p>
        Velkajärjestely on laillinen tapa päästä veloista eroon. Se antaa sinulle uuden alun.
      </p>

      <p>
        <strong>Ensimmäinen askel:</strong> Soita velkaneuvontaan numeroon 0295 660 123.
        He auttavat sinua eteenpäin – maksutta.
      </p>
    </GuideTemplate>
  );
};

export default VelkajarjestelyOpas;
