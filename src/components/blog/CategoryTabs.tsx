
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Tabs value={selectedCategory} defaultValue="all" className="mb-6">
      <TabsList className={`mb-6 flex ${isMobile ? 'flex-col gap-2' : 'flex-wrap'}`}>
        <TabsTrigger 
          value="all" 
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}
        >
          {t("blog.allPosts")}
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
