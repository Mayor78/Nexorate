'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl mb-6 select-none">🔍</div>

        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Oops, nothing here
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          But don&apos;t worry — there&apos;s plenty to explore on Nexorate.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition shadow-md shadow-sky-500/20"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/categories"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
          >
            <Search size={18} />
            Browse Categories
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 font-medium text-sm hover:text-slate-700 transition"
          >
            <ArrowLeft size={16} />
            Go back to previous page
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <MapPin size={12} />
            Lost? Try searching for what you need from the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
