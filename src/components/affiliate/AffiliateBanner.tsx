
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AffiliateBanner as AffiliateBannerType } from '@/utils/affiliateData';
import { trackAffiliateClick } from '@/utils/affiliateData';
import { useLanguage } from '@/contexts/LanguageContext';

interface AffiliateBannerProps {
  banner: AffiliateBannerType;
}

const AffiliateBanner: React.FC<AffiliateBannerProps> = ({ banner }) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    trackAffiliateClick(banner.trackingId, 'banner');
    window.open(banner.url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = () => {
    console.log(`Image failed to load: ${banner.imageUrl}`);
    setImageError(true);
  };

  // If banner has HTML content, render it directly
  if (banner.htmlContent) {
    return (
      <Card className="overflow-hidden mb-4 max-w-fit mx-auto">
        <CardContent className="p-0" dangerouslySetInnerHTML={{ __html: banner.htmlContent }} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 mb-4">
      <CardContent className="p-0" onClick={handleClick}>
        <div className="relative">
          {!imageError ? (
            <img 
              src={banner.imageUrl} 
              alt={banner.title}
              className="w-full h-auto object-cover"
              style={{ 
                maxHeight: banner.size === '300x250' ? '250px' : 
                          banner.size === '728x90' ? '90px' : 
                          banner.size === '320x320' ? '320px' : '600px',
                maxWidth: banner.size === '300x250' ? '300px' : 
                         banner.size === '728x90' ? '728px' : 
                         banner.size === '320x320' ? '320px' : '300px',
              }}
              onError={handleImageError}
            />
          ) : (
            <div 
              className="bg-accent flex items-center justify-center text-center"
              style={{ 
                height: banner.size === '300x250' ? '250px' : 
                       banner.size === '728x90' ? '90px' : 
                       banner.size === '320x320' ? '320px' : '600px',
                width: banner.size === '300x250' ? '300px' : 
                      banner.size === '728x90' ? '728px' : 
                      banner.size === '320x320' ? '320px' : '300px',
              }}
            >
              <p className="text-muted-foreground p-4">{t('affiliate.imageNotAvailable')}</p>
            </div>
          )}
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
