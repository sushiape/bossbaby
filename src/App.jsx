import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import BossBabyLandingPage from './components/BossBabyLandingPage';
import BossBabyProductsPage from './components/BossBabyProductsPage';
import BossBabyCommunityPage from './components/BossBabyCommunityPage';
import BossBabyAskAnExpertPage from './components/BossBabyAskAnExpertPage';
import BossBabyFlavourLabPage from './components/BossBabyFlavourLabPage';
import BossBabyAboutPage from './components/BossBabyAboutPage';
import BossBabyImpressumPage from './components/BossBabyImpressumPage';
import BossBabyPrivacyPage from './components/BossBabyPrivacyPage';
import BossBabyTermsPage from './components/BossBabyTermsPage';
import BossBabyAccessibilityPage from './components/BossBabyAccessibilityPage';
import BossBabyHowItWorksPage from './components/BossBabyHowItWorksPage';
import PageLoader from './components/PageLoader';

const pageToPath = {
  landing: '/',
  products: '/products',
  howitworks: '/how-it-works',
  community: '/community',
  askexpert: '/ask-an-expert',
  flavourlab: '/flavour-lab',
  about: '/about',
  impressum: '/impressum',
  privacy: '/privacy',
  terms: '/terms',
  accessibility: '/accessibility',
};

const pathToPage = {
  '/': 'landing',
  '/products': 'products',
  '/how-it-works': 'howitworks',
  '/community': 'community',
  '/ask-an-expert': 'askexpert',
  '/flavour-lab': 'flavourlab',
  '/about': 'about',
  '/impressum': 'impressum',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/accessibility': 'accessibility',
};

const normalizePath = (pathname) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
};

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const normalizedPath = normalizePath(location.pathname);
  const currentPage = pathToPage[normalizedPath];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [normalizedPath]);

  const setCurrentPage = (page) => {
    const targetPath = pageToPath[page] || '/';
    navigate(targetPath);
  };

  if (!currentPage) {
    return <Navigate to="/" replace />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <BossBabyProductsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'howitworks':
        return <BossBabyHowItWorksPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'community':
        return <BossBabyCommunityPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'askexpert':
        return <BossBabyAskAnExpertPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'flavourlab':
        return <BossBabyFlavourLabPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'about':
        return <BossBabyAboutPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'impressum':
        return <BossBabyImpressumPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'privacy':
        return <BossBabyPrivacyPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'terms':
        return <BossBabyTermsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'accessibility':
        return <BossBabyAccessibilityPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'landing':
      default:
        return <BossBabyLandingPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {!loaderDone && (
          <PageLoader key="loader" onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>
      {renderPage()}
    </div>
  );
}

export default App;
