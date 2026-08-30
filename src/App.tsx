import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundSwitcher from './components/BackgroundSwitcher';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const NumberToWordsPage = lazy(() => import('./pages/NumberToWordsPage'));
const FinancialCalculatorPage = lazy(() => import('./pages/FinancialCalculatorPage'));
const DocumentHelperPage = lazy(() => import('./pages/DocumentHelperPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/number-to-words" element={<NumberToWordsPage />} />
            <Route path="/tools/financial-calculator" element={<FinancialCalculatorPage />} />
            <Route path="/tools/document-helper" element={<DocumentHelperPage />} />
            <Route path="/about" element={<StaticPage page="about" />} />
            <Route path="/privacy" element={<StaticPage page="privacy" />} />
            <Route path="/terms" element={<StaticPage page="terms" />} />
            <Route path="/contact" element={<StaticPage page="contact" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackgroundSwitcher />
    </div>
  );
}
