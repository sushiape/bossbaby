import React from "react";
import Header from "./Header";
import Footer from "./Footer";

// BossBaby brand palette
const brand = {
  power: "#FF1493",    // vibrant hot pink
  lightPink: "#FFB6C1", // lighter pink
  pastelPink: "#FFE4E1", // pastel pink
  pastelOrange: "#FFE4B5", // pastel orange
  pastelYellow: "#FFF8DC", // pastel yellow
  pastelGreen: "#E0F2E0", // pastel green
  energy: "#F79A3E",   // orange
  glow: "#F9D44A",     // yellow
  calm: "#8BC374",     // green
  cream: "#F5EBDC",    // soft cream background
  ink: "#111827",      // gray-900
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const products = [
  {
    name: "Power",
    label: "POWER",
    color: brand.power,
    pastelColor: brand.pastelPink,
    description: "Hormone-balancing blend with adaptogenic herbs. For the days when you need your body to cooperate with your ambitions.",
    ingredients: ["Strawberries", "Blueberries"]
  },
  {
    name: "Energy",
    label: "ENERGY",
    color: brand.energy,
    pastelColor: brand.pastelOrange,
    description: "Mental clarity and sustained focus without the crash. Because your brain deserves premium fuel.",
    ingredients: ["Turmeric", "Cinnamon"]
  },
  {
    name: "Glow",
    label: "GLOW",
    color: brand.glow,
    pastelColor: brand.pastelYellow,
    description: "Skin-loving antioxidants and collagen support. Radiance that starts from the inside out.",
    ingredients: ["Lemon", "Honey"]
  },
  {
    name: "Calm",
    label: "CALM",
    color: brand.calm,
    pastelColor: brand.pastelGreen,
    description: "Nervous system support for the moment when you need to actually breath. Calm without the drowsy.",
    ingredients: ["Green Apples", "Celery"]
  }
];

export default function BossBabyProductsPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Top Banner/Header */}
      <section 
        className="relative pt-16 pb-24 overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${brand.lightPink}40, ${brand.cream})`
        }}
      >
        <Container className="relative z-10">
          <div className="text-center">
            <h1 
              className="text-6xl sm:text-7xl md:text-8xl font-bold font-sans mb-2"
              style={{ 
                color: brand.power
              }}
            >
              Bossbaby
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-sans">Products</p>
          </div>
          {/* Product bottle illustration - positioned behind text */}
          <div className="absolute top-20 right-10 sm:right-20 opacity-30">
            <div className="w-32 h-48 sm:w-40 sm:h-60 rounded-t-full rounded-b-lg" style={{backgroundColor: brand.cream}}>
              <div className="w-full h-8 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black font-sans mb-4">
                Four moods. Four formulas. One ritual.
              </h2>
              <p className="text-xl sm:text-2xl text-black font-sans">
                Choose your feeling, grab your shot, and go be unstoppable.
              </p>
            </div>

            {/* Right Side - Image Placeholder */}
            <div className="relative">
              <div 
                className="w-full h-96 sm:h-[500px] rounded-3xl flex items-center justify-center"
                style={{backgroundColor: brand.power}}
              >
                <div className="text-center text-white">
                  <div className="w-32 h-48 mx-auto mb-4 rounded-t-full rounded-b-lg" style={{backgroundColor: brand.cream}}>
                    <div className="w-full h-8 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
                  </div>
                  <p className="text-sm opacity-80">Product Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          {/* Row 1: Product Bottles - Isolated */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {products.map((product, index) => (
              <div key={index} className="text-center">
                <div 
                  className="rounded-2xl p-6 mb-4 flex items-center justify-center"
                  style={{backgroundColor: product.pastelColor}}
                >
                  <div className="w-20 h-32 sm:w-24 sm:h-40 rounded-t-full rounded-b-lg relative" style={{backgroundColor: brand.cream}}>
                    <div className="w-full h-6 sm:h-8 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 rounded-b-lg flex items-center justify-center"
                      style={{backgroundColor: product.color + '20'}}
                    >
                      <span 
                        className="text-xs sm:text-sm font-bold uppercase"
                        style={{color: product.color}}
                      >
                        {product.label}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-black font-sans lowercase">{product.name}</p>
              </div>
            ))}
          </div>

          {/* Row 2: Product Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
            {products.map((product, index) => (
              <div key={index}>
                <h3 className="text-2xl sm:text-3xl font-bold text-black font-sans mb-3">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base text-black font-sans leading-relaxed">
                  {product.description}
                </p>
              </div>
            ))}
          </div>

          {/* Row 3: Product Bottles with Context/Ingredients */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div 
                key={index}
                className="rounded-2xl p-6"
                style={{backgroundColor: product.pastelColor}}
              >
                <div className="flex items-end gap-3 mb-4">
                  <div className="w-16 h-24 sm:w-20 sm:h-32 rounded-t-full rounded-b-lg relative" style={{backgroundColor: brand.cream}}>
                    <div className="w-full h-5 sm:h-6 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 rounded-b-lg flex items-center justify-center"
                      style={{backgroundColor: product.color + '20'}}
                    >
                      <span 
                        className="text-xs font-bold uppercase"
                        style={{color: product.color}}
                      >
                        {product.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="w-full h-20 sm:h-24 rounded-lg mb-2"
                      style={{
                        backgroundColor: product.color + '40',
                        border: `2px solid ${product.color}30`
                      }}
                    ></div>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredients.map((ingredient, i) => (
                        <div 
                          key={i}
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: product.color + '30',
                            color: product.color
                          }}
                        >
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
}

