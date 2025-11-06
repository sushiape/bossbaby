import React from "react";
import { ChevronDown, Bluetooth } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import Header from "./Header";
import Footer from "./Footer";

// BossBaby brand palette
const brand = {
  power: "#FF1493",    // vibrant hot pink
  lightPink: "#FFB6C1", // lighter pink
  pastelPink: "#FFE4E1", // pastel pink
  pastelGreen: "#E0F2E0", // pastel green
  energy: "#F79A3E",   // orange
  glow: "#F9D44A",     // yellow
  calm: "#8BC374",     // green
  cream: "#F5EBDC",    // soft cream background
  ink: "#111827",      // gray-900
  darkGreen: "#2D5016", // dark green for PRODUCTS logo
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const testimonials = [
  {
    name: "Sarah",
    age: 29,
    role: "Marketing Director",
    quote: "Finally, a wellness brand that doesn't make me feel like I'm failing at life. These shots just... get it.",
    bgColor: "#D2691E", // orange-brown
    imageBg: "bg-white"
  },
  {
    name: "Maya",
    age: 34,
    role: "Entrepreneur",
    quote: "The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket",
    bgColor: "#DDA0DD", // light purple
    imageBg: "bg-blue-100"
  },
  {
    name: "Jess",
    age: 28,
    role: "Designer",
    quote: "I've never been consistent with supplements, but this one feels like self-care, not homework.",
    bgColor: brand.power, // hot pink
    imageBg: "bg-pink-100"
  },
  {
    name: "Julie",
    age: 27,
    role: "Fitness Coach",
    quote: "The POWER shot is my go-to before training—it helps me push through tough sessions and recover with strength.",
    bgColor: "#87CEEB", // sky blue
    imageBg: "bg-blue-50"
  }
];

export default function BossBabyLandingPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Section 1: Hero Section - Hot Pink Background */}
      <section className="w-full py-16 sm:py-24" style={{backgroundColor: brand.power}}>
        <Container>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white font-sans leading-tight mb-4">
              <span className="block">Wellness drinks</span>
              <span className="block ml-8 sm:ml-12">made for her.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-black font-sans mb-8">
              Empowering women with every sip.
            </p>
            
        
      

      {/* Section 2: Products Overview Section - White Background */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <Container>
          {/* PRODUCTS Logo */}
          <div className="mb-8">
            <div 
              className="inline-block px-6 py-4 rounded-2xl mb-4"
              style={{backgroundColor: brand.darkGreen}}
            >
              <span className="text-4xl sm:text-5xl font-bold tracking-wide" style={{color: brand.power}}>
                PRODUCTS
              </span>
            </div>
            
            {/* Dropdown Menu */}
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                <span className="text-gray-700 font-sans">Classic Drinks</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Product Visuals - 3 items in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Left: Green Bottle */}
            <div className="flex items-center justify-center">
              <div 
                className="w-full h-64 rounded-2xl p-8 flex items-center justify-center"
                style={{backgroundColor: brand.pastelGreen}}
              >
                <div className="w-20 h-32 rounded-t-full rounded-b-lg" style={{backgroundColor: brand.calm}}>
                  <div className="w-full h-6 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
                </div>
              </div>
            </div>

            {/* Middle: Smartphone App */}
            <div className="flex items-center justify-center">
              <div 
                className="w-full h-64 rounded-2xl p-4 flex items-center justify-center"
                style={{backgroundColor: brand.pastelGreen}}
              >
                <div className="w-48 h-96 bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Hi Bossbaby, How are you feeling today?</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {["Tired", "Stressed", "Unfocused", "Meh", "Motivated", "Fatigued"].map((mood, i) => (
                        <button 
                          key={i}
                          className="px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-gray-700"
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                    <div className="mb-4 p-2 bg-yellow-50 rounded">
                      <p className="text-xs font-bold text-gray-900 mb-1">AI insight</p>
                      <p className="text-xs text-gray-700">STUDIES SUGGEST VITAMIN C AND MAGNESIUM MAY HELP REDUCE FATIGUE</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-900 mb-2">Recommended Smoothie</p>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg" style={{backgroundColor: brand.calm}}></div>
                        <span className="text-xs text-gray-700">Spinach Blueberry</span>
                      </div>
                    </div>
                    <button 
                      className="mt-auto px-4 py-2 text-xs font-bold text-white rounded-lg"
                      style={{backgroundColor: brand.power}}
                    >
                      Generate Mix
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Popsicles */}
            <div className="flex items-center justify-center">
              <div 
                className="w-full h-64 rounded-2xl p-8 flex items-center justify-center gap-4"
                style={{backgroundColor: brand.lightPink}}
              >
                <div className="w-8 h-24 rounded-t-lg" style={{backgroundColor: brand.energy}}></div>
                <div className="w-8 h-24 rounded-t-lg" style={{backgroundColor: brand.lightPink}}></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 3: AI-Powered Smoothie Machine Section */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black font-sans mb-4">
                World's first AI-powered smoothie machine
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-black font-sans">
                Stay tuned!
              </p>
            </div>

            {/* Right: Machine and App */}
            <div className="relative">
              <div 
                className="rounded-3xl p-8"
                style={{backgroundColor: brand.cream}}
              >
                <div className="flex items-end gap-4">
                  {/* Smoothie Machine */}
                  <div className="relative">
                    <div 
                      className="w-24 h-48 sm:w-32 sm:h-64 rounded-2xl"
                      style={{backgroundColor: brand.lightPink}}
                    >
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 rounded-lg bg-white"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white" style={{backgroundColor: brand.calm}}></div>
                    </div>
                    {/* Glass with smoothie */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-4">
                      <div className="w-12 h-16 rounded-t-lg" style={{backgroundColor: brand.calm + '80'}}>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    {/* Bluetooth Symbol */}
                    <div className="absolute top-4 right-4">
                      <Bluetooth className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>

                  {/* Phone App */}
                  <div className="w-48 h-80 bg-white rounded-2xl shadow-lg p-4">
                    <div className="h-full flex flex-col">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Today's smoothie</h3>
                      <p className="text-xs font-bold mb-2" style={{color: brand.calm}}>CALM & FOCUS</p>
                      <div className="w-full h-24 rounded-lg mb-2" style={{backgroundColor: brand.calm + '60'}}></div>
                      <p className="text-xs text-gray-700 mb-4">
                        You're taking an exam soon. To promote relaxation and concentration, add L-theanine and some B vitamins.
                      </p>
                      <button 
                        className="mt-auto px-4 py-2 text-xs font-bold text-white rounded-lg"
                        style={{backgroundColor: brand.calm}}
                      >
                        Make smoothie
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 4: Testimonials Section */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <Container>
          {/* Separator */}
          <div className="w-full h-px mb-12" style={{backgroundColor: brand.calm + '40'}}></div>
          
          {/* Headlines */}
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black font-sans mb-4">
              Real women, real feelings
            </h2>
            <p className="text-lg sm:text-xl text-black font-sans">
              Because we're all just trying to feel like ourselves, but better.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="rounded-2xl overflow-hidden shadow-sm">
                <div style={{backgroundColor: testimonial.bgColor}} className="h-48 flex items-center justify-center relative">
                  {/* Placeholder for woman image */}
                  <div className={`w-32 h-40 ${testimonial.imageBg} rounded-lg flex items-center justify-center`}>
                    <div className="w-16 h-24 rounded-t-full rounded-b-lg" style={{backgroundColor: brand.cream}}>
                      <div className="w-full h-4 rounded-t-full" style={{backgroundColor: '#9CA3AF'}}></div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-800 font-sans mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-xs text-gray-600 font-sans">
                    — {testimonial.name}, {testimonial.age}, {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
}

