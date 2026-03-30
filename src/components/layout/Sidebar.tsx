"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  Megaphone,
  CreditCard,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "@/lib/store/authStore";
import { useState, useEffect } from "react";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "Subjects & Grades",
      href: "/dashboard/student/grades",
      icon: BookOpen,
    },
    {
      label: "Assignments",
      href: "/dashboard/student/assignments",
      icon: ClipboardList,
    },
    {
      label: "Attendance",
      href: "/dashboard/student/attendance",
      icon: Calendar,
    },
    {
      label: "Announcements",
      href: "/dashboard/student/announcements",
      icon: Megaphone,
    },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    { label: "My Classes", href: "/dashboard/teacher/classes", icon: Users },
    { label: "Results", href: "/dashboard/teacher/results", icon: BarChart3 },
    {
      label: "Attendance",
      href: "/dashboard/teacher/attendance",
      icon: Calendar,
    },
    {
      label: "Announcements",
      href: "/dashboard/teacher/announcements",
      icon: Megaphone,
    },
  ],
  parent: [
    { label: "Dashboard", href: "/dashboard/parent", icon: LayoutDashboard },
    {
      label: "Child Performance",
      href: "/dashboard/parent/performance",
      icon: BarChart3,
    },
    {
      label: "Fees & Payments",
      href: "/dashboard/parent/fees",
      icon: CreditCard,
    },
    {
      label: "Announcements",
      href: "/dashboard/parent/announcements",
      icon: Megaphone,
    },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    {
      label: "Students",
      href: "/dashboard/admin/students",
      icon: GraduationCap,
    },
    { label: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  parent: "Parent Portal",
  admin: "Admin Portal",
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for custom event to open sidebar
  useEffect(() => {
    const openSidebar = () => setMobileOpen(true);
    window.addEventListener("open-sidebar-mobile", openSidebar);
    return () => window.removeEventListener("open-sidebar-mobile", openSidebar);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user) return null;
  const navItems = NAV_ITEMS[user.role];
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src="/cebisa-education-system/cebisa-logo.jpeg"
            alt="Cebisa Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">Cebisa</p>
            <p className="text-white/50 text-xs">{ROLE_LABELS[user.role]}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-2"
        aria-label="Main navigation"
      >
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">
                {user.name}
              </p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
            "text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </>
  );

  // Desktop sidebar
  return (
    <>
      {/* Mobile overlay sidebar */}
      <div
        className={clsx(
          "fixed inset-0 z-50 md:hidden transition-all duration-300",
          mobileOpen ? "block" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={clsx(
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Sidebar panel */}
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-64 bg-brand-navy flex flex-col z-50 shadow-xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebarContent}
        </aside>
      </div>
      {/* Desktop sidebar */}
      <aside
        className={clsx(
          "hidden md:flex fixed left-0 top-0 h-full bg-brand-navy flex-col transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>
      {/* Hamburger button for mobile (to be placed in Navbar) */}
      {/* See Navbar for trigger */}
    </>
  );
}
