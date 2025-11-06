import React, { useState } from 'react';
import BossBabyLandingPage from './components/BossBabyLandingPage';
import BossBabyProductsPage from './components/BossBabyProductsPage';
import BossBabyCommunityPage from './components/BossBabyCommunityPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <BossBabyProductsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'community':
        return <BossBabyCommunityPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'landing':
      default:
        return <BossBabyLandingPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
