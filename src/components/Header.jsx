import React from "react";

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        <div 
          className="text-xl font-bold cursor-pointer" 
          style={{fontFamily: 'Poppins, sans-serif', fontWeight: 800}}
          onClick={() => setCurrentPage('landing')}
        >
          Bossbaby
        </div>
        {currentPage === "landing" && (
          <div className="sm:hidden">
            <label htmlFor="mobile-nav" className="sr-only">
              Navigate pages
            </label>
            <select
              id="mobile-nav"
              defaultValue=""
              className="text-sm px-3 py-2 rounded-full border border-gray-300 bg-white text-gray-700"
              onChange={(e) => {
                if (e.target.value) setCurrentPage(e.target.value);
              }}
            >
              <option value="" disabled>
                Menu
              </option>
              <option value="products">Products</option>
              <option value="community">Community</option>
              <option value="about">About</option>
            </select>
          </div>
        )}
        <nav
          className={`items-center gap-2 ${currentPage === "landing" ? "hidden sm:flex" : "flex"}`}
          style={{fontFamily: 'Poppins, sans-serif'}}
        >
          <a 
            href="#" 
            className={`text-sm px-4 py-2 rounded-full transition-all ${
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
            className={`text-sm px-4 py-2 rounded-full transition-all ${
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
            className={`text-sm px-4 py-2 rounded-full transition-all ${
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

