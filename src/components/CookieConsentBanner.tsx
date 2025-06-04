
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Create a custom event for consent changes
const consentChangeEvent = new Event("consentChange");

const CookieConsentBanner = () => {
	const [showBanner, setShowBanner] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [preferences, setPreferences] = useState({
		essential: true, // Always true and disabled
		analytics: false,
		preferences: false,
		marketing: false,
	});
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		// Check if consent has been saved
		const savedConsent = localStorage.getItem("cookieConsent");
		if (!savedConsent) {
			setShowBanner(true);
		} else {
			try {
				setPreferences({ ...preferences, ...JSON.parse(savedConsent) });
			} catch (error) {
				console.error("Error parsing saved consent:", error);
			}
		}
	}, []);

	const acceptAll = () => {
		const allConsent = {
			essential: true,
			analytics: true,
			preferences: true,
			marketing: true,
		};
		setPreferences(allConsent);
		saveConsent(allConsent);
	};

	const acceptSelected = () => {
		saveConsent(preferences);
	};

	const saveConsent = (consentPreferences: typeof preferences) => {
		localStorage.setItem("cookieConsent", JSON.stringify(consentPreferences));
		localStorage.setItem("cookieConsentDate", new Date().toISOString());
		setShowBanner(false);
		setShowSettings(false);

		// Dispatch consent change event
		window.dispatchEvent(consentChangeEvent);

		toast({
			title: "Evästeasetukset tallennettu",
			description: "Kiitos! Evästeasetuksesi on tallennettu.",
		});

		// If user has denied marketing cookies, we should reload the page
		// to ensure ads don't load
		if (!consentPreferences.marketing) {
			window.location.reload();
		}
	};

	const toggleSettings = () => {
		setShowSettings(!showSettings);
	};

	if (!showBanner) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-3 md:p-4">
			<div className="container mx-auto max-w-4xl">
				{/* Mobile view - Compact layout */}
				<div className="md:hidden">
					<div className="flex justify-between items-start mb-3">
						<h3 className="font-semibold text-base">
							Evästeiden käyttö
						</h3>
						<Button
							variant="ghost"
							size="icon"
							className="shrink-0 -mt-1 -mr-1 h-8 w-8"
							onClick={() => setShowBanner(false)}
							aria-label="Sulje"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<p className="text-xs text-muted-foreground mb-3">
						Käytämme evästeitä parantaaksemme käyttökokemustasi. Voit valita mitä evästeitä sallitaan.
					</p>

					{showSettings && (
						<div className="space-y-3 mb-3 border rounded-md p-3 bg-muted/40 text-xs">
							<div className="flex items-start gap-2">
								<Checkbox
									id="essential-mobile"
									className="mt-0.5"
									checked
									disabled
								/>
								<div>
									<label
										htmlFor="essential-mobile"
										className="font-medium block"
									>
										Välttämättömät evästeet
									</label>
									<p className="text-muted-foreground text-xs">
										Tarvitaan sovelluksen toimintaan.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2">
								<Checkbox
									id="analytics-mobile"
									className="mt-0.5"
									checked={preferences.analytics}
									onCheckedChange={(checked) =>
										setPreferences({
											...preferences,
											analytics: checked === true,
										})
									}
								/>
								<div>
									<label
										htmlFor="analytics-mobile"
										className="font-medium block"
									>
										Analytiikkaevästeet
									</label>
									<p className="text-muted-foreground text-xs">
										Auttavat parantamaan sivustoa.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2">
								<Checkbox
									id="preferences-mobile"
									className="mt-0.5"
									checked={preferences.preferences}
									onCheckedChange={(checked) =>
										setPreferences({
											...preferences,
											preferences: checked === true,
										})
									}
								/>
								<div>
									<label
										htmlFor="preferences-mobile"
										className="font-medium block"
									>
										Mieltymysevästeet
									</label>
									<p className="text-muted-foreground text-xs">
										Tallentavat asetuksesi.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2">
								<Checkbox
									id="marketing-mobile"
									className="mt-0.5"
									checked={preferences.marketing}
									onCheckedChange={(checked) =>
										setPreferences({
											...preferences,
											marketing: checked === true,
										})
									}
								/>
								<div>
									<label
										htmlFor="marketing-mobile"
										className="font-medium block"
									>
										Markkinointievästeet
									</label>
									<p className="text-muted-foreground text-xs">
										Käytetään mainontaa varten.
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="grid grid-cols-2 gap-2">
						<Button
							variant="outline"
							size="sm"
							className="text-xs h-9"
							onClick={toggleSettings}
						>
							{showSettings
								? "Piilota asetukset"
								: "Mukautetut asetukset"}
						</Button>
						{showSettings ? (
							<Button
								size="sm"
								className="text-xs h-9"
								onClick={acceptSelected}
							>
								Tallenna valinnat
							</Button>
						) : (
							<Button size="sm" className="text-xs h-9" onClick={acceptAll}>
								Hyväksy kaikki
							</Button>
						)}
					</div>

					<div className="text-xs text-muted-foreground mt-2">
						Lisätietoja{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-xs"
							onClick={() => navigate("/cookie-policy")}
						>
							evästekäytännössä
						</Button>
						.
					</div>
				</div>

				{/* Desktop view - Original layout with improvements */}
				<div className="hidden md:block">
					<div className="flex justify-between items-start">
						<div className="flex-1 pr-4">
							<h3 className="font-semibold text-lg mb-2">
								Evästeiden käyttö
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Käytämme evästeitä parantaaksemme käyttökokemustasi ja analysoidaksemme sivuston käyttöä. 
								Voit valita mitä evästeitä sallitaan.
							</p>

							{showSettings && (
								<div className="space-y-4 mb-4 p-4 border rounded-md bg-muted/40">
									<div className="flex items-center space-x-3">
										<Checkbox id="essential" checked disabled />
										<div className="flex-1">
											<label htmlFor="essential" className="text-sm font-medium">
												Välttämättömät evästeet
											</label>
											<p className="text-xs text-muted-foreground">
												Tarvitaan sovelluksen perustoimintoihin.
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<Checkbox 
											id="analytics" 
											checked={preferences.analytics}
											onCheckedChange={(checked) => 
												setPreferences({...preferences, analytics: checked === true})}
										/>
										<div className="flex-1">
											<label htmlFor="analytics" className="text-sm font-medium">
												Analytiikkaevästeet
											</label>
											<p className="text-xs text-muted-foreground">
												Auttavat meitä ymmärtämään sivuston käyttöä.
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<Checkbox 
											id="preferences" 
											checked={preferences.preferences}
											onCheckedChange={(checked) => 
												setPreferences({...preferences, preferences: checked === true})}
										/>
										<div className="flex-1">
											<label htmlFor="preferences" className="text-sm font-medium">
												Mieltymysevästeet
											</label>
											<p className="text-xs text-muted-foreground">
												Tallentavat asetuksesi ja mieltymyksesi.
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<Checkbox 
											id="marketing" 
											checked={preferences.marketing}
											onCheckedChange={(checked) => 
												setPreferences({...preferences, marketing: checked === true})}
										/>
										<div className="flex-1">
											<label htmlFor="marketing" className="text-sm font-medium">
												Markkinointievästeet
											</label>
											<p className="text-xs text-muted-foreground">
												Käytetään kohdennettuun mainontaan.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowBanner(false)}
							aria-label="Sulje evästeilmoitus"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={toggleSettings}
						>
							{showSettings ? "Piilota asetukset" : "Mukautetut asetukset"}
						</Button>
						{showSettings ? (
							<Button size="sm" onClick={acceptSelected}>
								Tallenna valinnat
							</Button>
						) : (
							<Button size="sm" onClick={acceptAll}>
								Hyväksy kaikki
							</Button>
						)}
						<Button
							variant="link"
							size="sm"
							onClick={() => navigate("/cookie-policy")}
						>
							Lisätietoja evästeistä
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookieConsentBanner;
