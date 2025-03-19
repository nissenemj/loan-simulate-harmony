
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AffiliateRecommendation as AffiliateRecommendationType } from '@/utils/affiliateData';
import AffiliateLink from './AffiliateLink';

interface AffiliateRecommendationProps {
  recommendation: AffiliateRecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({ recommendation }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{recommendation.title}</CardTitle>
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
