import React from "react";
import { Button } from "./ui/button";

const brand = {
  lightPink: "#FFB6C1",
  lightPurple: "#DDA0DD",
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2">
        <div 
          className="text-xl font-light cursor-pointer" 
          style={{fontFamily: 'Poppins, sans-serif'}}
          onClick={() => setCurrentPage('landing')}
        >
          Bossbaby
        </div>
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8" style={{fontFamily: 'Poppins, sans-serif'}}>
          <a 
            href="#" 
            className="text-sm font-normal hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('landing');
            }}
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-sm font-normal hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('products');
            }}
          >
            Products
          </a>
          <a 
            href="#" 
            className="text-sm font-normal hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('community');
            }}
          >
            Community
          </a>
          <a 
            href="#" 
            className="text-sm font-normal hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('about');
            }}
          >
            About
          </a>
          <a 
            href="#" 
            className="text-sm font-normal hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('faq');
            }}
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center">
          <Button 
            className="rounded-full px-6 py-2 text-sm font-normal text-white hover:opacity-90 transition-opacity" 
            style={{backgroundColor: '#E992C0', fontFamily: 'Poppins, sans-serif'}}
          >
            buy
          </Button>
        </div>
      </div>
    </header>
  );
}

