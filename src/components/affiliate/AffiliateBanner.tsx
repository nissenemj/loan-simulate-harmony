
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
    window.open(banner.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 mb-4">
      <CardContent className="p-0" onClick={handleClick}>
        <div className="relative">
          <img 
            src={banner.imageUrl} 
            alt={banner.title}
            className="w-full h-auto object-cover"
            style={{ 
              maxHeight: banner.size === '300x250' ? '250px' : 
                        banner.size === '728x90' ? '90px' : '600px',
              maxWidth: banner.size === '300x250' ? '300px' : 
                       banner.size === '728x90' ? '728px' : '300px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white font-semibold text-lg">{banner.title}</h3>
            <p className="text-white/80 text-sm">{banner.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateBanner;
