
import React, { useEffect } from 'react';
import Iframe from 'react-iframe';

interface H5PContentProps {
  contentId: string | number;
  height?: string;
  title?: string;
}

const H5PContent: React.FC<H5PContentProps> = ({ 
  contentId, 
  height = '400px',
  title = 'H5P Content'
}) => {
  // Define the URL where H5P content is hosted
  // Replace with your actual H5P service URL
  const h5pUrl = `https://h5p.org/h5p/embed/${contentId}`;
  
  // Load the H5P Resizer script, which dynamically adjusts iframe height
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js';
    script.async = true;
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className="h5p-container w-full rounded-lg overflow-hidden shadow-md my-6">
      <Iframe
        url={h5pUrl}
        width="100%"
        height={height}
        id={`h5p-iframe-${contentId}`}
        className="h5p-iframe"
        display="block"
        position="relative"
        allowFullScreen
        title={title}
      />
    </div>
  );
};

export default H5PContent;
