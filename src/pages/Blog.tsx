
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, User, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

// Updated blog posts with new content
const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "7 Yleisintä Virhettä Velkojen Maksussa – Ja Miten Välttää Ne",
    content: "Velkojen maksaminen voi tuntua raskaalta, mutta moni kompastuu samoihin virheisiin, jotka tekevät prosessista hitaamman ja kalliimman. Tämä opas listaa seitsemän yleisintä virhettä ja antaa sinulle työkalut niiden kiertämiseen. Mukana on myös ripaus motivaatiota ja suomalaisia resursseja, kuten Takuusäätiö, jotka tukevat sinua matkallasi.\n\nVirhe: Maksat vain lainojen minimilyhennykset, jolloin korot kasvattavat velkaa ja maksuaika venyy. Miten välttää: Pyri maksamaan enemmän kuin minimisumma aina kun mahdollista. Näin lyhennät velkapääomaa nopeammin ja säästät koroissa...",
    created_at: "2024-01-15T09:00:00Z",
    author: "Talousvelhot",
    category: "Velanhoito",
    image_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Velattomuuden käsikirja – Näin otat taloutesi takaisin hallintaan!",
    content: "Hengitä syvään ja tunnusta tilanteesi rehellisesti. Tee selkeä lista kaikista veloistasi (summa, korko, eräpäivä). Avaa laskupino heti ja tarkista, missä tilanne on kriittisin. Päätä, ettet enää ota uutta velkaa ja tee ensimmäinen realistinen kuukausibudjetti.\n\nLuo visuaalinen mittari, jossa seuraat velan vähenemistä. Jaa velkamäärä pienempiin, saavutettaviin osiin. Palkitse itsesi saavutetuista välitavoitteista (esim. edullisella tai ilmaisella tavalla). Kerro tavoitteestasi läheisillesi, jotta he voivat kannustaa sinua...",
    created_at: "2024-02-03T14:30:00Z",
    author: "Talousvelhot",
    category: "Budjetointi",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Konkreettiset esimerkit velan maksamisen strategioista",
    content: "Minimilyhennysten maksaminen vs. suuremman summan maksaminen: Oletetaan, että sinulla on 1000 euron velka, jonka vuosikorko on 15%. Jos maksat minimilyhennyksen, esimerkiksi 30 €/kk, velka kasvaa 15% vuodessa, eli noin 150 € vuodessa. Maksamalla 30 € kuukaudessa (yhteensä 360 € vuodessa) velka pienenee vain 210 € vuodessa (360 € - 150 €). Tällöin 1000 € velan maksaminen kestää noin 4,76 vuotta, ja maksat yhteensä noin 1360 € (sisältäen korot)...",
    created_at: "2024-03-10T11:15:00Z",
    author: "Talousvelhot",
    category: "Talouskriisit",
    image_url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop"
  }
];

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_BLOG_POSTS);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(posts.map(post => post.category)));
    setCategories(uniqueCategories);

    // In a real implementation, we would fetch blog posts from Supabase
    // For example:
    // const fetchPosts = async () => {
    //   const { data, error } = await supabase
    //     .from('blog_posts')
    //     .select('*')
    //     .order('created_at', { ascending: false });
    //
    //   if (data) setPosts(data);
    // };
    // fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Helmet>
        <title>{t("blog.pageTitle") || "Blogi | Velkavapaus.fi"}</title>
        <meta 
          name="description" 
          content={t("blog.pageDescription") || "Lue uusimmat artikkelit ja oppaat taloudenhallintaan, velanhoitoon ja budjetointiin Velkavapaus.fi-blogista."} 
        />
        <meta name="keywords" content="velanhoito, budjetointi, taloudenhallinta, velkavapaus, blogi" />
        <link rel="canonical" href="https://velkavapaus.fi/blog" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        
        <main className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t("blog.title") || "Blogi"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("blog.subtitle") || "Uusimmat artikkelit ja oppaat taloudenhallintaan"}
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6 flex flex-wrap">
              <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                {t("blog.allPosts") || "Kaikki artikkelit"}
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{post.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <a href={`/blog/${post.id}`} className="text-sm font-medium text-primary hover:underline">
                      {t("blog.readMore") || "Lue lisää"} →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
