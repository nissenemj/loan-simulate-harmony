import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Phone, Clock, CheckCircle, Building2 } from "lucide-react";
import { ProcessFlow, StatCard, StatCardGrid } from "@/components/infographics";
import CrisisHelp from "@/components/CrisisHelp";

const VelkaneuvontaSivu: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Talous- ja velkaneuvonta | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Talous- ja velkaneuvonta auttaa maksutta velkaongelmissa. Näin otat yhteyttä ja näin prosessi etenee."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Etusivu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/apua" className="hover:text-foreground transition-colors">
              Apua
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Velkaneuvonta</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Tukipalvelu
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Talous- ja velkaneuvonta
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            Maksuton, ammattimainen apu velkaongelmiin. Oikeusaputoimistojen palvelu.
          </p>

          {/* Quick contact */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold text-lg">Soita velkaneuvontaan</p>
                <p className="text-muted-foreground">Arkisin klo 8-16, maksuton puhelu</p>
              </div>
              <a
                href="tel:0295660123"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-5 w-5" />
                0295 660 123
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <StatCardGrid>
            <StatCard
              emoji="💰"
              number={0}
              unit="€"
              label="Hinta"
              description="Palvelu on maksuton"
              variant="success"
            />
            <StatCard
              emoji="🔒"
              number={100}
              unit="%"
              label="Luottamuksellinen"
              description="Tietosi ovat turvassa"
              variant="info"
            />
            <StatCard
              emoji="👥"
              number={50000}
              unit="+"
              label="Asiakasta/vuosi"
              description="Et ole yksin"
              variant="default"
            />
          </StatCardGrid>
        </div>
      </section>

      {/* What they help with */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Missä velkaneuvonta auttaa?</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium">Taloustilanteen kartoitus</p>
              </div>
              <p className="text-muted-foreground text-sm">
                Selvitetään tulot, menot ja velat. Tehdään kokonaiskuva tilanteesta.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium">Neuvottelu velkojien kanssa</p>
              </div>
              <p className="text-muted-foreground text-sm">
                Autetaan sopimaan maksujärjestelyistä ja pienemmistä koroista.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium">Velkajärjestelyhakemus</p>
              </div>
              <p className="text-muted-foreground text-sm">
                Laaditaan hakemus käräjäoikeuteen, jos velkajärjestely on paras vaihtoehto.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium">Budjetointiapu</p>
              </div>
              <p className="text-muted-foreground text-sm">
                Tehdään realistinen budjetti ja suunnitelma velkojen maksamiseen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Näin pääset alkuun</h2>

          <ProcessFlow
            title=""
            steps={[
              { emoji: "📞", title: "Soita", description: "0295 660 123" },
              { emoji: "📅", title: "Varaa aika", description: "Saat neuvonta-ajan" },
              { emoji: "📋", title: "Valmistaudu", description: "Kokoa paperit" },
              { emoji: "👤", title: "Tapaaminen", description: "Tilanne kartoitetaan" },
              { emoji: "📝", title: "Suunnitelma", description: "Tehdään yhdessä" },
            ]}
          />

          <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mitä ottaa mukaan tapaamiseen?
            </h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300">
              <li>• Viimeisimmät palkkalaskelmat tai päätös etuuksista</li>
              <li>• Lista veloista (velkoja, määrä, kuukausierä)</li>
              <li>• Vuokrasopimus tai asuntolainasopimus</li>
              <li>• Viimeisin verotuspäätös</li>
              <li>• Mahdolliset perintäkirjeet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Usein kysytyt kysymykset</h2>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Kuinka kauan aika kestää saada?</h3>
              <p className="text-muted-foreground">
                Yleensä muutamasta päivästä muutamaan viikkoon riippuen alueesta.
                Kiireellisissä tapauksissa saat ohjeita jo puhelimessa.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Saako työantaja tietää?</h3>
              <p className="text-muted-foreground">
                Ei. Velkaneuvonta on täysin luottamuksellista. Tietojasi ei
                luovuteta kenellekään ilman lupaasi.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Voiko puoliso tulla mukaan?</h3>
              <p className="text-muted-foreground">
                Kyllä. Jos velat ovat yhteisiä tai haluat puolison mukaan, se on
                usein hyvä idea. Voitte myös tulla erikseen.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Entä jos en osaa suomea?</h3>
              <p className="text-muted-foreground">
                Velkaneuvontaa saa myös ruotsiksi. Muilla kielillä voit pyytää tulkin
                mukaan – kerro tarpeesta kun varaat ajan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ota ensimmäinen askel tänään</h2>
          <p className="text-muted-foreground mb-6">
            Soitto maksaa vain muutaman minuutin. Se voi muuttaa kaiken.
          </p>
          <a
            href="tel:0295660123"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
          >
            <Phone className="h-6 w-6" />
            Soita: 0295 660 123
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            Arkisin klo 8-16, maksuton puhelu
          </p>
        </div>
      </section>

      {/* Crisis Help */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <CrisisHelp variant="compact" />
        </div>
      </section>
    </div>
  );
};

export default VelkaneuvontaSivu;
