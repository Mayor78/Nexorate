'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../ui/NotificationCenter';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, logout, loading: authLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalUnread = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const messages = data.messages || [];
        const unreadMessages = messages.filter(msg =>
          msg.senderId !== user.uid && !msg.read
        );
        totalUnread += unreadMessages.length;
      });
      setUnreadCount(totalUnread);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsProfileOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Browse', href: '/categories' },
  ];

  const loggedInNavItems = [
    { name: 'Messages', href: '/messages', badge: unreadCount },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center font-black text-white text-xl bg-sky-600"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
            >
              N
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-black tracking-tight">
                <span className="text-sky-600">Nexo</span>
                <span className="text-slate-900">rate</span>
              </h1>
              <p className="text-[9px] tracking-[0.15em] uppercase text-slate-400 mt-1">
                We Always Try to Make a Difference
              </p>
            </div>
          </Link>

          {/* Centered Nav */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-[13px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                    active ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
                  )}
                </Link>
              );
            })}
            {user && loggedInNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-[13px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                    active ? 'text-sky-600' : 'text-slate-600 hover:text-sky-600'
                  }`}
                >
                  {item.name}
                  {item.badge > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {authLoading ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ) : user ? (
              <>
                <NotificationCenter />
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-sky-600">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-xl border border-slate-100 py-2 z-50">
                        {[
                          { name: 'Post Listing', href: '/post' },
                          { name: 'Messages', href: '/messages', badge: unreadCount },
                          { name: 'Profile', href: '/profile' },
                        ].map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold tracking-[0.15em] uppercase text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition"
                          >
                            <span>{item.name}</span>
                            {item.badge > 0 && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center normal-case tracking-normal">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                        {userData?.role === 'admin' && (
                          <>
                            <div className="border-t border-slate-100 my-1" />
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold tracking-[0.15em] uppercase text-sky-600 hover:bg-sky-50 transition"
                            >
                              <Shield size={14} />
                              Admin Dashboard
                            </Link>
                          </>
                        )}
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold tracking-[0.15em] uppercase text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/auth"
                  className="text-[13px] font-semibold tracking-[0.15em] uppercase text-slate-600 hover:text-sky-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white px-5 py-2.5 bg-sky-600 hover:bg-sky-500 transition"
                >
                  Start Selling
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
