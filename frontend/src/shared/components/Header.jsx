import React, { useState } from "react";
import { navigationRoutes } from "../../app/routes";

export default function Header({ currentPage, setCurrentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const link = (route, mobile = false) => (
    <a
      key={`${route.id}${mobile ? "-mobile" : ""}`}
      href={route.path}
      className={`${mobile ? "text-base px-3 py-2 rounded-lg" : "text-sm px-4 py-2 rounded-full"} transition-all ${
        currentPage === route.id
          ? "bg-black text-white"
          : "text-gray-700 hover:bg-[#FF89CC] hover:text-white"
      }`}
      onClick={route.documentNavigation
        ? undefined
        : (event) => {
            event.preventDefault();
            setCurrentPage(route.id);
            if (mobile) setMobileOpen(false);
          }}
    >
      {route.navigationLabel}
    </a>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1.5">
        <a
          href="/"
          className="text-xl font-bold cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
          onClick={(event) => {
            event.preventDefault();
            setCurrentPage("landing");
          }}
        >
          bossbaby
        </a>
        <div className="flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navigationRoutes.map((route) => link(route))}
          </nav>
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-sm z-50">
            <nav className="flex flex-col py-3 px-4 gap-2" aria-label="Mobile navigation">
              {navigationRoutes.map((route) => link(route, true))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
