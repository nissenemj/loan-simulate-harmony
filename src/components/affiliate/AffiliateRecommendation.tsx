
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AffiliateRecommendation as AffiliateRecommendationType } from '@/utils/affiliateData';
import AffiliateLink from './AffiliateLink';
import { MegaphoneIcon } from 'lucide-react';

interface AffiliateRecommendationProps {
  recommendation: AffiliateRecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({ recommendation }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-semibold">
          <MegaphoneIcon className="mr-2 h-5 w-5 text-primary" />
          {recommendation.title}
        </CardTitle>
        <CardDescription>{recommendation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendation.links.map(link => (
            <AffiliateLink key={link.id} link={link} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateRecommendation;
