
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

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
              <ChatBot />
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
                
                {/* Blog pages */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:postId" element={<BlogPost />} />
                <Route path="/admin/blog" element={
                  <ProtectedRoute>
                    <BlogAdmin />
                  </ProtectedRoute>
                } />
                
                {/* Legal pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                
                {/* Handle redirect for potential broken URLs */}
                <Route path="/index.html" element={<Navigate to="/" replace />} />
                
                {/* Catch-all route for 404 errors */}
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
