import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Quote } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";
import { BeforeAfter } from "@/components/infographics";

interface StoryTemplateProps {
  title: string;
  description: string;
  author: string; // Anonymisoitu nimi, esim. "Maria, 34"
  debtBefore: string;
  debtAfter: string;
  duration: string;
  children: React.ReactNode;
}

/**
 * StoryTemplate - Tarina-sivupohja (onnistumistarinat)
 *
 * Käyttö:
 * <StoryTemplate
 *   title="Näin pääsin 30 000 € veloista eroon"
 *   description="Marian tarina velkavapaudesta"
 *   author="Maria, 34"
 *   debtBefore="30 000 €"
 *   debtAfter="0 €"
 *   duration="3 vuotta"
 * >
 *   <p>Tarina tähän...</p>
 * </StoryTemplate>
 */
const StoryTemplate: React.FC<StoryTemplateProps> = ({
  title,
  description,
  author,
  debtBefore,
  debtAfter,
  duration,
  children,
}) => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title} | Velkavapaus.fi</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Etusivu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/tarinat" className="hover:text-foreground transition-colors">
              Tarinat
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{author}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Onnistumistarina
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {description}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{author}</p>
              <p className="text-sm text-muted-foreground">
                Velkavapaa {duration} jälkeen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After visualization */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <BeforeAfter
            title={`${author.split(",")[0]}n matka`}
            before={{
              label: "Velat alussa",
              value: debtBefore,
            }}
            after={{
              label: "Nyt",
              value: debtAfter,
            }}
          />
        </div>
      </section>

      {/* Story Content */}
      <article className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Quote highlight */}
          <div className="bg-muted/30 rounded-xl p-6 mb-8 relative">
            <Quote className="absolute top-4 left-4 h-8 w-8 text-muted-foreground/30" />
            <p className="text-xl italic text-center px-8">
              "Ensimmäinen askel oli vaikein, mutta se kannatti."
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {children}
          </div>

          {/* Encouragement box */}
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Sinäkin voit onnistua
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Jokainen tarina on erilainen, mutta yksi asia on yhteistä:
              ensimmäinen askel vie eteenpäin. Aloita tänään.
            </p>
          </div>

          {/* Crisis Help */}
          <div className="mt-12">
            <CrisisHelp variant="default" />
          </div>
        </div>
      </article>
    </div>
  );
};

export default StoryTemplate;
