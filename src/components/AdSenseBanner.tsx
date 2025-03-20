
import { useEffect, useState, useRef } from 'react';

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
  const adContainerRef = useRef<HTMLDivElement>(null);
  
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
    // Only initialize ads if the user has given consent and component is mounted
    if (hasMarketingConsent && adContainerRef.current) {
      try {
        // Make sure the adsbygoogle script is loaded
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4847273727626264";
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
          console.log('AdSense script dynamically added');
        }
        
        // Wait a short time to ensure the script has loaded
        setTimeout(() => {
          // Ensure the ad container is ready before pushing the ad
          const adElement = adContainerRef.current?.querySelector('.adsbygoogle');
          
          if (adElement && window.adsbygoogle) {
            // Push the ad
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log('AdSense push executed for slot:', adSlot);
          } else {
            console.warn('AdSense container or adsbygoogle not ready yet');
          }
        }, 200);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    } else {
      console.log('Marketing consent not given or container not ready, ads not loaded');
    }
  }, [hasMarketingConsent, adSlot]);

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
    <div className={`adsbygoogle-container ${className}`} ref={adContainerRef}>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4847273727626264"
      crossorigin="anonymous"></script>
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
