'use client';

import { useState, useEffect } from 'react';
import { 
  Home, Search, PlusSquare, MessageCircle, User,
  Settings, LogOut, HelpCircle, Zap, ChevronLeft, ChevronRight,
  LogIn, UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

// Guest nav items (not logged in)
const guestNavItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Explore', icon: Search, href: '/categories' },
];

// User nav items (logged in)
const userNavItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Explore', icon: Search, href: '/categories' },
  { name: 'Post Listing', icon: PlusSquare, href: '/post' },
  { name: 'Messages', icon: MessageCircle, href: '/messages' },
  { name: 'Profile', icon: User, href: '/profile' },
];

const bottomNavItems = [
  { name: 'Help', icon: HelpCircle, href: '/help' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Determine which nav items to show based on auth state
  const mainNavItems = user ? userNavItems : guestNavItems;

  // Don't render auth-dependent content until mounted on client
  if (!mounted) {
    return (
      <>
        <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-white border-r border-slate-100 transition-all duration-300 z-50">
          <div className="p-5 border-b border-slate-100">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              <span className="text-sky-600">Nexo</span><span>rate</span>
            </h1>
          </div>
          <div className="flex-1 p-3 space-y-1 mt-4">
            <div className="animate-pulse space-y-2">
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </aside>
        <div className="hidden md:block md:w-64 md:flex-shrink-0" />
      </>
    );
  }

  return (
    <>
      {/* Desktop Sidebar Frame */}
      <aside 
        className={`hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
          bg-white border-r border-slate-100 transition-all duration-300 z-50`}
      >
        {/* Logo Branding Node */}
        <div className={`p-5 border-b border-slate-100 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                <span className='text-sky-600'>Nexo</span><span>rate</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Classified Ads
              </p>
            </div>
          ) : (
            <h1 className="text-xl font-black text-sky-500 tracking-tighter">N</h1>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-slate-600 transition"
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-4">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isMessages = item.name === 'Messages';
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 ${
                  isActive 
                    ? 'bg-sky-50/60 text-sky-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.name : ''}
              >
                <div className="relative">
                  <Icon size={18} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                  {/* Unread Message Badge for Messages icon */}
                  {isMessages && unreadCount > 0 && (
                    <div className="absolute -top-2 -right-3 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm tracking-tight">{item.name}</span>
                    {isMessages && unreadCount > 0 && (
                      <span className="text-xs font-bold text-red-500">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {/* Auth Section - Show different buttons based on login state */}
          {!user ? (
            // Guest - Show Login/Signup buttons
            <>
              <Link
                href="/auth"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 text-sky-600 hover:bg-sky-50/60 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? 'Login / Signup' : ''}
              >
                <LogIn size={18} />
                {!isCollapsed && <span className="text-sm tracking-tight font-medium">Login / Signup</span>}
              </Link>
            </>
          ) : (
            // Logged in - Show Settings, Help, Logout
            <>
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 ${
                      isActive 
                        ? 'bg-sky-50/60 text-sky-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <Icon size={18} className="text-slate-400" />
                    {!isCollapsed && <span className="text-sm tracking-tight">{item.name}</span>}
                  </Link>
                );
              })}
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50/60 transition-all duration-150 ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Logout' : ''}
              >
                <LogOut size={18} />
                {!isCollapsed && <span className="text-sm tracking-tight">Logout</span>}
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Structural Desktop Space Holder */}
      <div className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`} />
    </>
  );
}