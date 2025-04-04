
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import BlogPostCard from "./BlogPostCard";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

interface BlogPostListProps {
  posts: BlogPost[];
  formatDate: (dateString: string) => string;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts, formatDate }) => {
  const { t } = useLanguage();

  if (posts.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        {t("blog.noPosts")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
};

export default BlogPostList;
