"use client";

import { Menu, Bell, User, LogOut, Settings as SettingsIcon, X } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({ sidebarOpen, setSidebarOpen, isMobile }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 block md:hidden transition-colors"
        >
          {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Center - Mobile title */}
        <div className="md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden md:block">Admin User</span>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <User size={16} />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}