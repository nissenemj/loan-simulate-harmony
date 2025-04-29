
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { HelmetProvider } from 'react-helmet-async';
import NavigationHeader from './components/NavigationHeader';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';
import { Suspense, lazy } from 'react';

// Lazy-loaded components
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const CourseAdmin = lazy(() => import('./pages/CourseAdmin'));
const FileStoragePage = lazy(() => import('./pages/FileStoragePage'));
const Blog = lazy(() => import('./pages/Blog'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const DebtStrategies = lazy(() => import('./pages/DebtStrategies'));
const DebtSummaryPage = lazy(() => import('./pages/DebtSummaryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Router>
          <AuthProvider>
            <LanguageProvider>
              <ErrorProvider>
                <div className="flex flex-col min-h-screen">
                  <NavigationHeader />
                  <main className="flex-grow">
                    <Suspense fallback={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    }>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/calculator" element={<Index />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:postId" element={<BlogPost />} />
                        <Route path="/blog-admin" element={
                          <ProtectedRoute>
                            <BlogAdmin />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/blog" element={<Navigate to="/blog-admin" replace />} />
                        <Route path="/courses" element={<CoursePage />} />
                        <Route path="/courses/admin" element={
                          <ProtectedRoute>
                            <CourseAdmin />
                          </ProtectedRoute>
                        } />
                        <Route path="/files" element={
                          <ProtectedRoute>
                            <FileStoragePage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/debt-strategies" element={<DebtStrategies />} />
                        <Route path="/debt-summary" element={<DebtSummaryPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <Toaster />
                </div>
              </ErrorProvider>
            </LanguageProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
