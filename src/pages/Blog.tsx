
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import AdSenseBanner from "@/components/AdSenseBanner";
import { affiliateRecommendations } from "@/utils/affiliateData";
import AffiliateRecommendation from "@/components/affiliate/AffiliateRecommendation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Get affiliate recommendations for education and books
  const educationRecommendations = affiliateRecommendations.filter(rec => 
    rec.category === 'education'
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map((post: BlogPost) => post.category)));
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
          <p className="text-center py-12">Ladataan...</p>
        </div>
        <Footer />
      </div>
    );
  }

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-3">
              <Tabs defaultValue="all" className="mb-6">
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
            </div>
            
            {/* Storytel recommendation in sidebar */}
            <div className="hidden md:block">
              {educationRecommendations.map(recommendation => (
                <AffiliateRecommendation 
                  key={recommendation.id} 
                  recommendation={recommendation} 
                />
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {t("blog.noPosts") || "Ei artikkeleita tässä kategoriassa."}
            </p>
          ) : (
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
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
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
                      <Link to={`/blog/${post.id}`} className="text-sm font-medium text-primary hover:underline">
                        {t("blog.readMore") || "Lue lisää"} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Mobile Storytel recommendation */}
          <div className="md:hidden mb-8">
            {educationRecommendations.map(recommendation => (
              <AffiliateRecommendation 
                key={recommendation.id} 
                recommendation={recommendation} 
              />
            ))}
          </div>
          
          <AdSenseBanner adSlot="1234567890" className="mt-8" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
