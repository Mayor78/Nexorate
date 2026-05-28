'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './layout/BottomNav';
import Sidebar from './layout/Sidebar';
import { AuthProvider } from '../context/AuthContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Pages where navigation should be hidden
  const hideNavigation = pathname === '/onboarding' || pathname?.startsWith('/auth');
  
  return (
    <AuthProvider>
      {!hideNavigation && (
        <>
          <Sidebar />
          <BottomNav />
        </>
      )}
      
      <div className={!hideNavigation ? "md:flex md:min-h-screen" : ""}>
        {!hideNavigation && <div className="hidden md:block md:w-64 md:flex-shrink-0" />}
        <div className="flex-1">
          <div className={!hideNavigation ? "max-w-7xl mx-auto" : ""}>
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}