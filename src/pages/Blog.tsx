
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterSignup from "@/components/NewsletterSignup";
import { supabase } from "@/integrations/supabase/client";
import AdSenseBanner from "@/components/AdSenseBanner";
import { affiliateRecommendations } from "@/utils/affiliateData";
import AffiliateRecommendation from "@/components/affiliate/AffiliateRecommendation";
import { useIsMobile } from "@/hooks/use-mobile";
import CategoryTabs from "@/components/blog/CategoryTabs";
import BlogPostList from "@/components/blog/BlogPostList";

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
  const isMobile = useIsMobile();

  // Get affiliate recommendations for education and books
  const educationRecommendations = affiliateRecommendations.filter(rec => 
    rec.category === 'education'
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        console.log("Fetching blog posts...");
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
        } else {
          // Debug: Log the posts that were fetched
          console.log('Fetched posts:', data);
          setPosts(data || []);
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data?.map((post: BlogPost) => post.category) || []));
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setPosts([]);
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

  return (
    <>
      <Helmet>
        <title>{t("blog.pageTitle")}</title>
        <meta 
          name="description" 
          content={t("blog.pageDescription")} 
        />
        <meta name="keywords" content="velanhoito, budjetointi, taloudenhallinta, velkavapaus, blogi" />
        <link rel="canonical" href="https://velkavapaus.fi/blog" />
      </Helmet>

      <main className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("blog.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("blog.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <CategoryTabs 
              categories={categories} 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
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

        <BlogPostList posts={filteredPosts} formatDate={formatDate} />
        
        {/* Newsletter Signup */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>
        
        {/* Mobile Storytel recommendation */}
        <div className="md:hidden mb-8">
          {educationRecommendations.map(recommendation => (
            <AffiliateRecommendation 
              key={recommendation.id} 
              recommendation={recommendation} 
            />
          ))}
        </div>
        
        {/* Storytel Banner - Added at the bottom of the page */}
        <div className="my-8 flex justify-center">
          <div dangerouslySetInnerHTML={{ __html: '<a href="https://go.adt267.com/t/t?a=1538795918&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1538795918&as=1962325200&t=1&tk=1&i=1" width="300" height="100" border="0"></a>' }} />
        </div>
        
        <AdSenseBanner adSlot="1234567890" className="mt-8" />
      </main>
    </>
  );
};

export default Blog;
