import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, PiggyBank, Wallet, CreditCard } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface TipCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  tipCount: number;
}

const TipCard: React.FC<TipCardProps> = ({ title, description, href, icon, tipCount }) => (
  <Link to={href} className="group block">
    <Card className="h-full transition-all hover:shadow-lg hover:border-green-500/50 border-l-4 border-l-green-500">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-400">
            {icon}
          </div>
          <div>
            <CardTitle className="group-hover:text-green-600 transition-colors">
              {title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{tipCount} vinkkiä</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <div className="flex items-center gap-2 mt-4 text-green-600 font-medium">
          Lue vinkit
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const tipCategories = [
  {
    title: "Budjetointi",
    description: "Konkreettiset vinkit budjetin tekemiseen ja noudattamiseen. Näin rahat riittävät.",
    href: "/vinkit/budjetointi",
    icon: <Wallet className="h-6 w-6" />,
    tipCount: 7,
  },
  {
    title: "Säästäminen",
    description: "Pienet ja isot säästövinkit arkeen. Jokainen euro lasketaan.",
    href: "/vinkit/saastaminen",
    icon: <PiggyBank className="h-6 w-6" />,
    tipCount: 5,
  },
  {
    title: "Velkojen maksu",
    description: "Strategiat velkojen tehokkaaseen maksamiseen. Lumipallo vai lumivyöry?",
    href: "/vinkit/velkojen-maksu",
    icon: <CreditCard className="h-6 w-6" />,
    tipCount: 6,
  },
];

const VinkitIndex: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Vinkit | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Konkreettiset vinkit budjetointiin, säästämiseen ja velkojen maksamiseen. Aloita jo tänään."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
              <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Vinkit</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Konkreettiset, helpot vinkit arjen talouteen.
            Pienetkin muutokset auttavat.
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-6">
            {tipCategories.map((category) => (
              <TipCard key={category.href} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick tip */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Päivän vinkki
            </h3>
            <p className="text-muted-foreground">
              <strong>Tee 24 tunnin sääntö:</strong> Ennen kuin ostat jotain yli 50€,
              odota vuorokausi. Usein huomaat, ettet tarvitsekaan sitä.
            </p>
          </div>

          <div className="mt-8">
            <CrisisHelp variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default VinkitIndex;
