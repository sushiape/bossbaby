import React from "react";

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 py-3">
        <div 
          className="text-xl font-bold cursor-pointer self-start sm:self-auto" 
          style={{fontFamily: 'Poppins, sans-serif', fontWeight: 800}}
          onClick={() => setCurrentPage('landing')}
        >
          Bossbaby
        </div>
        <nav className="w-full sm:w-auto flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0" style={{fontFamily: 'Poppins, sans-serif'}}>
          <a 
            href="#" 
            className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all whitespace-nowrap shrink-0 ${
              currentPage === 'products' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('products');
            }}
          >
            Products
          </a>
          <a 
            href="#" 
            className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all whitespace-nowrap shrink-0 ${
              currentPage === 'community' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('community');
            }}
          >
            Community
          </a>
          <a 
            href="#" 
            className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-all whitespace-nowrap shrink-0 ${
              currentPage === 'about' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('about');
            }}
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

