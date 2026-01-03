import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Calendar } from "lucide-react";
import CrisisHelp from "@/components/CrisisHelp";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface GuideTemplateProps {
  title: string;
  description: string;
  readTime?: string;
  updatedAt?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  showCrisisHelp?: boolean;
}

/**
 * GuideTemplate - Opas-sivupohja
 *
 * Käyttö:
 * <GuideTemplate
 *   title="Velkajärjestely"
 *   description="Kattava opas velkajärjestelyyn"
 *   readTime="15 min"
 *   updatedAt="Tammikuu 2025"
 * >
 *   <p>Sisältö tähän...</p>
 * </GuideTemplate>
 */
const GuideTemplate: React.FC<GuideTemplateProps> = ({
  title,
  description,
  readTime,
  updatedAt,
  breadcrumbs = [
    { label: "Etusivu", href: "/" },
    { label: "Oppaat", href: "/oppaat" },
  ],
  children,
  showCrisisHelp = true,
}) => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title} | Velkavapaus.fi</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </React.Fragment>
            ))}
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {readTime && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readTime} lukuaika
              </span>
            )}
            {updatedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Päivitetty {updatedAt}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {children}
          </div>

          {/* Crisis Help */}
          {showCrisisHelp && (
            <div className="mt-12">
              <CrisisHelp variant="default" />
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default GuideTemplate;
