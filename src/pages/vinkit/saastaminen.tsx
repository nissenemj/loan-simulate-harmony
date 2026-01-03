import React from "react";
import { TipTemplate } from "@/components/templates";
import { StatCard, StatCardGrid, ComparisonTable } from "@/components/infographics";

const SaastaminenVinkit: React.FC = () => {
  return (
    <TipTemplate
      title="5 helppoa säästövinkkiä"
      description="Pienet teot, isot tulokset. Jokainen säästetty euro vie lähemmäs velkavapautta."
      category="Säästäminen"
    >
      <p className="lead text-xl text-muted-foreground">
        Säästäminen ei tarkoita kaiken mukavan lopettamista.
        Pienetkin muutokset kertyvät isoiksi summiksi ajan kanssa.
      </p>

      {/* Impact visualization */}
      <div className="not-prose my-8">
        <StatCardGrid>
          <StatCard
            emoji="☕"
            number={5}
            unit="€/pv"
            label="Kahvi ulkona"
            description="= 150 €/kk"
            variant="warning"
          />
          <StatCard
            emoji="🏠"
            number={0.5}
            unit="€/pv"
            label="Kahvi kotona"
            description="= 15 €/kk"
            variant="success"
          />
          <StatCard
            emoji="💰"
            number={135}
            unit="€/kk"
            label="Säästö"
            description="= 1620 €/vuosi"
            variant="success"
          />
        </StatCardGrid>
      </div>

      <h2>1. 24 tunnin sääntö</h2>
      <p>
        Ennen kuin ostat jotain yli 50 €, <strong>odota vuorokausi</strong>.
        Usein huomaat seuraavana päivänä, ettet tarvitsekaan sitä.
      </p>
      <p>
        Tämä yksinkertainen sääntö estää monta hetken mielijohteesta tehtyä ostosta.
      </p>

      <h2>2. Kilpailuta säännöllisesti</h2>
      <p>
        Kerran vuodessa, kilpailuta nämä:
      </p>
      <ul>
        <li><strong>Vakuutukset:</strong> Säästö voi olla satoja euroja</li>
        <li><strong>Sähkösopimus:</strong> Varsinkin jos on ollut sama vuosia</li>
        <li><strong>Puhelinliittymä:</strong> Hinnat muuttuvat jatkuvasti</li>
        <li><strong>Nettiyhteys:</strong> Usein saa parempaa halvemmalla</li>
      </ul>
      <p>
        <strong>Vinkki:</strong> Kilpailutus on helppoa netissä.
        Varaa yksi iltapäivä ja hoida kaikki kerralla.
      </p>

      <h2>3. Tee ruokalista</h2>
      <p>
        Ruoka on monella suurin menoerä asumisen jälkeen.
        Suunnittelu säästää rahaa ja aikaa:
      </p>
      <ul>
        <li>Tee viikon ruokalista sunnuntaina</li>
        <li>Käy kaupassa listan kanssa – älä poikkea</li>
        <li>Hyödynnä tarjoukset ruokalistan pohjalta</li>
        <li>Tee isompia annoksia ja pakasta</li>
      </ul>

      <div className="not-prose my-8">
        <ComparisonTable
          title="Ruokaostokset: suunniteltu vs. suunnittelematon"
          headers={["", "Suunnittelematon", "Suunniteltu"]}
          rows={[
            { label: "Kauppareissuja/vko", values: ["4-5 kertaa", "1-2 kertaa"] },
            { label: "Heräteostoksia", values: ["Paljon", "Vähän"] },
            { label: "Ruokahävikki", values: ["Paljon", "Minimaalinen"] },
            { label: "Kustannus/vko", values: ["~150 €", "~100 €"] },
          ]}
        />
      </div>

      <h2>4. Käytä käteistä</h2>
      <p>
        Kokeile maksaa käteisellä kuukausi. Näin:
      </p>
      <ol>
        <li>Nosta kuukauden "vapaa raha" käteiseksi</li>
        <li>Jaa kirjekuoriin: ruoka, vapaa-aika, muut</li>
        <li>Kun kuori on tyhjä, se on tyhjä</li>
      </ol>
      <p>
        Käteinen tekee kulutuksen <strong>näkyväksi</strong>.
        Korttia heilauttaessa raha ei tunnu todelliselta.
      </p>

      <h2>5. Automaattinen säästäminen</h2>
      <p>
        Tee säästämisestä automaattista:
      </p>
      <ul>
        <li>Avaa erillinen säästötili</li>
        <li>Aseta tilisiirto tilipäivälle</li>
        <li>Aloita pienellä summalla (vaikkapa 20 €/kk)</li>
        <li>Kasvata summaa kun mahdollista</li>
      </ul>
      <p>
        Kun raha siirtyy automaattisesti, et joudu tekemään päätöstä joka kuukausi.
        <strong>Mitä et näe, sitä et kuluta.</strong>
      </p>

      {/* Extra tip */}
      <div className="not-prose bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6 my-8 border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Bonusvinkki: 1 € säännöt
        </h3>
        <p className="text-amber-700 dark:text-amber-300 mb-3">
          Kokeile näitä pieniä muutoksia:
        </p>
        <ul className="space-y-1 text-amber-700 dark:text-amber-300 text-sm">
          <li>• Juo vesijohtovettä ravintolassa (+0-3 €/ateria)</li>
          <li>• Tee lounas kotona (+5-10 €/päivä)</li>
          <li>• Kävele lyhyet matkat (+2-5 €/päivä)</li>
          <li>• Lainaa kirjastosta (+10-30 €/kirja)</li>
        </ul>
      </div>

      <h2>Yhteenveto</h2>
      <p>
        Säästäminen on maratoni, ei sprintti.
        Valitse 1-2 vinkkiä ja aloita niistä.
        Kun ne ovat tulleet tavaksi, lisää uusia.
      </p>
      <p>
        <strong>Ensimmäinen askel:</strong> Aseta automaattinen tilisiirto säästötilille jo tänään.
      </p>
    </TipTemplate>
  );
};

export default SaastaminenVinkit;
