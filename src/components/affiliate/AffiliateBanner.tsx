
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AffiliateBanner as AffiliateBannerType } from '@/utils/affiliateData';
import { trackAffiliateClick } from '@/utils/affiliateData';

interface AffiliateBannerProps {
  banner: AffiliateBannerType;
  className?: string;
}

const AffiliateBanner: React.FC<AffiliateBannerProps> = ({
  banner,
  className = ''
}) => {
  const handleClick = () => {
    trackAffiliateClick(banner.trackingId, 'banner');
  };

  return (
    <Card className={`mb-4 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-2 flex justify-center">
        {banner.htmlContent ? (
          <div 
            onClick={handleClick} 
            dangerouslySetInnerHTML={{ __html: banner.htmlContent }} 
            className="cursor-pointer rounded-md overflow-hidden" 
          />
        ) : (
          <a 
            href={banner.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={handleClick}
            className="block rounded-md overflow-hidden"
          >
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className="w-full h-auto" 
              style={{ maxWidth: '100%' }} 
            />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliateBanner;
