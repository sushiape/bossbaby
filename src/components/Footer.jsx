import React from "react";

export default function Footer({ setCurrentPage }) {
  const legalLinks = [
    { label: 'Impressum', page: 'impressum', href: '/impressum' },
    { label: 'Datenschutz', page: 'privacy', href: '/privacy' },
    { label: 'AGB', page: 'terms', href: '/terms' },
    { label: 'Barrierefreiheit', page: 'accessibility', href: '/accessibility' },
  ];

  return (
    <footer className="bg-white py-8 px-4" style={{fontSize: '15px', fontWeight: 300}}>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
        <div className="order-1 flex items-center justify-center gap-3 mx-auto sm:order-3 sm:mx-0">
          <span style={{fontSize: '15px', fontWeight: 300}}>Follow us on</span>
          <a 
            href="https://www.instagram.com/bossbabiezz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="Follow us on Instagram"
          >
            <img 
              src="/inslogo.png" 
              alt="Instagram" 
              style={{width: '48px', height: '48px', display: 'block'}}
            />
          </a>
          <a 
            href="https://www.linkedin.com/company/bossbb/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="Follow us on LinkedIn"
          >
            <img 
              src="/linklogo.png" 
              alt="LinkedIn" 
              style={{width: '48px', height: '48px', display: 'block'}}
            />
          </a>
        </div>
        {setCurrentPage && (
          <div className="order-2 flex flex-col items-center gap-1 text-center sm:order-2 sm:flex-1 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-2">
            {legalLinks.map(({ label, page, href }) => (
              <a
                key={page}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
                className="text-gray-600 hover:text-gray-800 transition-colors underline"
                style={{fontSize: '13px', fontWeight: 300}}
              >
                {label}
              </a>
            ))}
          </div>
        )}
        <p className="order-3 text-center sm:order-1 sm:text-left">
          © 2026 with 🩷 by bossbaby
        </p>
      </div>
    </footer>
  );
}

