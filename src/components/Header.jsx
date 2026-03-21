import React, { useState } from "react";

export default function Header({ currentPage, setCurrentPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "products", label: "Products" },
    { key: "community", label: "Community" },
    { key: "about", label: "About" },
  ];

  const handleNavClick = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        <div 
          className="text-xl font-bold cursor-pointer" 
          style={{fontFamily: 'Poppins, sans-serif', fontWeight: 800}}
          onClick={() => {
            setCurrentPage("landing");
            setIsMobileMenuOpen(false);
          }}
        >
          Bossbaby
        </div>
        <button
          type="button"
          className="sm:hidden text-sm font-semibold px-3 py-2 rounded-full border border-gray-300 bg-white text-gray-800"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-expanded-menu"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
        <nav className="hidden sm:flex items-center gap-2" style={{fontFamily: 'Poppins, sans-serif'}}>
          <a 
            href="#" 
            className={`text-sm px-4 py-2 rounded-full transition-all ${
              currentPage === 'products' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={(e) => handleNavClick(e, "products")}
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
            onClick={(e) => handleNavClick(e, "community")}
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
            onClick={(e) => handleNavClick(e, "about")}
          >
            About
          </a>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div
          id="mobile-expanded-menu"
          className="sm:hidden border-t border-gray-200 bg-white"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <nav className="max-w-7xl mx-auto px-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href="#"
                className={`flex items-center justify-between py-4 text-lg font-semibold border-b border-gray-100 ${
                  currentPage === item.key ? "text-black" : "text-gray-700"
                }`}
                onClick={(e) => handleNavClick(e, item.key)}
              >
                <span>{item.label}</span>
                <span className="text-xl leading-none">+</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

