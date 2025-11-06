import React from "react";
import { Button } from "./ui/button";

// BossBaby brand palette
const brand = {
  power: "#FF1493",    // vibrant hot pink
  lightPink: "#FFB6C1", // lighter pink for buy button
  lightPurple: "#DDA0DD", // light purple for separator
  energy: "#F79A3E",   // orange
  glow: "#F9D44A",     // yellow
  calm: "#8BC374",     // green
  cream: "#F5EBDC",    // soft cream background
  ink: "#111827",      // gray-900
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default function BossBabyCommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="bg-white">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="font-serif text-xl text-black" style={{fontFamily: 'Georgia, serif'}}>Bossbaby</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 text-sm font-sans text-black">
            <a href="#home" className="hover:opacity-70">Home</a>
            <a href="#products" className="hover:opacity-70">Products</a>
            <a href="#community" className="hover:opacity-70">Community</a>
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
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

      {/* Hero Section */}
      <section className="w-full" style={{backgroundColor: brand.power, minHeight: 'calc(100vh - 65px)'}}>
        <div className="flex flex-col items-center justify-center min-h-full py-24 px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center font-sans leading-tight mb-4">
            <span className="block">Wellness drinks</span>
            <span className="block">made for her.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-black text-center font-sans mt-6">
            Empowering women with every sip.
          </p>
        </div>
      </section>

    </div>
  );
}
