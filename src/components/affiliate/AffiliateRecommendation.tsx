import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AffiliateRecommendation as AffiliateRecommendationType } from '@/utils/affiliateData';
import AffiliateLink from './AffiliateLink';
import { MegaphoneIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
interface AffiliateRecommendationProps {
  recommendation: AffiliateRecommendationType;
}
const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({
  recommendation
}) => {
  const {
    t,
    language
  } = useLanguage();

  // Use the localized title and description based on current language
  const title = language === 'en' ? recommendation.titleEn || recommendation.title : recommendation.title;
  const description = language === 'en' ? recommendation.descriptionEn || recommendation.description : recommendation.description;
  return;
};
export default AffiliateRecommendation;