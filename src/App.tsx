
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import NavigationHeader from './components/NavigationHeader';
import Footer from './components/Footer';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';
import CoursePage from './pages/CoursePage';
import CourseAdmin from './pages/CourseAdmin';
import FileStoragePage from './pages/FileStoragePage';
import Blog from './pages/Blog';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference on component mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      // If no theme is stored, check the user's system preference
      setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Listen for changes in the system's color scheme
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

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
              <div className="flex flex-col min-h-screen">
                <NavigationHeader />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:postId" element={<BlogPost />} />
                    <Route path="/blog-admin" element={<BlogAdmin />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/courses/admin" element={<CourseAdmin />} />
                    <Route path="/files" element={<FileStoragePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<Auth />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
