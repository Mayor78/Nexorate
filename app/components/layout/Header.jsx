'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../ui/NotificationCenter';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
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
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-shadow duration-300 ${
      scrolled ? 'shadow-md border-slate-200' : 'border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-sky-600">Nexo</span>
              <span className="text-slate-900">rate</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'text-sky-600'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && loggedInNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-colors relative ${
                  isActive(item.href)
                    ? 'text-sky-600'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                {item.name}
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
                <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
              </div>
            ) : user ? (
              <>
                <NotificationCenter />
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fadeIn">
                        {[
                          { name: 'Post Listing', href: '/post' },
                          { name: 'Messages', href: '/messages', badge: unreadCount },
                          { name: 'Profile', href: '/profile' },
                        ].map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            <span>{item.name}</span>
                            {item.badge > 0 && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition">
                  Login
                </Link>
                <Link href="/auth" className="px-5 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-500 transition shadow-sm">
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
