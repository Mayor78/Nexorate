'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './layout/BottomNav';
import Header from './layout/Header';
import Footer from './layout/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  const hideHeader = pathname === '/onboarding' || pathname?.startsWith('/auth') || pathname?.startsWith('/messages') || pathname?.startsWith('/admin');
  const hideFooter = pathname?.startsWith('/messages') || pathname === '/auth' || pathname?.startsWith('/admin');
  const hideBottomNav = pathname === '/onboarding' || pathname?.startsWith('/auth') || pathname?.startsWith('/messages') || pathname?.startsWith('/admin');
  
  return (
    <>
      {!hideHeader && <Header />}
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
