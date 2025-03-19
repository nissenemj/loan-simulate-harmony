
import { v4 as uuidv4 } from 'uuid';

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance';
  trackingId: string;
}

export interface AffiliateBanner {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance';
  trackingId: string;
  size: '300x250' | '728x90' | '300x600';
}

export interface AffiliateRecommendation {
  id: string;
  title: string;
  description: string;
  links: AffiliateLink[];
  category: 'loan' | 'credit-card' | 'mortgage' | 'refinance';
}

// Sample affiliate links data
export const affiliateLinks: AffiliateLink[] = [
  {
    id: uuidv4(),
    title: 'BestLoans.com',
    url: 'https://example.com/bestloans',
    category: 'loan',
    trackingId: 'aff_bl_001'
  },
  {
    id: uuidv4(),
    title: 'CreditCardDeals',
    url: 'https://example.com/creditcarddeals',
    category: 'credit-card',
    trackingId: 'aff_cc_001'
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

// Sample affiliate banners data
export const affiliateBanners: AffiliateBanner[] = [
  {
    id: uuidv4(),
    title: 'Lower Your Rate Today',
    description: 'Refinance with rates as low as 4.5%',
    url: 'https://example.com/refinance-special',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    category: 'refinance',
    trackingId: 'aff_banner_001',
    size: '300x250'
  },
  {
    id: uuidv4(),
    title: 'Premium Credit Card',
    description: 'Earn 5% cashback on all purchases',
    url: 'https://example.com/premium-card',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    category: 'credit-card',
    trackingId: 'aff_banner_002',
    size: '300x250'
  }
];

// Sample affiliate recommendations data
export const affiliateRecommendations: AffiliateRecommendation[] = [
  {
    id: uuidv4(),
    title: 'Top Loan Refinance Options',
    description: 'These trusted lenders offer competitive rates for refinancing your existing loans.',
    category: 'refinance',
    links: [
      {
        id: uuidv4(),
        title: 'QuickRefinance',
        url: 'https://example.com/quickrefinance',
        category: 'refinance',
        trackingId: 'aff_rec_001_1'
      },
      {
        id: uuidv4(),
        title: 'EasyLoanRates',
        url: 'https://example.com/easyrates',
        category: 'refinance',
        trackingId: 'aff_rec_001_2'
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Best Credit Cards for Rewards',
    description: 'Maximize your benefits with these top-rated rewards credit cards.',
    category: 'credit-card',
    links: [
      {
        id: uuidv4(),
        title: 'Premium Rewards Card',
        url: 'https://example.com/premium-rewards',
        category: 'credit-card',
        trackingId: 'aff_rec_002_1'
      },
      {
        id: uuidv4(),
        title: 'Travel Points Card',
        url: 'https://example.com/travel-points',
        category: 'credit-card',
        trackingId: 'aff_rec_002_2'
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
