'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, BookMarked, PlusSquare, MessageCircle, User, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const baseNavItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Saved', icon: BookMarked, href: '/saved' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, userData } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isMessagePage = pathname?.startsWith('/messages');
  const hideNav = isMessagePage;

  useEffect(() => {
    if (!user) return;
    setMounted(true);

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

  const getNavItems = () => {
    if (user) {
      const items = [
        ...baseNavItems,
        { name: 'Post', icon: PlusSquare, href: '/post' },
        { name: 'Messages', icon: MessageCircle, href: '/messages', badge: unreadCount },
      ];
      if (userData?.role === 'admin') {
        items.push({ name: 'Admin', icon: Shield, href: '/admin' });
      }
      items.push({ name: 'Profile', icon: User, href: '/profile' });
      return items;
    } else {
      return [
        ...baseNavItems,
        { name: 'Account', icon: LogIn, href: '/auth' },
      ];
    }
  };

  const items = getNavItems();
  const centerIndex = Math.floor(items.length / 2);

  if (hideNav) return null;
  if (!mounted) return null;

  return (
    <>
      <div className="block h-20 md:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 block md:hidden">
        <div className="relative mx-auto max-w-md rounded-3xl bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="flex items-end justify-around h-16 px-2">
            {items.map((item, idx) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isCenter = idx === centerIndex;

              if (isCenter) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative flex-1 flex justify-center"
                  >
                    {/* Raised circle button */}
                    <div className="absolute -top-22 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_8px_20px_rgba(124,58,237,0.5)] ring-4 ring-[#1a1a1a]">
                        <Icon size={24} className="text-white" strokeWidth={2.2} />
                      </div>
                      <span className={`mt-1 text-[12px] font-medium ${isActive ? 'text-violet-400' : 'text-gray-400'}`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                    isActive ? 'text-violet-400' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[11px] mt-1 font-medium">{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400" />
                  )}

                  {item.badge > 0 && item.name === 'Messages' && (
                    <div className="absolute top-1 right-1/4 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
