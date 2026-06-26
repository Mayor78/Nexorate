"use client";

import { Menu, Bell, User, LogOut, Settings as SettingsIcon, X, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminHeader({ sidebarOpen, setSidebarOpen, isMobile }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dark, setDark] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-[#eef3f7] px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-3">
        {/* Left - Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/60 block md:hidden transition-colors"
        >
          {sidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile title */}
        <div className="md:hidden">
          <h1 className="text-base font-semibold text-slate-800">Admin Panel</h1>
        </div>

        {/* Right - Search, theme, notifications, profile */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="w-56 md:w-72 bg-white border border-slate-200 rounded-full pl-5 pr-12 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-300 shadow-sm"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="relative w-14 h-7 rounded-full bg-gradient-to-r from-sky-400 to-slate-700 flex items-center px-1 shadow-sm shrink-0"
            aria-label="Toggle theme"
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                dark ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>

          {/* Notifications */}
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors relative shrink-0">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden md:block">
                {user?.displayName || 'Admin'}
              </span>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <User size={16} />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                    >
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
