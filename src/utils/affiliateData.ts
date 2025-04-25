
import { v4 as uuidv4 } from 'uuid';

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment' | 'education' | 'budgeting';
  trackingId: string;
}

export interface AffiliateBanner {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment' | 'education' | 'budgeting';
  trackingId: string;
  size: '300x250' | '728x90' | '300x600' | '320x320' | '336x280' | '980x120' | '300x100';
  htmlContent?: string; // Added for adtraction banners
}

export interface AffiliateRecommendation {
  id: string;
  title: string;
  titleEn?: string; // Added English title
  description: string;
  descriptionEn?: string; // Added English description
  links: AffiliateLink[];
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance' | 'investment' | 'education' | 'budgeting';
}

// Sample affiliate links data
export const affiliateLinks: AffiliateLink[] = [
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
    title: 'Rahalaitos',
    url: 'https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1',
    category: 'refinance',
    trackingId: 'rahalaitos_refinance'
  },
  {
    id: uuidv4(),
    title: 'Storytel - Äänikirjapalvelu',
    url: 'https://go.adt267.com/t/t?a=1469936600&as=1962325200&t=2&tk=1',
    category: 'education',
    trackingId: 'storytel_1'
  },
  {
    id: uuidv4(),
    title: 'Sortter - Kilpailuta lainat ja säästä',
    url: 'https://go.adt267.com/t/t?a=1329217211&as=1962325200&t=2&tk=1',
    category: 'loan',
    trackingId: 'sortter_1'
  },
  {
    id: uuidv4(),
    title: 'Rensa - Tasapainota taloutesi',
    url: 'https://go.adt267.com/t/t?a=1841940996&as=1962325200&t=2&tk=1',
    category: 'budgeting',
    trackingId: 'rensa_1'
  },
  {
    id: uuidv4(),
    title: 'Nordnet - Sijoita paremmin',
    url: 'https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1',
    category: 'education',
    trackingId: 'nordnet_education'
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
    title: 'Storytel - Kuuntele ja lue tuhansia kirjoja',
    description: 'Kokeile ilmaiseksi 7 päivää',
    url: 'https://go.adt267.com/t/t?a=1469936600&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1897988466&as=1962325200&t=1&tk=1&i=1',
    category: 'education',
    trackingId: 'storytel_banner_1',
    size: '300x250',
    htmlContent: '<a href="https://go.adt267.com/t/t?a=1897988466&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1897988466&as=1962325200&t=1&tk=1&i=1" width="300" height="250" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Storytel - Kokeile ilmaiseksi 7 päivää',
    description: 'Äänikirjoja ja e-kirjoja',
    url: 'https://go.adt267.com/t/t?a=1538795918&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1538795918&as=1962325200&t=1&tk=1&i=1',
    category: 'education',
    trackingId: 'storytel_banner_blog',
    size: '300x100',
    htmlContent: '<a href="https://go.adt267.com/t/t?a=1538795918&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1538795918&as=1962325200&t=1&tk=1&i=1" width="300" height="100" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Sortter - Kilpailuta lainat',
    description: 'Vertaa ja säästä koroissa',
    url: 'https://go.adt267.com/t/t?a=1329217211&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1841940996&as=1962325200&t=1&tk=1&i=1',
    category: 'loan',
    trackingId: 'sortter_banner_1',
    size: '336x280',
    htmlContent: '<a href="https://go.adt267.com/t/t?a=1841940996&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1841940996&as=1962325200&t=1&tk=1&i=1" width="336" height="280" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Sortter - Kilpailuta lainat',
    description: 'Suomen kattavin lainavertailu',
    url: 'https://go.adt267.com/t/t?a=1329217211&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1714374467&as=1962325200&t=1&tk=1&i=1',
    category: 'loan',
    trackingId: 'sortter_banner_2',
    size: '980x120',
    htmlContent: '<a href="https://go.adt267.com/t/t?a=1714374467&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1714374467&as=1962325200&t=1&tk=1&i=1" width="980" height="120" border="0"></a>'
  },
  {
    id: uuidv4(),
    title: 'Rensa - Tasapainota taloutesi',
    description: 'Hallitse menosi ja tulosi tehokkaasti',
    url: 'https://go.adt267.com/t/t?a=1841940996&as=1962325200&t=2&tk=1',
    imageUrl: 'https://track.adtraction.com/t/t?a=1841940996&as=1962325200&t=1&tk=1&i=1',
    category: 'budgeting',
    trackingId: 'rensa_banner_1',
    size: '336x280',
    htmlContent: '<a href="https://go.adt267.com/t/t?a=1841940996&as=1962325200&t=2&tk=1"><img src="https://track.adtraction.com/t/t?a=1841940996&as=1962325200&t=1&tk=1&i=1" width="336" height="280" border="0"></a>'
  }
];

// Sample affiliate recommendations data
export const affiliateRecommendations: AffiliateRecommendation[] = [
  {
    id: uuidv4(),
    title: 'Sijoitussuositukset',
    titleEn: 'Investment Recommendations',
    description: 'Aloita sijoittaminen näiden luotettavien palveluiden avulla.',
    descriptionEn: 'Start investing with these trusted services.',
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
    titleEn: 'Consider Refinancing',
    description: 'Nämä luotettavat lainanantajat tarjoavat kilpailukykyisiä korkoja olemassa olevien lainojesi uudelleenrahoitukseen.',
    descriptionEn: 'These trusted lenders offer competitive rates for refinancing your existing loans.',
    category: 'refinance',
    links: [
      {
        id: uuidv4(),
        title: 'Rahalaitos',
        url: 'https://go.adt284.net/t/t?a=1056517297&as=1962325200&t=2&tk=1',
        category: 'refinance',
        trackingId: 'rahalaitos_rec_1'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Haluatko oppia lisää?',
    titleEn: 'Want to learn more?',
    description: 'Storytel äänikirjapalvelussa on lähes miljoona äänikirjaa, e-kirjaa ja podcastia. Kokeile ilmaiseksi 7 päivän ajan!',
    descriptionEn: 'Storytel audio book service has nearly a million audiobooks, e-books and podcasts. Try it free for 7 days!',
    category: 'education',
    links: [
      {
        id: uuidv4(),
        title: 'Storytel - Äänikirjapalvelu',
        url: 'https://go.adt267.com/t/t?a=1469936600&as=1962325200&t=2&tk=1',
        category: 'education',
        trackingId: 'storytel_rec_1'
      },
      {
        id: uuidv4(),
        title: 'Nordnet - Sijoita paremmin',
        url: 'https://go.adt231.net/t/t?a=1616887300&as=1962325200&t=2&tk=1',
        category: 'education',
        trackingId: 'nordnet_edu_rec'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Kilpailuta lainasi ja säästä',
    titleEn: 'Compare loans and save',
    description: 'Sortter on Suomen kattavin lainavertailu. Vertaa ja löydä edullisin laina helposti.',
    descriptionEn: 'Sortter is Finland\'s most comprehensive loan comparison. Compare and find the most affordable loan easily.',
    category: 'loan',
    links: [
      {
        id: uuidv4(),
        title: 'Sortter - Lainavertailu',
        url: 'https://go.adt267.com/t/t?a=1329217211&as=1962325200&t=2&tk=1',
        category: 'loan',
        trackingId: 'sortter_rec_1'
      }
    ]
  }
];

// Utility function to track affiliate link clicks
export const trackAffiliateClick = (trackingId: string, linkType: 'link' | 'banner' | 'recommendation') => {
  // In a real-world scenario, this would send data to an analytics service
  console.log(`Affiliate click tracked: ${trackingId}, type: ${linkType}`);
  
  // Return true to allow the default link behavior
  return true;
};
