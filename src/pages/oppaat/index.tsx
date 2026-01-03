import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Scale, Gavel, CreditCard, FileText } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface GuideCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  readTime: string;
}

const GuideCard: React.FC<GuideCardProps> = ({ title, description, href, icon, readTime }) => (
  <Link to={href} className="group block">
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <span className="text-sm text-muted-foreground">{readTime}</span>
        </div>
        <CardTitle className="mt-4 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <div className="flex items-center gap-2 mt-4 text-primary font-medium">
          Lue opas
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const guides = [
  {
    title: "Velkajärjestely",
    description: "Mikä on velkajärjestely, kuka voi hakea sitä ja miten prosessi etenee? Kattava opas.",
    href: "/oppaat/velkajarjestely",
    icon: <Scale className="h-6 w-6" />,
    readTime: "15 min",
  },
  {
    title: "Ulosotto",
    description: "Miten ulosotto toimii Suomessa? Suojaosuudet, prosessi ja oikeutesi selitettynä.",
    href: "/oppaat/ulosotto",
    icon: <Gavel className="h-6 w-6" />,
    readTime: "12 min",
  },
  {
    title: "Maksuhäiriömerkintä",
    description: "Mitä maksuhäiriömerkintä tarkoittaa, kuinka kauan se kestää ja miten siitä pääsee eroon?",
    href: "/oppaat/maksuhairio",
    icon: <CreditCard className="h-6 w-6" />,
    readTime: "10 min",
  },
  {
    title: "Perintä",
    description: "Mitä tehdä kun perintäkirje tulee? Oikeutesi ja vaihtoehtosi selitettynä.",
    href: "/oppaat/perinta",
    icon: <FileText className="h-6 w-6" />,
    readTime: "8 min",
  },
];

const OppaatIndex: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Oppaat | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Kattavat oppaat velkajärjestelyyn, ulosottoon, maksuhäiriömerkintään ja perintään. Selkokieliset ohjeet velka-asioihin."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Oppaat</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selkokieliset oppaat velka-asioihin. Kaikki mitä tarvitset tietää
            – ilman lakijargonia.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.href} {...guide} />
            ))}
          </div>
        </div>
      </section>

      {/* Help section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Etkö löytänyt etsimääsi?</h2>
            <p className="text-muted-foreground">
              Velkaneuvonta auttaa sinua henkilökohtaisesti ja maksutta.
            </p>
          </div>
          <CrisisHelp variant="default" />
        </div>
      </section>
    </div>
  );
};

export default OppaatIndex;
