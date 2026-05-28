'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './layout/BottomNav';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { AuthProvider } from '../context/AuthContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Pages where header should be hidden
  const hideHeader = pathname === '/onboarding' || pathname?.startsWith('/auth') || pathname?.startsWith('/messages');
  
  // Pages where footer should be hidden
  const hideFooter = pathname?.startsWith('/messages') || pathname === '/auth';
  
  // Pages where bottom navigation should be hidden
  const hideBottomNav = pathname === '/onboarding' || pathname?.startsWith('/auth') || pathname?.startsWith('/messages');
  
  return (
    <AuthProvider>
      {/* Header - hidden on onboarding, auth, and messages pages */}
      {!hideHeader && <Header />}
      
      {/* Main content */}
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>
      
      {/* Footer - hidden on messages and auth pages */}
      {!hideFooter && <Footer />}
      
      {/* Bottom Navigation - hidden on onboarding, auth, and messages pages */}
      {!hideBottomNav && <BottomNav />}
    </AuthProvider>
  );
}