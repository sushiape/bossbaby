import React from "react";
import { Button } from "./ui/button";
import { ChevronRight, ArrowUpRight, Sparkles, Users, HeartHandshake, ShieldCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

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

      {/* Hero Section - Cream Background */}
      <section className="w-full py-16 sm:py-24" style={{backgroundColor: brand.cream}}>
        <Container>
          <div className="max-w-3xl">
            <Badge className="mb-4 rounded-full px-3 py-1 text-xs font-medium border" style={{
              backgroundColor: brand.lightPink + "80",
              color: brand.ink,
              borderColor: brand.lightPink
            }}>
              Women‑led · Science‑informed · Delicious
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-sans leading-tight mb-4">
              Your community for wellness that actually fits your life.
            </h1>
            <p className="text-lg text-gray-700 font-sans mb-6">
              Connect with founders, experts, and the BossBaby crew. Recipes, routines, product testing & exclusive early‑access drops — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                className="rounded-xl px-6 py-3 text-white font-sans hover:opacity-90 flex items-center justify-center gap-2" 
                style={{backgroundColor: brand.lightPink}}
              >
                Join the community
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl px-6 py-3 font-sans border flex items-center justify-center gap-2" 
                style={{
                  borderColor: brand.energy,
                  color: brand.ink,
                  backgroundColor: brand.cream
                }}
              >
                Learn more
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-8 w-8 rounded-full ring-2 ring-white" 
                    style={{backgroundColor: brand.lightPink}} 
                  />
                ))}
              </div>
              <span>3.2k+ members · 92% would recommend</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Cards Section - Light Pink Background */}
      <section className="w-full py-16 sm:py-24" style={{backgroundColor: brand.lightPink + "40"}}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="rounded-2xl shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor: brand.lightPink + "33"}}>
                    <Sparkles className="h-5 w-5" style={{color: brand.lightPink}} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sans">Daily Tips</h3>
                </div>
                <p className="text-sm text-gray-600 font-sans">Tiny routines, recipe bites & science nuggets — read in 60s.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor: brand.energy + "33"}}>
                    <Users className="h-5 w-5" style={{color: brand.energy}} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sans">Circle Groups</h3>
                </div>
                <p className="text-sm text-gray-600 font-sans">Topic circles for Energy, Focus, Skin & Cycle.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor: brand.calm + "33"}}>
                    <HeartHandshake className="h-5 w-5" style={{color: brand.calm}} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sans">Expert AMAs</h3>
                </div>
                <p className="text-sm text-gray-600 font-sans">Live Q&As with nutrition & hormone health pros.</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor: brand.glow + "33"}}>
                    <ShieldCheck className="h-5 w-5" style={{color: brand.glow}} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sans">Product Testers</h3>
                </div>
                <p className="text-sm text-gray-600 font-sans">Try new flavors first & share feedback.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

    </div>
  );
}
