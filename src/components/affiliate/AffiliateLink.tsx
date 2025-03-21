
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AffiliateLink as AffiliateLinkType } from '@/utils/affiliateData';
import { trackAffiliateClick } from '@/utils/affiliateData';

interface AffiliateLinkProps {
  link: AffiliateLinkType;
}

const AffiliateLink: React.FC<AffiliateLinkProps> = ({ link }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click before navigating
    trackAffiliateClick(link.trackingId, 'link');
    // The default action (navigation) will happen naturally since we're using an anchor
  };

  return (
    <Button 
      variant="outline" 
      className="w-full justify-between mb-2 pr-3 flex items-center"
      asChild
      onClick={handleClick}
    >
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-between w-full"
      >
        <span className="truncate mr-2">{link.title}</span>
        <ExternalLink className="h-4 w-4 flex-shrink-0" />
      </a>
    </Button>
  );
};

export default AffiliateLink;
