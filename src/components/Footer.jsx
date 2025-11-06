import React from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left: Email Signup */}
          <div>
            <h3 className="text-xl font-bold text-black font-sans mb-4">
              Ready to feel unstoppable?
            </h3>
            <div className="flex gap-2">
              <Input 
                placeholder="enter your email" 
                className="flex-1"
              />
              <Button 
                className="px-6 py-2 text-white rounded-md"
                style={{backgroundColor: "#FF1493"}}
              >
                go
              </Button>
            </div>
          </div>

          {/* Right: Logo and Social */}
          <div className="flex flex-col items-end md:items-start">
            <span 
              className="font-serif text-2xl text-black mb-4" 
              style={{fontFamily: 'Georgia, serif'}}
            >
              Bossbaby
            </span>
            <div className="flex items-center gap-4 text-black">
              <Instagram className="h-5 w-5 cursor-pointer hover:opacity-70" />
              <Facebook className="h-5 w-5 cursor-pointer hover:opacity-70" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:opacity-70" />
              <svg className="h-5 w-5 cursor-pointer hover:opacity-70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.35 2.78-.72 4.13-.46 1.59-1.1 3.05-1.92 4.4-.82 1.35-1.8 2.58-2.92 3.66-1.12 1.08-2.38 2.01-3.75 2.75-.68.37-1.4.68-2.15.94-.38.13-.77.24-1.17.31-.4.07-.81.11-1.22.13-.41.02-.82.02-1.23 0-.41 0-.82-.04-1.22-.1-.4-.07-.79-.18-1.17-.31-.75-.26-1.47-.57-2.15-.94-1.37-.74-2.63-1.67-3.75-2.75-1.12-1.08-2.1-2.31-2.92-3.66-.82-1.35-1.46-2.81-1.92-4.4-.37-1.35-.64-2.73-.72-4.13-.01-2.93-.03-5.83-.02-8.75-.52.34-1.05.67-1.62.93-1.31.62-2.76.92-4.2.97V6.16c1.54-.17 3.12-.68 4.24-1.79 1.12-1.11 1.67-2.64 1.75-4.17 1.3.01 2.6 0 3.91.02z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t">
          <p className="text-xs text-gray-600">
            © 2023 velt ❤️ by bossbaby
          </p>
        </div>
      </Container>
    </footer>
  );
}

