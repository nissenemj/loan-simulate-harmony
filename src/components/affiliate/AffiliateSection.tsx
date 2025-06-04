
import React from 'react';
import { affiliateLinks, affiliateBanners, affiliateRecommendations } from '@/utils/affiliateData';
import AffiliateLink from './AffiliateLink';
import AffiliateBanner from './AffiliateBanner';
import AffiliateRecommendation from './AffiliateRecommendation';
import { BadgeDollarSign, HandCoins, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AffiliateSection = () => {
  // Get recommendations by category
  const getRecommendationsByCategory = (category: string) => {
    return affiliateRecommendations.filter(rec => rec.category === category);
  };

  // Get banners by category
  const getBannersByCategory = (category: string) => {
    return affiliateBanners.filter(banner => banner.category === category);
  };

  // Get investment recommendations
  const investmentRecommendations = affiliateRecommendations.filter(rec => rec.category === 'investment');

  // Get education recommendations including Storytel
  const educationRecommendations = affiliateRecommendations.filter(rec => rec.category === 'education');
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Suositellut palvelut</h2>
        <p className="text-muted-foreground">
          Valitsemiamme luotettavia palveluja, jotka voivat auttaa velkatilanteessasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Loans and loan recommendations */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
                Vertaa lainoja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Only Etua.fi in the compareLoans section */}
                {affiliateLinks.filter(link => link.category === 'loan' && link.title.includes('Etua.fi')).map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Display loan recommendations */}
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

              {/* Display investment banners */}
              {getBannersByCategory('investment').slice(0, 1).map(banner => (
                <AffiliateBanner key={banner.id} banner={banner} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column: More affiliate content */}
        <div className="space-y-6">
          {/* Combine Rahalaitos, Sortter and Rensa in single card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
                Kilpailuta lainasi ja säästä
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {affiliateLinks.filter(link => 
                  (link.title.includes('Rahalaitos') && link.category === 'loan') || 
                  link.title.includes('Sortter') || 
                  link.title.includes('Rensa')
                ).map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Refinance card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <HandCoins className="mr-2 h-5 w-5 text-primary" />
                Uudelleenrahoitus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Yhdistä velkasi edullisemmaksi kokonaisuudeksi uudelleenrahoituksella
              </p>
              <div className="space-y-2">
                {affiliateLinks.filter(link => link.category === 'refinance').map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education (Storytel and Nordnet) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Haluatko oppia lisää?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Include Storytel */}
                {affiliateLinks.filter(link => 
                  link.category === 'education' || 
                  (link.category === 'investment' && link.title.includes('Nordnet'))
                ).map(link => (
                  <AffiliateLink key={link.id} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display education recommendations */}
          {educationRecommendations.map(recommendation => (
            <AffiliateRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
          
          {/* Display investment recommendations */}
          {investmentRecommendations.map(recommendation => (
            <AffiliateRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Separator className="my-6" />
      <div className="pt-2">
        <p className="text-xs text-muted-foreground italic text-center">
          Tämä sivusto voi sisältää kumppanuuslinkkejä. Saamme pienen provision, jos teet ostoksen näiden linkkien kautta, mutta se ei vaikuta sinulle maksettavaan hintaan.
        </p>
      </div>
    </div>
  );
};

export default AffiliateSection;
