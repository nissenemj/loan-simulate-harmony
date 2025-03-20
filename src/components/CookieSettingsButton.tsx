
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

// Create a custom event for consent changes
const consentChangeEvent = new Event('consentChange');

interface CookieSettingsButtonProps {
  className?: string;
}

const CookieSettingsButton: React.FC<CookieSettingsButtonProps> = ({ className }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true and disabled
    analytics: false,
    preferences: false,
    marketing: false
  });
  
  useEffect(() => {
    // Load current preferences when dialog opens
    const loadCurrentPreferences = () => {
      try {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
          setPreferences({...preferences, ...JSON.parse(savedConsent)});
        }
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    };
    
    if (open) {
      loadCurrentPreferences();
    }
  }, [open]);

  const saveConsent = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Dispatch consent change event
    window.dispatchEvent(consentChangeEvent);
    
    setOpen(false);
    
    toast({
      title: "Evästeasetukset tallennettu",
      description: "Kiitos! Evästeasetuksesi on tallennettu.",
    });
    
    // If user has changed marketing cookie permissions, reload the page
    // to ensure correct AdSense behavior
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="link" 
          className={className || "text-xs h-auto p-0"}
        >
          Evästeasetukset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Evästeasetukset</DialogTitle>
          <DialogDescription>
            Valitse mitä evästeitä haluat sallia sivustollamme.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="essential-dialog" checked disabled />
            <div className="grid gap-0.5">
              <label htmlFor="essential-dialog" className="text-sm font-medium">
                Välttämättömät evästeet
              </label>
              <p className="text-xs text-muted-foreground">
                Tarvitaan sovelluksen toiminnan varmistamiseksi. Ei voi poistaa käytöstä.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="analytics-dialog" 
              checked={preferences.analytics}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, analytics: checked === true})}
            />
            <div className="grid gap-0.5">
              <label htmlFor="analytics-dialog" className="text-sm font-medium">
                Analytiikkaevästeet
              </label>
              <p className="text-xs text-muted-foreground">
                Auttavat meitä ymmärtämään, miten käytät sovellusta, jotta voimme parantaa sitä.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="preferences-dialog" 
              checked={preferences.preferences}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, preferences: checked === true})}
            />
            <div className="grid gap-0.5">
              <label htmlFor="preferences-dialog" className="text-sm font-medium">
                Mieltymysevästeet
              </label>
              <p className="text-xs text-muted-foreground">
                Tallentavat asetuksesi, kuten kielivalinnat ja teema-asetukset.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="marketing-dialog" 
              checked={preferences.marketing}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, marketing: checked === true})}
            />
            <div className="grid gap-0.5">
              <label htmlFor="marketing-dialog" className="text-sm font-medium">
                Markkinointievästeet
              </label>
              <p className="text-xs text-muted-foreground">
                Käytetään mainontaa varten, mukaan lukien Google AdSense -mainokset. Nämä evästeet voivat kerätä tietoja 
                kiinnostuksen kohteistasi tarjotakseen personoituja mainoksia.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={saveConsent}>Tallenna asetukset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettingsButton;
