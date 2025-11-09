import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white py-8 px-4" style={{fontSize: '15px', fontWeight: 300}}>
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <p className="text-center sm:text-left">
          © 2025 with 🩷 by bossbaby
        </p>
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <span style={{fontSize: '15px', fontWeight: 300}}>Follow us on</span>
          <a 
            href="https://www.instagram.com/bossbabiezz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity inline-block"
            aria-label="Follow us on Instagram"
          >
            <img 
              src="bossbaby/public/inslogo.png" 
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
              src="bossbaby/public/linklogo.png" 
              alt="LinkedIn" 
              style={{width: '48px', height: '48px', display: 'block'}}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

