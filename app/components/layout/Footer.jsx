'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Brand */}
            <div>
              <h2 className="text-xl font-bold">
                <span className="text-sky-500">Nexo</span>
                <span className="text-white">rate</span>
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Africa&apos;s premium marketplace for buying, selling, and swapping.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-1.5">
                <li><Link href="/" className="text-xs hover:text-sky-500 transition">Home</Link></li>
                <li><Link href="/categories" className="text-xs hover:text-sky-500 transition">Browse Categories</Link></li>
                <li><Link href="/post" className="text-xs hover:text-sky-500 transition">Post Listing</Link></li>
                <li><Link href="/help" className="text-xs hover:text-sky-500 transition">Help Center</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Categories</h3>
              <ul className="space-y-1.5">
                <li><Link href="/categories/phones" className="text-xs hover:text-sky-500 transition">Phones</Link></li>
                <li><Link href="/categories/cars" className="text-xs hover:text-sky-500 transition">Cars</Link></li>
                <li><Link href="/categories/fashion" className="text-xs hover:text-sky-500 transition">Fashion</Link></li>
                <li><Link href="/categories/properties" className="text-xs hover:text-sky-500 transition">Properties</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Contact</h3>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs">
                  <MapPin size={12} className="text-sky-500 shrink-0" />
                  <span>Lagos, Nigeria</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <Mail size={12} className="text-sky-500 shrink-0" />
                  <a href="mailto:support@nexorate.ng" className="hover:text-sky-500 transition">support@nexorate.ng</a>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <Phone size={12} className="text-sky-500 shrink-0" />
                  <a href="tel:+2348012345678" className="hover:text-sky-500 transition">+234 801 234 5678</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-500">
              © {currentYear} Nexorate. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-xs text-slate-500 hover:text-sky-500 transition">Terms</Link>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-sky-500 transition">Privacy</Link>
              <Link href="/cookies" className="text-xs text-slate-500 hover:text-sky-500 transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}