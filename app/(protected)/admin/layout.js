"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/70 z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'md:w-20'}
      `}>
        <AdminSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}