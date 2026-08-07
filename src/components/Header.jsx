import React, { useState } from "react";

export default function Header({ currentPage, setCurrentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: 'Drinks', page: 'products', href: '/products' },
    { label: 'AI machine', page: 'howitworks', href: '/how-it-works' },
    { label: 'Bossbabes', page: 'community', href: '/community' },
    { label: 'About', page: 'about', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1.5">
        <a
          href="/"
          className="text-xl font-bold cursor-pointer" 
          style={{fontFamily: 'Poppins, sans-serif', fontWeight: 800}}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('landing');
          }}
        >
          bossbaby
        </a>
        <div className="flex items-center gap-2" style={{fontFamily: 'Poppins, sans-serif'}}>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ label, page, href }) => (
              <a
                key={page}
                href={href}
                className={`text-sm px-4 py-2 rounded-full transition-all ${
                  currentPage === page
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-[#FF89CC] hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(v => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 18H20" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Mobile stacked menu */}
        {mobileOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-sm z-50">
            <div className="flex flex-col py-3 px-4 gap-2">
              {links.map(({ label, page, href }) => (
                <a
                  key={page + '-mobile'}
                  href={href}
                  className={`text-base px-3 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-[#FF89CC] hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                    setMobileOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

