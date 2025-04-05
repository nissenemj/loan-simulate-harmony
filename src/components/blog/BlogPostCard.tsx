
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface BlogPostCardProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, formatDate }) => {
  const { t } = useLanguage();
  
  // Calculate excerpt from content (first paragraph with character limit)
  const getExcerpt = (content: string, maxLength: number = 200) => {
    // Get first paragraph or part of it
    const firstParagraph = content.split('\n\n')[0];
    
    // Clean up any markdown formatting
    let cleanText = firstParagraph
      .replace(/^#+ /, '') // Remove heading markers
      .replace(/\n- /g, ' '); // Remove list markers
    
    if (cleanText.length <= maxLength) return cleanText;
    
    // Cut to max length and add ellipsis
    return cleanText.substring(0, maxLength) + '...';
  };

  // Handle image loading with fallbacks for all image types
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.svg';
    
    // If it's a Firebase Storage URL (contains firebasestorage.googleapis.com)
    if (url.includes('firebasestorage.googleapis.com')) {
      return url;
    }
    
    // If it's a local path (starts with / or src/)
    if (url.startsWith('/') || url.startsWith('src/')) {
      return url;
    }
    
    // External URL
    return url;
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {post.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(post.image_url)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-0 right-0 p-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {post.category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center text-xs text-muted-foreground space-x-3 mb-2">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
        <Link to={`/blog/${post.id}`} className="hover:underline">
          <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground text-sm">
          {getExcerpt(post.content)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link to={`/blog/${post.id}`}>
          <Button variant="outline" size="sm">
            {t("blog.readMore")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
