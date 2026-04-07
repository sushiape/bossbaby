import React from "react";

export default function Header({ currentPage, setCurrentPage }) {
  const links = [
    { label: 'Products', page: 'products', href: '/products' },
    { label: 'About', page: 'about', href: '/about' },
    { label: 'Community', page: 'community', href: '/community' },
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
        <nav className="flex items-center gap-2" style={{fontFamily: 'Poppins, sans-serif'}}>
          {links.map(({ label, page, href }) => (
            <a
              key={page}
              href={href}
              className={`text-sm px-4 py-2 rounded-full transition-all ${
                currentPage === page
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
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
      </div>
    </header>
  );
}

