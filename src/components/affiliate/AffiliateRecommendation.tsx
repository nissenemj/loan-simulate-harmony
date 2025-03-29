
import React from 'react';
import { AffiliateRecommendation as RecommendationType } from '@/utils/affiliateData';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface AffiliateRecommendationProps {
  recommendation: RecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({
  recommendation
}) => {
  const {
    t,
    language
  } = useLanguage();

  // Use the localized title and description based on the current language
  const title = language === 'en' && recommendation.titleEn ? recommendation.titleEn : recommendation.title;
  const description = language === 'en' && recommendation.descriptionEn ? recommendation.descriptionEn : recommendation.description;

  // Get the button text based on language
  const buttonText = recommendation.links[0]?.title || t("common.learnMore") || "Lue lisää";
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {recommendation.imageUrl && (
        <div className="relative h-40 w-full">
          <img 
            src={recommendation.imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {recommendation.links && recommendation.links.length > 0 && (
          <Button 
            as="a" 
            href={recommendation.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AffiliateRecommendation;
