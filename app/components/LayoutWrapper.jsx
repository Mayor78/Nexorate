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
      {!hideNavigation && (
        <>
          {/* <Header /> */}
          <BottomNav />
        </>
      )}
      
      {/* Main content area - Sidebar already provides the spacer */}
      <div className={!hideNavigation ? "md:pl-0" : ""}>
        <div className="flex-1">
          <div className={!hideNavigation ? "max-w-7xl mx-auto" : ""}>
            {children}
          </div>
        </div>
        {/* {!hideFooter && <Footer />} */}
      </div>
    </AuthProvider>
  );
}