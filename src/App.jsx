import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BossBabyLandingPage from './components/BossBabyLandingPage';
import BossBabyProductsPage from './components/BossBabyProductsPage';
import BossBabyCommunityPage from './components/BossBabyCommunityPage';
import BossBabyAboutPage from './components/BossBabyAboutPage';
import PageLoader from './components/PageLoader';

function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <BossBabyProductsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'community':
        return <BossBabyCommunityPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'about':
        return <BossBabyAboutPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
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
