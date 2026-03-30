"use client";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({
  children,
  title,
  subtitle,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar overlays on mobile, static on md+ */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 md:ml-64">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
