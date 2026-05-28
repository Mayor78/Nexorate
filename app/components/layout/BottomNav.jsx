'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, BookMarked, PlusSquare, MessageCircle, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const baseNavItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Saved', icon: BookMarked, href: '/saved' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hide on message and conversation pages
  const isMessagePage = pathname?.startsWith('/messages');
  const hideNav = isMessagePage;

  // Fetch unread message count
  useEffect(() => {
    if (!user) return;

    setMounted(true);

    const fetchUnreadCount = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
  }, [user]);

  // Handle scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getNavItems = () => {
    if (user) {
      return [
        ...baseNavItems,
        { name: 'Post', icon: PlusSquare, href: '/post' },
        { name: 'Messages', icon: MessageCircle, href: '/messages', badge: unreadCount },
        { name: 'Profile', icon: User, href: '/profile' },
      ];
    } else {
      return [
        ...baseNavItems,
        { name: 'Account', icon: LogIn, href: '/auth' },
      ];
    }
  };

  const items = getNavItems();

  // Don't render if not mounted or on message pages
  if (!mounted || hideNav) {
    return <div className="h-16 md:hidden" />;
  }

  return (
    <>
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 md:hidden transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-dark-muted hover:text-primary/70'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
                
                {/* Unread Message Badge */}
                {item.badge > 0 && item.name === 'Messages' && (
                  <div className="absolute -top-1 right-1/4 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </>
  );
}