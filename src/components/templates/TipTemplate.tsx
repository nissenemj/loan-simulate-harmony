import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Lightbulb } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface TipTemplateProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
}

/**
 * TipTemplate - Vinkki-sivupohja
 *
 * Käyttö:
 * <TipTemplate
 *   title="5 tapaa säästää rahaa"
 *   description="Konkreettiset vinkit säästämiseen"
 *   category="Säästäminen"
 * >
 *   <p>Sisältö tähän...</p>
 * </TipTemplate>
 */
const TipTemplate: React.FC<TipTemplateProps> = ({
  title,
  description,
  category,
  children,
}) => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title} | Velkavapaus.fi</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Etusivu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/vinkit" className="hover:text-foreground transition-colors">
              Vinkit
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
              {category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>

          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {children}
          </div>

          {/* Crisis Help */}
          <div className="mt-12">
            <CrisisHelp variant="compact" />
          </div>
        </div>
      </article>
    </div>
  );
};

export default TipTemplate;
