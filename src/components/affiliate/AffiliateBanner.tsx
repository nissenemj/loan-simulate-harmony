
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
    <Card className={`mb-4 border-0 shadow-none ${className}`}>
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
              className="rounded-md" 
              style={{ maxWidth: '100%', height: 'auto' }} 
            />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliateBanner;
