
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import NewsletterSignup from "@/components/NewsletterSignup";
import AdSenseBanner from "@/components/AdSenseBanner";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      try {
        if (!postId) {
          setNotFound(true);
          return;
        }
        
        // Fetch the current post
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();
          
        if (error || !data) {
          console.error('Error fetching post:', error);
          setNotFound(true);
          setPost(null);
        } else {
          console.log('Fetched post:', data);
          setPost(data);
          
          // After fetching the post, get related posts from the same category
          if (data.category) {
            const { data: relatedData, error: relatedError } = await supabase
              .from('blog_posts')
              .select('*')
              .eq('category', data.category)
              .neq('id', postId) // Exclude current post
              .limit(3)
              .order('created_at', { ascending: false });
              
            if (!relatedError && relatedData) {
              setRelatedPosts(relatedData);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => toast.success(t("blog.copiedToClipboard")))
      .catch(() => toast.error(t("blog.copyFailed")));
  };
  
  // Format content with proper paragraphs - improved version that handles bullet lists better
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // Split by double newlines to make paragraphs
    return content.split('\n\n').map((paragraph, index) => {
      // Check if paragraph starts with a heading marker (#)
      if (paragraph.startsWith('# ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h2>;
      } else if (paragraph.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h3>;
      } else if (paragraph.startsWith('### ')) {
        return <h4 key={index} className="text-lg font-bold mt-5 mb-2">{paragraph.substring(4)}</h4>;
      }
      
      // Lists - we want to improve this as bullet points are causing issues
      if (paragraph.includes('\n- ')) {
        const listTitle = paragraph.split('\n- ')[0];
        const listItems = paragraph.split('\n- ').slice(1);
        
        // Instead of creating a bullet list, convert these to paragraphs
        return (
          <div key={index} className="my-4">
            {listTitle && <p className="mb-2">{listTitle}</p>}
            {listItems.map((item, i) => (
              <p key={i} className="my-2">{item}</p>
            ))}
          </div>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="my-4">{paragraph}</p>;
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <main className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <Card className="w-full p-8">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              {language === 'fi' ? 'Ladataan artikkelia...' : 'Loading article...'}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }
  
  // Not found state
  if (notFound) {
    return (
      <>
        <Helmet>
          <title>{t("blog.postNotFound")} | {t("blog.pageTitle")}</title>
        </Helmet>
        
        <main className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
          <Card className="w-full p-8 text-center">
            <CardContent className="pt-6 space-y-6">
              <h1 className="text-3xl font-bold text-center">
                {t("blog.postNotFound")}
              </h1>
              <p className="text-center text-muted-foreground">
                {t("blog.postNotFoundDesc")}
              </p>
              <Button onClick={() => navigate("/blog")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.backToBlog")}
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  if (!post) return null;
  
  return (
    <>
      <Helmet>
        <title>{post.title} | {t("blog.pageTitle")}</title>
        <meta 
          name="description" 
          content={post.content.substring(0, 160) + '...'} 
        />
        <meta name="keywords" content={`${post.category}, velanhoito, budjetointi, taloudenhallinta, velkavapaus`} />
        <link rel="canonical" href={`https://velkavapaus.fi/blog/${post.id}`} />
      </Helmet>
      
      <main className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog")}
          </Link>
          
          {post.image_url && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          )}
          
          <div className="mb-4">
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleShareClick}>
              <Share2 className="h-4 w-4 mr-2" />
              {t("blog.shareArticle")}
            </Button>
          </div>
        </div>
        
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          {formatContent(post.content)}
        </div>
        
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-bold mb-6">{t("blog.relatedPosts")}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  {relatedPost.image_url && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  
                  <CardContent className="pt-4">
                    <h3 className="font-bold mb-2">
                      <Link to={`/blog/${relatedPost.id}`} className="hover:underline">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {formatDate(relatedPost.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12">
          <NewsletterSignup />
        </div>
        
        <AdSenseBanner adSlot="1234567890" className="mt-12" />
      </main>
    </>
  );
};

export default BlogPost;
