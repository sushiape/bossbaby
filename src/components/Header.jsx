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
    <>
      <header className="bg-white">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span 
              className="font-serif text-xl text-black cursor-pointer" 
              style={{fontFamily: 'Georgia, serif'}}
              onClick={() => setCurrentPage('landing')}
            >
              Bossbaby
            </span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 text-sm font-sans text-black">
            <a 
              href="#" 
              className="hover:opacity-70"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('landing');
              }}
            >
              Home
            </a>
            <a 
              href="#" 
              className="hover:opacity-70"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('products');
              }}
            >
              Products
            </a>
            <a 
              href="#" 
              className="hover:opacity-70"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('community');
              }}
            >
              Community
            </a>
            <a 
              href="#" 
              className="hover:opacity-70"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('about');
              }}
            >
              About
            </a>
            <a 
              href="#" 
              className="hover:opacity-70"
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
              className="rounded-md px-4 py-2 text-sm font-sans text-white hover:opacity-90" 
              style={{backgroundColor: brand.lightPink}}
            >
              buy
            </Button>
          </div>
        </Container>
      </header>
      {/* Separator Line */}
      <div className="w-full h-px" style={{backgroundColor: brand.lightPurple}}></div>
    </>
  );
}

