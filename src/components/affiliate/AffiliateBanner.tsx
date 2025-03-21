
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AffiliateBanner as AffiliateBannerType } from '@/utils/affiliateData';
import { trackAffiliateClick } from '@/utils/affiliateData';

interface AffiliateBannerProps {
  banner: AffiliateBannerType;
}

const AffiliateBanner: React.FC<AffiliateBannerProps> = ({ banner }) => {
  const handleClick = () => {
    trackAffiliateClick(banner.trackingId, 'banner');
  };

  return (
    <Card className="mb-4 border-0 shadow-none">
      <CardContent className="p-2 flex justify-center">
        {banner.htmlContent ? (
          <div 
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: banner.htmlContent }}
            className="cursor-pointer"
          />
        ) : (
          <a 
            href={banner.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleClick}
          >
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              title={banner.description}
              className="max-w-full h-auto"
            />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliateBanner;
