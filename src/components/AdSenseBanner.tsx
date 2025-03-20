
import { useEffect, useState } from 'react';

// Define the global adsbygoogle object for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseBannerProps {
  adSlot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

const AdSenseBanner = ({
  adSlot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseBannerProps) => {
  const [hasMarketingConsent, setHasMarketingConsent] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has given consent for marketing cookies
    const checkConsent = () => {
      try {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
          const consentObj = JSON.parse(savedConsent);
          setHasMarketingConsent(!!consentObj.marketing);
        }
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        setHasMarketingConsent(false);
      }
    };
    
    // Check consent when component mounts
    checkConsent();
    
    // Set up event listener for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };
    
    window.addEventListener('consentChange', handleConsentChange);
    
    return () => {
      window.removeEventListener('consentChange', handleConsentChange);
    };
  }, []);
  
  useEffect(() => {
    // Only initialize ads if the user has given consent
    if (hasMarketingConsent) {
      try {
        // Initialize adsbygoogle if not already initialized
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('AdSense push executed');
      } catch (error) {
        console.error('AdSense error:', error);
      }
    } else {
      console.log('Marketing consent not given, ads not loaded');
    }
  }, [hasMarketingConsent]);

  // If no consent, return an empty div with same dimensions
  if (!hasMarketingConsent) {
    return (
      <div className={`adsbygoogle-container ${className}`}>
        <div 
          className="bg-muted/10 flex items-center justify-center text-xs text-muted-foreground p-2"
          style={{ minHeight: '100px' }}
        >
          <p>Mainokset käytettävissä evästeasetuksissa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsbygoogle-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4847273727626264"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSenseBanner;
