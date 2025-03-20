// App.tsx (päivitetty)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoanTerms from "./pages/LoanTerms";
import DebtSummaryPage from "./pages/DebtSummaryPage";
import Auth from "./pages/Auth";
import NavigationHeader from "./components/NavigationHeader";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import CookieConsentBanner from "./components/CookieConsentBanner";
import Dashboard from "./pages/Dashboard";
import CreditCardsPage from "./pages/CreditCardsPage"; // Lisätään CreditCardsPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <CookieConsentBanner />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <NavigationHeader />
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/loans" element={
                  <ProtectedRoute>
                    <NavigationHeader />
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/creditCards" element={
                  <ProtectedRoute>
                    <NavigationHeader />
                    <CreditCardsPage />
                  </ProtectedRoute>
                } /> {/* Lisätty /creditCards-reitti */}
                <Route path="/terms" element={
                  <>
                    <NavigationHeader />
                    <LoanTerms />
                  </>
                } />
                <Route path="/debt-summary" element={
                  <ProtectedRoute>
                    <NavigationHeader />
                    <DebtSummaryPage />
                  </ProtectedRoute>
                } />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;