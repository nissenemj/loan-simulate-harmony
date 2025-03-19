
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true and disabled
    analytics: false,
    preferences: false,
    marketing: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if consent has been saved
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const allConsent = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true
    };
    setPreferences(allConsent);
    saveConsent(allConsent);
  };

  const acceptSelected = () => {
    saveConsent(preferences);
  };

  const saveConsent = (consentPreferences: typeof preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(consentPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    
    toast({
      title: "Evästeasetukset tallennettu",
      description: "Kiitos! Evästeasetuksesi on tallennettu.",
    });
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-lg mb-2">Evästeiden käyttö</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Käytämme evästeitä parantaaksemme käyttökokemustasi, analysoidaksemme liikennettä ja mukauttaaksemme sisältöä. 
              Valitse, mitä evästeitä sallit.
            </p>
            
            {showSettings && (
              <div className="space-y-4 mb-4 border rounded-md p-4 bg-muted/40">
                <div className="flex items-center space-x-2">
                  <Checkbox id="essential" checked disabled />
                  <div className="grid gap-0.5">
                    <label htmlFor="essential" className="text-sm font-medium">
                      Välttämättömät evästeet
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Tarvitaan sovelluksen toiminnan varmistamiseksi. Ei voi poistaa käytöstä.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="analytics" 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, analytics: checked === true})}
                  />
                  <div className="grid gap-0.5">
                    <label htmlFor="analytics" className="text-sm font-medium">
                      Analytiikkaevästeet
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Auttavat meitä ymmärtämään, miten käytät sovellusta, jotta voimme parantaa sitä.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="preferences" 
                    checked={preferences.preferences}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, preferences: checked === true})}
                  />
                  <div className="grid gap-0.5">
                    <label htmlFor="preferences" className="text-sm font-medium">
                      Mieltymysevästeet
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Tallentavat asetuksesi, kuten kielivalinnat ja teema-asetukset.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketing" 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, marketing: checked === true})}
                  />
                  <div className="grid gap-0.5">
                    <label htmlFor="marketing" className="text-sm font-medium">
                      Markkinointievästeet
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Käytetään affiliate-linkkien seurantaan ja markkinoinnin tehokkuuden mittaamiseen.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              Lisätietoja <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/cookie-policy")}>evästekäytännöstämme</Button>.
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0" 
            onClick={() => setShowBanner(false)}
            aria-label="Sulje evästeikkuna"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-end">
          <Button variant="outline" onClick={toggleSettings}>
            {showSettings ? "Piilota asetukset" : "Mukautetut asetukset"}
          </Button>
          {showSettings ? (
            <Button onClick={acceptSelected}>
              Tallenna valinnat
            </Button>
          ) : (
            <Button onClick={acceptAll}>
              Hyväksy kaikki
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
