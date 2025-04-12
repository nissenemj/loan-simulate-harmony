
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
    <Tabs value={selectedCategory} defaultValue="all" className="w-full mb-6">
      <TabsList 
        className={`w-full flex ${isMobile ? 'flex-wrap gap-2 h-auto p-2' : 'h-auto'}`}
      >
        <TabsTrigger 
          value="all" 
          onClick={() => setSelectedCategory("all")}
          className={`${isMobile ? 'flex-grow mb-2' : 'px-4'} ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : ""}`}
        >
          {t("blog.allPosts")}
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            onClick={() => setSelectedCategory(category)}
            className={`${isMobile ? 'flex-grow mb-2' : 'px-4'} ${selectedCategory === category ? "bg-primary text-primary-foreground" : ""}`}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
