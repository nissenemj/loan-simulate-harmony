
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const isMobile = useIsMobile();

  return (
    <Tabs value={selectedCategory} defaultValue="all" className="w-full mb-6">
      <TabsList 
        className={`w-full flex ${isMobile ? 'flex-wrap gap-1 h-auto p-2' : 'h-auto'}`}
      >
        <TabsTrigger 
          value="all" 
          onClick={() => setSelectedCategory("all")}
          className={`${
            isMobile ? 'flex-grow text-xs py-2 px-3 mb-1' : 'px-4 py-2'
          } ${
            selectedCategory === "all" 
              ? "bg-primary text-primary-foreground hover:text-primary-foreground" 
              : "hover:bg-muted"
          }`}
        >
          Kaikki artikkelit
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              isMobile ? 'flex-grow text-xs py-2 px-1 mb-1' : 'px-4 py-2'
            } ${
              selectedCategory === category 
                ? "bg-primary text-primary-foreground hover:text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
