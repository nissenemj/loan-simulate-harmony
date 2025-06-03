
import React from 'react';
import { AffiliateRecommendation as RecommendationType } from '@/utils/affiliateData';
import { Button } from '@/components/ui/button';

interface AffiliateRecommendationProps {
  recommendation: RecommendationType;
}

const AffiliateRecommendation: React.FC<AffiliateRecommendationProps> = ({
  recommendation
}) => {
  // Käytetään aina suomenkielisiä tekstejä
  const title = recommendation.title;
  const description = recommendation.description;

  // Nappin teksti
  const buttonText = recommendation.links[0]?.title || "Lue lisää";
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {recommendation.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recommendation.links.map((link, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                asChild
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {link.title}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateRecommendation;
