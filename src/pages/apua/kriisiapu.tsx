import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Phone, Heart, Clock, MessageCircle, Shield } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

const KriisiapuSivu: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Kriisiapu | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Jos velkahuolet tuntuvat ylivoimaisilta, saat puhua luottamuksella. Kriisipuhelin 09 2525 0111 on auki 24/7."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-background dark:from-red-950/20 py-12">
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
            <span className="text-foreground">Kriisiapu</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
              Tukea vaikeassa hetkessä
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kriisiapu
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            Velkahuolet voivat tuntua musertavilta. Et ole yksin – apua on saatavilla.
          </p>
        </div>
      </section>

      {/* Immediate help */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <CrisisHelp variant="prominent" />
        </div>
      </section>

      {/* Understanding section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <h2 className="font-semibold text-amber-800 dark:text-amber-200 text-xl mb-4">
              On okei tuntea pahaa oloa
            </h2>
            <p className="text-amber-700 dark:text-amber-300 mb-4">
              Velat aiheuttavat stressiä, häpeää ja ahdistusta. Nämä ovat normaaleja
              reaktioita vaikeaan tilanteeseen. Et ole huono ihminen – olet ihminen
              vaikeassa tilanteessa.
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              Puhuminen auttaa. Ammattilaiset kuuntelevat ilman tuomitsemista.
            </p>
          </div>
        </div>
      </section>

      {/* Crisis lines detailed */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Kriisipuhelimet</h2>

          <div className="space-y-4">
            {/* MIELI ry */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Kriisipuhelin (MIELI ry)
                  </h3>
                  <a
                    href="tel:0925250111"
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    09 2525 0111
                  </a>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Auki 24/7, joka päivä</span>
                  </div>
                  <p className="text-muted-foreground mt-3">
                    Voit soittaa mihin aikaan tahansa, mistä tahansa syystä.
                    Puheluun vastaa koulutettu vapaaehtoinen tai ammattilainen.
                  </p>
                </div>
              </div>
            </div>

            {/* Sekasin Chat */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Sekasin-chat (alle 29-vuotiaille)
                  </h3>
                  <a
                    href="https://sekasin.fi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-primary hover:underline"
                  >
                    sekasin.fi
                  </a>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ma-pe klo 9-24, vkl klo 15-24</span>
                  </div>
                  <p className="text-muted-foreground mt-3">
                    Jos kirjoittaminen tuntuu helpommalta kuin puhuminen.
                    Chatti on anonyymi ja maksuton.
                  </p>
                </div>
              </div>
            </div>

            {/* Nettiturvakoti */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Nollalinja (väkivallan uhrit)
                  </h3>
                  <a
                    href="tel:0800005005"
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    0800 005 005
                  </a>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Auki 24/7, maksuton</span>
                  </div>
                  <p className="text-muted-foreground mt-3">
                    Jos velkaongelmat liittyvät väkivaltaiseen tilanteeseen
                    tai taloudelliseen väkivaltaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6">Mitä puhelussa tapahtuu?</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium">Sinua kuunnellaan</p>
                <p className="text-muted-foreground">
                  Kerro omin sanoin, miltä tuntuu. Ei tarvitse selittää kaikkea kerralla.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium">Ei arvostelua</p>
                <p className="text-muted-foreground">
                  Ammattilaiset ymmärtävät, että velkaongelmat voivat sattua kenelle tahansa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium">Yhdessä mietitään seuraava askel</p>
                <p className="text-muted-foreground">
                  Yksikin pieni askel eteenpäin voi helpottaa. Sinut ohjataan oikeaan paikkaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Encouragement */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-8 border border-green-200 dark:border-green-800 text-center">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
              Velkaongelmat eivät ole lopullisia
            </h2>
            <p className="text-green-700 dark:text-green-300 text-lg mb-4">
              Vaikka tilanne tuntuu nyt toivottomalta, siitä voi selvitä.
              Tuhannet suomalaiset ovat selvinneet – sinäkin voit.
            </p>
            <p className="text-green-700 dark:text-green-300">
              Ensimmäinen askel on vaikein. Mutta se kannattaa.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-muted-foreground mb-6">
            Jos et pysty soittamaan nyt, tallenna numero puhelimeesi.
            Se on siellä kun tarvitset.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0925250111"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-6 w-6" />
              Soita kriisipuhelimeen
            </a>
            <Link
              to="/apua/velkaneuvonta"
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-muted/80 transition-colors"
            >
              Velkaneuvontaan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KriisiapuSivu;
