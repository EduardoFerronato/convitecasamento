"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

const navLinks = [
  { href: "#convite", label: "Início" },
  { href: "#historia", label: "Nossa História" },
  { href: "#presentes", label: "Presentes" },
  { href: "#rsvp", label: "Confirmar" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = `${weddingConfig.couple.bride.charAt(0)} & ${weddingConfig.couple.groom.charAt(0)}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-night/90 py-3 backdrop-blur-md" : "bg-transparent py-5 md:py-6"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#convite" className="flex items-center gap-2 font-display text-sm tracking-[0.2em] text-white md:text-base">
          <Heart className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          <span>{initials}</span>
        </a>

        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans-ui text-[10px] tracking-[0.16em] text-white/85 transition-colors hover:text-white lg:text-[11px]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-night/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-4 px-5 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans-ui text-[11px] tracking-[0.16em] text-white/85"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
