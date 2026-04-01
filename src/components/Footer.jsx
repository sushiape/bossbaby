import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white py-6 px-4" style={{fontSize: '15px', fontWeight: 300}}>
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-center sm:text-left order-2 sm:order-1">
            © 2026 with 🩷 by bossbaby
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <span className="text-center sm:text-left" style={{fontSize: '14px', fontWeight: 300}}>
              Follow us on
            </span>
            <div className="flex items-center gap-3">
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
                  style={{width: '40px', height: '40px', display: 'block'}}
                  className="sm:w-12 sm:h-12"
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
                  style={{width: '40px', height: '40px', display: 'block'}}
                  className="sm:w-12 sm:h-12"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

