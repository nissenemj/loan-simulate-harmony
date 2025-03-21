
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
import { BadgeDollarSign, HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        {/* Left column: Loans and first recommendation */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
                {t("affiliate.compareLoans")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {affiliateLinks
                  .filter(link => link.category === 'loan')
                  .map(link => (
                    <AffiliateLink key={link.id} link={link} />
                  ))}
              </div>
            </CardContent>
          </Card>
          
          {affiliateRecommendations.length > 0 && (
            <AffiliateRecommendation recommendation={affiliateRecommendations[0]} />
          )}
        </div>

        {/* Middle column: Banners */}
        <div className="space-y-6">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col items-center">
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
            </CardContent>
          </Card>
        </div>

        {/* Right column: More affiliate content */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <HandCoins className="mr-2 h-5 w-5 text-primary" />
                {t("affiliate.refinanceTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {affiliateRecommendations.length > 1 && (
            <AffiliateRecommendation recommendation={affiliateRecommendations[1]} />
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <Separator className="my-6" />
      <div className="pt-2">
        <p className="text-xs text-muted-foreground italic text-center">
          {t("affiliate.disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default AffiliateSection;
