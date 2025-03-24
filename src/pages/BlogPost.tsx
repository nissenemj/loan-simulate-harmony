import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdSenseBanner from "@/components/AdSenseBanner";
import { affiliateBanners, trackAffiliateClick } from "@/utils/affiliateData";

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
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) {
          setPost(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          setPost(null);
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setPost(null);
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

  const shareUrl = `https://velkavapaus.fi/blog/${postId}`;

  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post?.title || '')}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast.success(t("blog.copiedToClipboard") || "Linkki kopioitu leikepöydälle");
          })
          .catch(() => {
            toast.error(t("blog.copyFailed") || "Linkin kopiointi epäonnistui");
          });
        return;
    }
    
    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  const handleStorytellClick = () => {
    trackAffiliateClick('storytel_banner_blog', 'banner');
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Replace [text](url) with <a> tags
    let processedContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1<span class="inline-block ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></span></a>');
    
    // Replace section headers (no #)
    processedContent = processedContent.replace(/^(\d+)\.\s+(.*?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1. $2</h2>');
    
    // Replace bold text with strong tags
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace bullet points (keep the bullets but with better formatting)
    processedContent = processedContent.replace(/^- (.*?)$/gm, '<li class="ml-5 mb-2">$1</li>');
    
    // Wrap lists in ul tags
    processedContent = processedContent.replace(/(<li.*?<\/li>\n)+/g, '<ul class="list-disc mb-6 mt-2">$&</ul>');
    
    // Replace paragraphs with p tags (excluding those that are already processed)
    const paragraphs = processedContent.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('<h2') || 
          paragraph.startsWith('<ul') || 
          paragraph.includes('<li')) {
        return paragraph;
      }
      
      // Don't wrap empty lines
      if (!paragraph.trim()) {
        return '';
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
          <p className="text-center py-12">Ladataan...</p>
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
        <meta name="keywords" content={`${post.category.toLowerCase()}, velkavapaus, taloudenhallinta, velanhoito, säästäminen, ${post.title.toLowerCase()}`} />
        <link rel="canonical" href={`https://velkavapaus.fi/blog/${post.id}`} />
        
        {/* Open Graph tags for better social media sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:url" content={`https://velkavapaus.fi/blog/${post.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Velkavapaus.fi" />
        
        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.substring(0, 160)} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        
        {/* Additional SEO meta tags */}
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow" />
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        {t("blog.share") || "Jaa"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('copy')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("blog.copyLink") || "Kopioi linkki"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center" onClick={handleStorytellClick}>
              <div dangerouslySetInnerHTML={{ __html: '<a href="https://go.adt267.com/t/t?a=1538795918&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1538795918&as=1962325200&t=1&tk=1&i=1" width="300" height="100" border="0"></a>' }} />
            </div>
            
            <AdSenseBanner adSlot="1234567890" className="mt-12" />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
