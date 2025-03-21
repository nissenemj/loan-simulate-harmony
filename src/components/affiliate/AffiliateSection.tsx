
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  affiliateLinks, 
  affiliateBanners, 
  affiliateRecommendations 
} from '@/utils/affiliateData';
import AffiliateLink from './AffiliateLink';
import AffiliateBanner from './AffiliateBanner';
import AffiliateRecommendation from './AffiliateRecommendation';
import { HandCoins, BadgeDollarSign, Tag, MegaphoneIcon, TrendingUp } from 'lucide-react';

const AffiliateSection = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">{t("affiliate.title")}</h2>
        <p className="text-muted-foreground">
          {t("affiliate.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Affiliate links, investments and first recommendation */}
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center mb-3">
              <TrendingUp className="mr-2 text-primary" />
              <h3 className="text-lg font-semibold">{t("affiliate.investmentOptions")}</h3>
            </div>
            <div className="space-y-2">
              {affiliateLinks
                .filter(link => link.category === 'investment')
                .map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center mb-3">
              <BadgeDollarSign className="mr-2 text-primary" />
              <h3 className="text-lg font-semibold">{t("affiliate.compareLoans")}</h3>
            </div>
            <div className="space-y-2">
              {affiliateLinks
                .filter(link => link.category === 'loan')
                .map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
            </div>
          </div>
          
          {affiliateRecommendations.length > 0 && (
            <AffiliateRecommendation recommendation={affiliateRecommendations[0]} />
          )}
        </div>

        {/* Middle column: Banners */}
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {/* Display investment banners first */}
            {affiliateBanners
              .filter(banner => banner.category === 'investment')
              .map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}

            {/* Display loan banners */}
            {affiliateBanners
              .filter(banner => banner.category === 'loan')
              .map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}

            {/* Display other banners */}
            {affiliateBanners
              .filter(banner => banner.category !== 'investment' && banner.category !== 'loan')
              .map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}
          </div>
        </div>

        {/* Right column: More affiliate content */}
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center mb-3">
              <HandCoins className="mr-2 text-primary" />
              <h3 className="text-lg font-semibold">{t("affiliate.refinanceTitle")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("affiliate.refinanceText")}
            </p>
            <div className="space-y-2">
              {affiliateLinks
                .filter(link => link.category === 'refinance')
                .map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
            </div>
          </div>

          {affiliateRecommendations.length > 1 && (
            <AffiliateRecommendation recommendation={affiliateRecommendations[1]} />
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t pt-4 mt-8">
        <p className="text-xs text-muted-foreground italic text-center">
          {t("affiliate.disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default AffiliateSection;
