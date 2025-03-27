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
  return;
};
export default AffiliateRecommendation;