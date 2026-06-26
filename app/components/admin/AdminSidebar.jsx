"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Flag,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  X
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Listings", icon: Package, href: "/admin/listings" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Reports", icon: Flag, href: "/admin/reports" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({ isOpen, setIsOpen, isMobile }) {
  const pathname = usePathname();

  return (
    <div
      className="h-full flex flex-col text-slate-100 shadow-2xl rounded-r-3xl"
      style={{ background: "linear-gradient(180deg, #2f4858 0%, #28404f 100%)" }}
    >
      {/* Logo Area */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${!isOpen && !isMobile ? 'justify-center w-full' : ''}`}>
          <Store className="h-8 w-8 text-slate-100 hidden md:flex" />
          {isOpen && (
            <span className="font-bold text-xl whitespace-nowrap">Nexorate Panel</span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors md:block hidden"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        {isMobile && isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${isActive
                  ? 'bg-slate-100 text-slate-800 font-semibold shadow-md'
                  : 'text-slate-200/80 hover:bg-white/10 hover:text-white'
                }
                ${!isOpen && !isMobile ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-white/10 text-xs text-slate-300/70">
          <p> Admin</p>
          <p>Version 1.0.0</p>
        </div>
      )}
    </div>
  );
}
