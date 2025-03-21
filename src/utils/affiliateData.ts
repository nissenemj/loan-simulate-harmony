
import { v4 as uuidv4 } from 'uuid';

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment';
  trackingId: string;
}

export interface AffiliateBanner {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment';
  trackingId: string;
  size: '300x250' | '728x90' | '300x600' | '320x320';
  htmlContent?: string; // Added for adtraction banners
}

export interface AffiliateRecommendation {
  id: string;
  title: string;
  description: string;
  links: AffiliateLink[];
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment';
}

// Sample affiliate links data
export const affiliateLinks: AffiliateLink[] = [
  {
    id: uuidv4(),
    title: 'Nordnet',
    url: 'https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1',
    category: 'investment',
    trackingId: 'nordnet_1'
  },
  {
    id: uuidv4(),
    title: 'Sijoittaja.fi',
    url: 'https://go.adt256.com/t/t?a=1896287410&as=1962325200&t=2&tk=1',
    category: 'investment',
    trackingId: 'sijoittaja_1'
  },
  {
    id: uuidv4(),
    title: 'Rahalaitos - Lainojen kilpailutus',
    url: 'https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1',
    category: 'loan',
    trackingId: 'rahalaitos_1'
  },
  {
    id: uuidv4(),
    title: 'Etua.fi - Vertaile lainoja',
    url: 'https://go.adt242.com/t/t?a=1048146716&as=1962325200&t=2&tk=1',
    category: 'loan',
    trackingId: 'etua_1'
  },
  {
    id: uuidv4(),
    title: 'BestLoans.com',
    url: 'https://example.com/bestloans',
    category: 'loan',
    trackingId: 'aff_bl_001'
  },
  {
    id: uuidv4(),
    title: 'MortgageCompare',
    url: 'https://example.com/mortgagecompare',
    category: 'mortgage',
    trackingId: 'aff_mc_001'
  },
  {
    id: uuidv4(),
    title: 'RefinanceToday',
    url: 'https://example.com/refinancetoday',
    category: 'refinance',
    trackingId: 'aff_rt_001'
  }
];

// Affiliate banners data with new Adtraction banners
export const affiliateBanners: AffiliateBanner[] = [
  {
    id: uuidv4(),
    title: 'Nordnet - Sijoita paremmin',
    description: 'Aloita sijoittaminen Nordnetissä',
    url: 'https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1616887300&as=1962325200&t=1&tk=1&i=1',
    category: 'investment',
    trackingId: 'nordnet_banner_1',
    size: '300x250',
    htmlContent: '<a href="https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1616887300&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Nordnet - Valitse itsellesi sopiva sijoitusvaihtoehto',
    description: 'Nordnet - aloita sijoittaminen helposti',
    url: 'https://go.adt231.net/t/t?a=1876582082&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1876582082&as=1962325200&t=1&tk=1&i=1',
    category: 'investment',
    trackingId: 'nordnet_banner_2',
    size: '300x250',
    htmlContent: '<a href="https://go.adt231.net/t/t?a=1876582082&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1876582082&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Sijoittaja.fi - Opi sijoittamaan',
    description: 'Suomen paras sijoituskoulutus',
    url: 'https://go.adt256.com/t/t?a=1896287410&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1896287410&as=1962325200&t=1&tk=1&i=1',
    category: 'investment',
    trackingId: 'sijoittaja_banner_1',
    size: '300x250',
    htmlContent: '<a href="https://go.adt256.com/t/t?a=1896287410&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1896287410&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Sijoittaja.fi - Sijoituskoulutus',
    description: 'Opi sijoittamaan ammattimaisesti',
    url: 'https://go.adt256.com/t/t?a=1896287434&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1896287434&as=1962325200&t=1&tk=1&i=1',
    category: 'investment',
    trackingId: 'sijoittaja_banner_2',
    size: '300x250',
    htmlContent: '<a href="https://go.adt256.com/t/t?a=1896287434&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1896287434&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Rahalaitos - Kilpailuta lainasi',
    description: 'Säästä lainakuluissa',
    url: 'https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1056517297&as=1962325200&t=1&tk=1&i=1',
    category: 'loan',
    trackingId: 'rahalaitos_banner_1',
    size: '320x320',
    htmlContent: '<a href="https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1056517297&as=1962325200&t=1&tk=1&i=1" width="320" height="320" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Etua.fi - Vertaile lainoja',
    description: 'Löydä paras laina sinulle',
    url: 'https://go.adt242.com/t/t?a=1048146716&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1296154796&as=1962325200&t=1&tk=1&i=1',
    category: 'loan',
    trackingId: 'etua_banner_1',
    size: '300x250',
    htmlContent: '<a href="https://go.adt242.com/t/t?a=1296154796&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1296154796&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Lower Your Rate Today',
    description: 'Refinance with rates as low as 4.5%',
    url: 'https://example.com/refinance-special',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    category: 'refinance',
    trackingId: 'aff_banner_001',
    size: '300x250'
  }
];

// Sample affiliate recommendations data
export const affiliateRecommendations: AffiliateRecommendation[] = [
  {
    id: uuidv4(),
    title: 'Sijoitussuositukset',
    description: 'Aloita sijoittaminen näiden luotettavien palveluiden avulla.',
    category: 'investment',
    links: [
      {
        id: uuidv4(),
        title: 'Nordnet',
        url: 'https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1',
        category: 'investment',
        trackingId: 'nordnet_rec_1'
      },
      {
        id: uuidv4(),
        title: 'Sijoittaja.fi',
        url: 'https://go.adt256.com/t/t?a=1896287410&as=1962325200&t=2&tk=1',
        category: 'investment',
        trackingId: 'sijoittaja_rec_1'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Harkitse uudelleenrahoitusta',
    description: 'Nämä luotettavat lainanantajat tarjoavat kilpailukykyisiä korkoja olemassa olevien lainojesi uudelleenrahoitukseen.',
    category: 'refinance',
    links: [
      {
        id: uuidv4(),
        title: 'Rahalaitos',
        url: 'https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1',
        category: 'refinance',
        trackingId: 'rahalaitos_rec_1'
      },
      {
        id: uuidv4(),
        title: 'EasyLoanRates',
        url: 'https://example.com/easyrates',
        category: 'refinance',
        trackingId: 'aff_rec_001_2'
      }
    ]
  }
];

// Utility function to track affiliate link clicks
export const trackAffiliateClick = (trackingId: string, linkType: 'link' | 'banner' | 'recommendation') => {
  // In a real-world scenario, this would send data to an analytics service
  console.log(`Affiliate click tracked: ${trackingId}, type: ${linkType}`);
  
  // For demonstration, we'll just log the click, but this could be expanded to:
  // - Send data to Google Analytics
  // - Make an API call to a tracking endpoint
  // - Store in localStorage for later analysis
  
  // Return true to allow the default link behavior
  return true;
};
