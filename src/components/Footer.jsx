import React from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default function Footer() {
  return (
    <footer className="bg-white text-center py-8 px-4" style={{fontSize: '15px', fontWeight: 300}}>
      <p>
        © 2025 with 🩷 by bossbaby
      </p>
    </footer>
  );
}

