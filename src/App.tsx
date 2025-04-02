
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import DebtSummaryPage from '@/pages/DebtSummaryPage';
import LoanTerms from '@/pages/LoanTerms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import CookiePolicy from '@/pages/CookiePolicy';
import TermsOfService from '@/pages/TermsOfService';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import BlogAdmin from '@/pages/BlogAdmin';
import Auth from '@/pages/Auth';
import DebtStrategies from '@/pages/DebtStrategies';
import LandingPage from '@/pages/LandingPage';
import NotFound from '@/pages/NotFound';

// Components
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import ProtectedRoute from '@/components/ProtectedRoute';
import CookieConsentBanner from '@/components/CookieConsentBanner';

// Styles
import "./App.css";

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <NavigationHeader />
            <main className="min-h-screen mb-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/debt-summary" element={<DebtSummaryPage />} />
                <Route path="/debt-strategies" element={<DebtStrategies />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/loan-terms" element={<LoanTerms />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/blog-admin" 
                  element={
                    <ProtectedRoute>
                      <BlogAdmin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsentBanner />
            <Toaster />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
