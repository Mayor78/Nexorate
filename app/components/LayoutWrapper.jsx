'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './layout/BottomNav';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { AuthProvider } from '../context/AuthContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Pages where navigation should be hidden
  const hideNavigation = pathname === '/onboarding' || pathname?.startsWith('/auth');
  const hideFooter = pathname?.startsWith('/messages') || pathname === '/auth';
  
  return (
    <AuthProvider>
      {/* Header - only on non-hidden pages */}
      {!hideNavigation && <Header />}
      
      {/* Main content */}
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-2">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      {!hideFooter && <Footer />}
      
      {/* Bottom Navigation - fixed at bottom, only on mobile */}
      {!hideNavigation && <BottomNav />}
    </AuthProvider>
  );
}