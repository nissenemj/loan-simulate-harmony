
import React from "react";
import { Link } from "react-router-dom";
import { Clock, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

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

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
            {t("blog.readMore")} →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
