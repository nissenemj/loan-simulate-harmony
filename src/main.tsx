
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Google AdSense script to the document head
const adsenseScript = document.createElement('script');
adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4847273727626264";
adsenseScript.async = true;
adsenseScript.crossOrigin = "anonymous";
document.head.appendChild(adsenseScript);

// Ensure correct character encoding for Finnish characters
const metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');
document.head.appendChild(metaCharset);

createRoot(document.getElementById("root")!).render(<App />);
