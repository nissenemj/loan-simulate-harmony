
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
import { BadgeDollarSign, HandCoins, BookOpen, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AffiliateSection = () => {
  const { t } = useLanguage();

  // Get recommendations by category
  const getRecommendationsByCategory = (category: string) => {
    return affiliateRecommendations.filter(rec => rec.category === category);
  };

  // Get banners by category
  const getBannersByCategory = (category: string) => {
    return affiliateBanners.filter(banner => banner.category === category);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">{t("affiliate.title")}</h2>
        <p className="text-muted-foreground">
          {t("affiliate.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Loans and loan recommendations */}
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
          
          {getRecommendationsByCategory('loan').map(recommendation => (
            <AffiliateRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>

        {/* Middle column: Banners */}
        <div className="space-y-6">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col items-center">
              {/* Display loan banners */}
              {getBannersByCategory('loan').slice(0, 2).map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}
              
              {/* Display education banners */}
              {getBannersByCategory('education').map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}

              {/* Display budgeting banners */}
              {getBannersByCategory('budgeting').map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}

              {/* Display investment banners */}
              {getBannersByCategory('investment').slice(0, 1).map(banner => (
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

          {/* Education recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                {t("affiliate.educationTitle") || "Haluatko oppia lisää?"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {affiliateLinks
                  .filter(link => link.category === 'education')
                  .map(link => (
                    <AffiliateLink key={link.id} link={link} />
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Budgeting recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <PiggyBank className="mr-2 h-5 w-5 text-primary" />
                {t("affiliate.budgetingTitle") || "Tasapainota taloutesi"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {affiliateLinks
                  .filter(link => link.category === 'budgeting')
                  .map(link => (
                    <AffiliateLink key={link.id} link={link} />
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Display remaining recommendations */}
          {getRecommendationsByCategory('education').map(recommendation => (
            <AffiliateRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
          
          {getRecommendationsByCategory('budgeting').map(recommendation => (
            <AffiliateRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Storytel specific disclaimer */}
      <div className="bg-accent/30 p-4 rounded-lg text-sm">
        <p className="font-medium mb-2">{t("affiliate.storytelDisclaimer") || "Storytel-edun ehdot:"}</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>{t("affiliate.storytelDisclaimerLine1") || "Etu koskee vain uusia Storytelin asiakkaita."}</li>
          <li>{t("affiliate.storytelDisclaimerLine2") || "Kokeilujakson aikana saa kuunnella ja lukea 100 tuntia kirjoja."}</li>
          <li>{t("affiliate.storytelDisclaimerLine3") || "Storytelin tilaus ei ole sitova ja sen voi lopettaa milloin haluaa."}</li>
          <li>{t("affiliate.storytelDisclaimerLine4") || "Ilmaisen kokeilujakson jälkeen tilaus jatkuu automaattisesti hintaan 19,99 € / kk."}</li>
        </ul>
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
