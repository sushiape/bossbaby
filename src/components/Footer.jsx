import React from "react";

export default function Footer({ setCurrentPage }) {
  const legalLinks = [
    { label: 'Impressum', page: 'impressum', href: '/impressum' },
    { label: 'Datenschutz', page: 'privacy', href: '/privacy' },
    { label: 'AGB', page: 'terms', href: '/terms' },
    { label: 'Barrierefreiheit', page: 'accessibility', href: '/accessibility' },
  ];

  return (
    <footer
      className="pt-6"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 100%)',
        fontSize: '14px',
        fontWeight: 300,
      }}
    >
      <div
        className="w-full px-6 py-5 sm:px-8 sm:py-6"
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.82) 0%, rgba(255,248,252,0.72) 50%, rgba(255,255,255,0.78) 100%)',
          backdropFilter: 'blur(22px) saturate(140%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="order-1 flex items-center justify-center gap-3 mx-auto sm:order-3 sm:mx-0">
            <span style={{ fontSize: '12px', fontWeight: 300, color: '#6e6e73' }}>Follow us on</span>
            <a
              href="https://www.instagram.com/bossbabiezz/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity inline-block rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.45)' }}
              aria-label="Follow us on Instagram"
            >
              <img
                src="/inslogo.png"
                alt="Instagram"
                style={{ width: '42px', height: '42px', display: 'block' }}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/bossbb/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity inline-block rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.45)' }}
              aria-label="Follow us on LinkedIn"
            >
              <img
                src="/linklogo.png"
                alt="LinkedIn"
                style={{ width: '42px', height: '42px', display: 'block' }}
              />
            </a>
          </div>

          <p className="order-3 text-center sm:order-1 sm:text-left" style={{ color: '#6e6e73', fontSize: '12px' }}>
            © 2026 with 🩷 by bossbaby
          </p>

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
                  className="transition-colors underline"
                  style={{ fontSize: '12px', fontWeight: 300, color: '#6e6e73' }}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

