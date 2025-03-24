
import React from 'react';
import { RecommendationType } from '@/utils/affiliateData';
import { Button } from '@/components/ui/button';

interface AffiliateRecommendationProps {
  recommendation: RecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({ recommendation }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold">{recommendation.title}</h3>
      <p className="text-center text-muted-foreground">{recommendation.description}</p>
      <Button asChild variant="outline" className="mt-2">
        <a href={recommendation.url} target="_blank" rel="noopener noreferrer">
          {recommendation.buttonText}
        </a>
      </Button>
    </div>
  );
};

export default AffiliateRecommendation;
