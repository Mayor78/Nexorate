'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Zap } from 'lucide-react';
import test from '../../assets/test.jpg';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-24 pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight"
          >
            <span className="inline">Ready to </span>
            <span className="inline italic text-sky-400">Trade</span>
            <span className="inline">?</span>
          </motion.h2>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-full aspect-video md:aspect-16/6 rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10"
          >
            <Image
              src={test}
              alt="Nexorate Marketplace"
              fill
              // sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
           
              <p className="text-white text-lg md:text-2xl font-bold max-w-lg drop-shadow-lg">
                Join thousands buying and selling across Nigeria
              </p>
              <Link
                href="/post"
                className="mt-5 px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-sky-50 transition shadow-lg"
              >
                Start Selling — It&apos;s Free
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 mb-16 md:mb-20">
          {footerSections.map((section, idx) => (
            <motion.div key={section.title} variants={itemVariants} className="space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl font-black text-white uppercase tracking-widest"
              >
                {section.title}
              </motion.h3>

              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 + linkIdx * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-sky-400 text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"
                    >
                      {link.icon && (
                        <link.icon size={14} className="text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent mb-8 origin-left"
        />

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            &copy; {new Date().getFullYear()} Nexorate. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <Link href="#" className="hover:text-sky-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-sky-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-sky-400 transition-colors">Help</Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
