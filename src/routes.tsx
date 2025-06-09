
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Import pages
import Index from './pages/Index';
import DebtStrategies from './pages/DebtStrategies';
import Calculator from './pages/Calculator';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import StrategiesPage from './pages/StrategiesPage';

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <Index />,
  },
  {
    path: '/calculator',
    element: <Calculator />,
  },
  {
    path: '/strategies',
    element: <StrategiesPage />,
  },
  {
    path: '/debt-strategies',
    element: <DebtStrategies />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
  },
  {
    path: '/cookie-policy',
    element: <CookiePolicy />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
