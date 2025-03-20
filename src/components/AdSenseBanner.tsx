
import { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // Initialize adsbygoogle if not already initialized
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log('AdSense push executed');
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

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
