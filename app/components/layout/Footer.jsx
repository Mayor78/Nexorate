'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Zap } from 'lucide-react';


export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const footerSections = [
    {
      title: 'Explore',
      links: [
        { label: 'Browse All', href: '/categories' },
        { label: 'Phones', href: '/categories/phones' },
        { label: 'Cars', href: '/categories/cars' },
        { label: 'Properties', href: '/categories/properties' },
        { label: 'Electronics', href: '/categories/electronics' },
      ],
    },
    {
      title: 'Sell',
      links: [
        { label: 'Post a Listing', href: '/post' },
        { label: 'Boost Your Ad', href: '/post' },
        { label: 'Messages', href: '/messages' },
        { label: 'My Profile', href: '/profile' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'Lagos, Nigeria', href: '#', icon: MapPin },
        { label: 'support@nexorate.ng', href: 'mailto:support@nexorate.ng', icon: Mail },
        { label: '+234 7084718050', href: 'tel:+2347084718050', icon: Phone },
      ],
    },
  ];

  // Flatten all links into one inline row (CyberAgent-style)
  const inlineLinks = footerSections.flatMap((s) => s.links);

  return (
    <footer className="bg-black text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center text-center"
      >
        {/* Logo / Wordmark */}
        <motion.div variants={itemVariants} className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2">
          
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Nexorate<sup className="text-xs align-super ml-1 text-white/60">®</sup>
            </span>
          </Link>
        </motion.div>

        {/* CTA line */}
        <motion.div variants={itemVariants} className="mb-5">
          <p className="text-white/70 text-sm mb-4">
            Join thousands buying and selling across Nigeria
          </p>
          <Link
            href="/post"
            className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Start Selling — It&apos;s Free
          </Link>
        </motion.div>

        {/* Inline link row */}
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-6 text-sm text-white/80"
        >
          {inlineLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={`${link.label}-${idx}`}
                href={link.href}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors whitespace-nowrap"
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </motion.nav>

        {/* Circular social/contact icons */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-5">
          {[MapPin, Mail, Phone, Zap].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <a
            href="#"
            className="h-10 px-5 rounded-full border border-white/60 text-white text-sm font-medium flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            English
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.p variants={itemVariants} className="text-xs text-white/60">
          Copyright © {new Date().getFullYear()} Nexorate, Inc.
        </motion.p>

        {/* Bottom legal row */}
        <motion.div
          variants={itemVariants}
          className="mt-2 flex items-center justify-center gap-6 text-xs text-white/50"
        >
          <Link href="#" className="hover:text-white transition">Terms</Link>
          <Link href="#" className="hover:text-white transition">Privacy</Link>
          <Link href="#" className="hover:text-white transition">Help</Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
