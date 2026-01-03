import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Phone, HandHeart, Building2, MessageCircle, Clock } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface HelpCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  phone?: string;
  isExternal?: boolean;
}

const HelpCard: React.FC<HelpCardProps> = ({
  title,
  description,
  href,
  icon,
  phone,
  isExternal = false,
}) => {
  const CardWrapper = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <CardWrapper {...(linkProps as any)} className="group block">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
              {icon}
            </div>
            <div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {phone && (
                <p className="text-lg font-semibold text-primary mt-1">{phone}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
          <div className="flex items-center gap-2 mt-4 text-primary font-medium">
            {isExternal ? "Siirry sivulle" : "Lue lisää"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

const helpResources = [
  {
    title: "Talous- ja velkaneuvonta",
    description: "Maksuton apu velkaongelmiin. He auttavat budjetoinnissa, velkajärjestelyssä ja neuvottelussa velkojien kanssa.",
    href: "/apua/velkaneuvonta",
    icon: <Building2 className="h-6 w-6" />,
    phone: "0295 660 123",
  },
  {
    title: "Kriisipuhelin",
    description: "Jos velkahuolet painavat liikaa, saat puhua luottamuksella. Auki 24/7.",
    href: "/apua/kriisiapu",
    icon: <Phone className="h-6 w-6" />,
    phone: "09 2525 0111",
  },
  {
    title: "Takuusäätiö",
    description: "Velkojen järjestely ja pienlainat velkakierteen katkaisemiseen. Soita ja kysy, voivatko auttaa.",
    href: "https://www.takuusaatio.fi",
    icon: <HandHeart className="h-6 w-6" />,
    phone: "0800 9 8009",
    isExternal: true,
  },
  {
    title: "Seurakuntien diakoniatyö",
    description: "Apua taloudelliseen hätään riippumatta uskonnosta. Myös ruoka-apua ja keskusteluapua.",
    href: "https://evl.fi/apua-ja-tukea/taloudellinen-apu",
    icon: <MessageCircle className="h-6 w-6" />,
    isExternal: true,
  },
];

const ApuaIndex: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Apua | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Velkaongelmiin saa apua. Löydä velkaneuvonta, kriisiapu ja muut tukipalvelut. Kaikki palvelut ovat maksuttomia."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <HandHeart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Apua</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Et ole yksin. Nämä palvelut ovat maksuttomia ja luottamuksellisia.
          </p>
        </div>
      </section>

      {/* Quick contact */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <CrisisHelp variant="prominent" />
        </div>
      </section>

      {/* Help Resources Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Mistä saat apua?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {helpResources.map((resource) => (
              <HelpCard key={resource.title} {...resource} />
            ))}
          </div>
        </div>
      </section>

      {/* When to seek help */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Milloin kannattaa ottaa yhteyttä?</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Ennen kuin tilanne pahenee</p>
                <p className="text-muted-foreground text-sm">
                  Mitä aikaisemmin otat yhteyttä, sitä enemmän vaihtoehtoja on. Älä odota.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Kun et pysty maksamaan laskuja</p>
                <p className="text-muted-foreground text-sm">
                  Yksikin maksamaton lasku on syy ottaa yhteyttä. He auttavat neuvottelemaan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Kun velat vievät yöunet</p>
                <p className="text-muted-foreground text-sm">
                  Stressi velkoista on todellinen. Puhuminen auttaa, ja ammattilaiset voivat tehdä konkreettisen suunnitelman.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Kun olet saanut perintäkirjeen</p>
                <p className="text-muted-foreground text-sm">
                  Perintäkirje ei tarkoita, että olet menettänyt kaiken. Vielä on vaihtoehtoja.
                </p>
              </div>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-8 text-center bg-green-50 dark:bg-green-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Ammattilaiset ovat nähneet kaiken. Tilannettasi ei arvostella – sinua autetaan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApuaIndex;
