
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Analytics } from "@vercel/analytics/react"

// Check if user has consented to marketing cookies before loading AdSense
const hasMarketingConsent = () => {
  try {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      const consentObj = JSON.parse(savedConsent);
      return !!consentObj.marketing;
    }
  } catch (error) {
    console.error('Error parsing consent:', error);
  }
  return false;
};

// Only add Google AdSense script if user has consented
if (hasMarketingConsent()) {
  const adsenseScript = document.createElement('script');
  adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4847273727626264";
  adsenseScript.async = true;
  adsenseScript.crossOrigin = "anonymous";
  document.head.appendChild(adsenseScript);
  console.log('AdSense script loaded with consent');
} else {
  console.log('Marketing cookies not consented, AdSense script not loaded');
}

// Ensure correct character encoding for Finnish characters
const metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
document.head.appendChild(metaCharset);

// Add event listener to load AdSense if consent is later given
window.addEventListener('consentChange', () => {
  if (hasMarketingConsent() && !document.querySelector('script[src*="adsbygoogle.js"]')) {
    const adsenseScript = document.createElement('script');
    adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4847273727626264";
    adsenseScript.async = true;
    adsenseScript.crossOrigin = "anonymous";
    document.head.appendChild(adsenseScript);
    console.log('AdSense script loaded after consent change');
    
    // Need to reload the page to properly initialize AdSense
    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Analytics />
  </>
);
