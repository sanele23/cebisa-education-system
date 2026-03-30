"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
//

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  const { user } = useAuthStore();

  // Hamburger click: dispatch custom event
  const handleHamburgerClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-sidebar-mobile"));
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 px-2 sm:px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
          onClick={handleHamburgerClick}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-800">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search placeholder */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-400 text-sm w-32 md:w-48">
          <Search size={15} />
          <span>Search…</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-brand-gold rounded-full" />
        </button>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
