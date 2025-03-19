
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CookieSettingsButtonProps {
  className?: string;
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({ className }) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Add event listener to the cookie settings button in the footer
    const setupCookieSettingsButton = () => {
      const cookieSettingsButton = document.getElementById('cookie-settings-button');
      if (cookieSettingsButton) {
        cookieSettingsButton.addEventListener('click', openCookieSettings);
      }
    };

    // Setup on mount and when DOM changes
    setupCookieSettingsButton();

    return () => {
      const cookieSettingsButton = document.getElementById('cookie-settings-button');
      if (cookieSettingsButton) {
        cookieSettingsButton.removeEventListener('click', openCookieSettings);
      }
    };
  }, []);

  const openCookieSettings = () => {
    // For now, simply clear the cookie consent and reload the page to show the banner again
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    
    toast({
      title: "Evästeasetukset",
      description: "Evästeasetukset avattu. Voit nyt muokata evästeasetuksiasi.",
    });
    
    // Force reload to show the banner
    window.location.reload();
  };

  return (
    <Button 
      variant="link" 
      className={className || "text-xs h-auto p-0"}
      onClick={openCookieSettings}
    >
      Evästeasetukset
    </Button>
  );
};

export default CookieSettingsButton;
