
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';

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
import CoursePage from '@/pages/CoursePage';

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Landing page route (completely standalone) */}
                <Route path="/" element={<LandingPage />} />
                
                {/* All other routes with shared layout */}
                <Route element={
                  <>
                    <NavigationHeader />
                    <main className="min-h-screen mb-8">
                      <Routes>
                        <Route path="/app" element={<Index />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/debt-summary" element={<DebtSummaryPage />} />
                        <Route path="/debt-strategies" element={<DebtStrategies />} />
                        <Route path="/courses" element={<CoursePage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/loan-terms" element={<LoanTerms />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:postId" element={<BlogPost />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route 
                          path="/blog-admin" 
                          element={
                            <ProtectedRoute>
                              <BlogAdmin />
                            </ProtectedRoute>
                          } 
                        />
                        {/* Add new route for /admin/blog that also points to BlogAdmin */}
                        <Route 
                          path="/admin/blog" 
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
                  </>
                }>
                  {/* These paths match the Routes above, needed for proper routing */}
                  <Route path="/app" element={null} />
                  <Route path="/dashboard" element={null} />
                  <Route path="/debt-summary" element={null} />
                  <Route path="/debt-strategies" element={null} />
                  <Route path="/courses" element={null} />
                  <Route path="/privacy-policy" element={null} />
                  <Route path="/cookie-policy" element={null} />
                  <Route path="/terms-of-service" element={null} />
                  <Route path="/loan-terms" element={null} />
                  <Route path="/blog" element={null} />
                  <Route path="/blog/:postId" element={null} />
                  <Route path="/auth" element={null} />
                  <Route path="/blog-admin" element={null} />
                  <Route path="/admin/blog" element={null} /> {/* Add matching path here */}
                  <Route path="*" element={null} />
                </Route>
              </Routes>
              <CookieConsentBanner />
              <Toaster />
            </AuthProvider>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
