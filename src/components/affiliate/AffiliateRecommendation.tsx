
import React from 'react';
import { AffiliateRecommendation as RecommendationType } from '@/utils/affiliateData';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface AffiliateRecommendationProps {
  recommendation: RecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({ recommendation }) => {
  const { t, language } = useLanguage();
  
  // Use the localized title and description based on the current language
  const title = language === 'en' && recommendation.titleEn ? recommendation.titleEn : recommendation.title;
  const description = language === 'en' && recommendation.descriptionEn ? recommendation.descriptionEn : recommendation.description;
  
  // Get the button text based on language
  const buttonText = recommendation.links[0]?.title || t("common.learnMore") || "Lue lisää";
  
  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-2">
        <a href={recommendation.links[0]?.url} target="_blank" rel="noopener noreferrer">
          {buttonText}
        </a>
      </Button>
    </div>
  );
};

export default AffiliateRecommendation;
