import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Heart, Quote } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface StoryCardProps {
  title: string;
  description: string;
  author: string;
  href: string;
  debtAmount: string;
  duration: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  description,
  author,
  href,
  debtAmount,
  duration,
}) => (
  <Link to={href} className="group block">
    <Card className="h-full transition-all hover:shadow-lg hover:border-amber-500/50 border-l-4 border-l-amber-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {author.charAt(0)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-amber-500" />
            <span>Onnistumistarina</span>
          </div>
        </div>
        <CardTitle className="mt-4 group-hover:text-amber-600 transition-colors">
          {title}
        </CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Velat: {debtAmount}</span>
          <span>•</span>
          <span>Aika: {duration}</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <div className="flex items-center gap-2 mt-4 text-amber-600 font-medium">
          Lue tarina
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const stories = [
  {
    title: "Näin pääsin 30 000 € veloista eroon",
    description: "Kulutusluotot kasvoivat vuosien aikana hallitsemattomiksi. Velkaneuvonta ja lumipallomenetelmä auttoivat.",
    author: "Maria, 34",
    href: "/tarinat/maria",
    debtAmount: "30 000 €",
    duration: "3 vuotta",
  },
  {
    title: "Pikavipeistä velkajärjestelyyn",
    description: "Pikavipit johtivat kierteeseen. Velkajärjestely antoi uuden alun.",
    author: "Mikko, 42",
    href: "/tarinat/mikko",
    debtAmount: "45 000 €",
    duration: "5 vuotta",
  },
  {
    title: "Yrittäjän velkahelvetistä takaisin",
    description: "Konkurssiin mennyt yritys jätti isot velat. Nyt olen velkavapaa.",
    author: "Anna, 51",
    href: "/tarinat/anna",
    debtAmount: "80 000 €",
    duration: "5 vuotta",
  },
];

const TarinatIndex: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Tarinat | Velkavapaus.fi</title>
        <meta
          name="description"
          content="Todellisia onnistumistarinoita velkahelvetistä vapauteen. Lue miten muut ovat selvinneet ja saa inspiraatiota omaan matkaan."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-xl">
              <Heart className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tarinat</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todellisia onnistumistarinoita. Muut ovat selvinneet – sinäkin voit.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-muted/30 rounded-xl p-6 relative">
            <Quote className="absolute top-4 left-4 h-8 w-8 text-muted-foreground/30" />
            <p className="text-xl italic text-center px-8">
              "Vaikeinta oli myöntää, että tarvitsen apua. Sen jälkeen kaikki muuttui."
            </p>
            <p className="text-center text-muted-foreground mt-2">– Maria, 34</p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-6">
            {stories.map((story) => (
              <StoryCard key={story.href} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* Encouragement */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
            <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg mb-2">
              Sinäkin voit onnistua
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Jokainen tarina alkoi samasta kohdasta: päätöksestä pyytää apua.
              Ensimmäinen askel on usein vaikein – mutta se kannattaa.
            </p>
          </div>

          <div className="mt-8">
            <CrisisHelp variant="default" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TarinatIndex;
