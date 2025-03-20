
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

// Demo blog posts - these would typically come from a CMS or database
const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "5 Tehokasta tapaa päästä eroon veloista",
    content: `Velkataakka voi tuntua ylitsepääsemättömältä, mutta oikeilla strategioilla voit nopeuttaa matkaa kohti velkavapautta. Tässä artikkelissa käsittelemme viisi tehokasta taktiikkaa, joiden avulla voit maksaa velkasi nopeammin ja säästää korkokuluissa.

## 1. Lumipalloefekti

Maksa ensin pois pienimmät velat ja siirry sitten suurempiin. Tämä antaa nopeita voittoja ja motivaatiota jatkaa. Kun olet maksanut yhden velan pois, siirrä sen kuukausierä seuraavaksi pienimmän velan maksuun. Näin maksukykysi "kasvaa kuin lumipallo" jokaisen maksetun velan myötä.

## 2. Lumivyörystrategia

Keskity ensin korkeakorkoisimpiin velkoihin säästääksesi pitkällä aikavälillä. Matemaattisesti tämä on tehokkain tapa, koska maksat vähemmän korkoja. Tee vähimmäismaksut kaikille veloille, mutta laita ylimääräiset varat korkeimman koron omaavaan velkaan.

## 3. Lainojen yhdistäminen

Yhdistä useita pieniä velkoja yhdeksi suuremmaksi lainaksi matalammalla korolla. Tämä voi yksinkertaistaa taloutesi hallintaa ja alentaa kokonaiskorkomenoja. Varmista kuitenkin, että uuden lainan ehdot ovat todella paremmat kuin vanhojen.

## 4. Automatisoi maksut

Aseta automaattiset maksut kaikille veloillesi varmistaaksesi, että maksut tapahtuvat ajallaan. Tämä auttaa välttämään myöhästymismaksuja ja korkojen kasautumista. Voit myös automatisoida ylimääräisiä maksuja, jos tulosi vaihtelevat.

## 5. Lisätulojen hankkiminen

Etsi tapoja ansaita lisätuloja, joita voit käyttää velkojen maksuun. Tämä voi tarkoittaa ylitöitä, sivutyötä tai tavaroiden myymistä. Pienetkin lisätulot voivat merkittävästi nopeuttaa velkojen maksua, kun kohdistat ne suoraan velkoihin.

Muista, että velkojen maksaminen on maraton, ei sprintti. Valitse strategia, joka sopii parhaiten tilanteeseesi ja jota voit ylläpitää pitkällä aikavälillä. Velkavapaus.fi-työkalut voivat auttaa sinua suunnittelemaan ja visualisoimaan matkasi kohti velkavapautta.`,
    created_at: "2024-01-15T09:00:00Z",
    author: "Maria Virtanen",
    category: "Velanhoito",
    image_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Kuukausittaisen budjetin laatiminen: Aloittelijan opas",
    content: "Toimiva budjetti on taloudellisen vapauden perusta. Tässä oppaassa käymme läpi yksinkertaiset askeleet, joiden avulla voit luoda oman kuukausittaisen budjetin ja pitäytyä siinä...",
    created_at: "2024-02-03T14:30:00Z",
    author: "Juhani Mäkinen",
    category: "Budjetointi",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Miten selvitä yllättävistä taloudellisista kriiseistä",
    content: "Elämä voi tuoda yllättäviä käänteitä – auton rikkoutumisesta työpaikan menetykseen. Tässä artikkelissa käsittelemme, miten voit varautua taloudellisiin kriiseihin ja selvitä niistä mahdollisimman vähällä stressillä...",
    created_at: "2024-03-10T11:15:00Z",
    author: "Laura Heikkinen",
    category: "Talouskriisit",
    image_url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop"
  }
];

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch the specific blog post from Supabase
    // For now, we're using the demo data
    const foundPost = DEMO_BLOG_POSTS.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    setLoading(false);
    
    // Example of how to fetch from Supabase:
    // const fetchPost = async () => {
    //   const { data, error } = await supabase
    //     .from('blog_posts')
    //     .select('*')
    //     .eq('id', postId)
    //     .single();
    //
    //   if (data) setPost(data);
    //   setLoading(false);
    // };
    // fetchPost();
  }, [postId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Simple Markdown-like renderer
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Replace ## headers with h2 tags
    const withHeaders = content.replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
    
    // Replace paragraphs with p tags
    const paragraphs = withHeaders.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('<h2')) {
        return paragraph;
      }
      return `<p class="mb-4" key="${index}">${paragraph}</p>`;
    }).join('');
    
    return <div dangerouslySetInnerHTML={{ __html: paragraphs }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {t("blog.postNotFound") || "Artikkelia ei löytynyt"}
          </h1>
          <p className="mb-6">{t("blog.postNotFoundDesc") || "Valitettavasti etsimääsi artikkelia ei löytynyt."}</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog") || "Takaisin blogiin"}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Velkavapaus.fi</title>
        <meta 
          name="description" 
          content={post.content.substring(0, 160)} 
        />
        <meta name="keywords" content={`${post.category.toLowerCase()}, velkavapaus, taloudenhallinta`} />
        <link rel="canonical" href={`https://velkavapaus.fi/blog/${post.id}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:url" content={`https://velkavapaus.fi/blog/${post.id}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        
        <main className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog") || "Takaisin blogiin"}
          </Button>
          
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-muted-foreground gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{post.category}</span>
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            <article className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </article>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {t("blog.shareArticle") || "Jaa artikkeli"}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    {t("blog.share") || "Jaa"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
