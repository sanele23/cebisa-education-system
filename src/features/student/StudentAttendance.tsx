"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store/authStore";
import { MOCK_ATTENDANCE } from "@/lib/mockData";

const STATUS_ICONS = {
  present: { icon: CheckCircle2, color: "text-emerald-600", badge: "success" as const },
  absent: { icon: XCircle, color: "text-red-600", badge: "danger" as const },
  late: { icon: AlertCircle, color: "text-amber-600", badge: "warning" as const },
};

export function StudentAttendance() {
  const { user } = useAuthStore();
  const records = useMemo(() => MOCK_ATTENDANCE[user?.id ?? ""] ?? [], [user?.id]);

  const summary = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    return { total, present, absent, late, pct: total ? Math.round((present / total) * 100) : 0 };
  }, [records]);

  return (
    <DashboardShell title="Attendance" subtitle="Your attendance record for Term 1, 2025">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Days", value: summary.total, color: "text-slate-800" },
          { label: "Present", value: summary.present, color: "text-emerald-600" },
          { label: "Absent", value: summary.absent, color: "text-red-600" },
          { label: "Late", value: summary.late, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance rate card */}
        <Card className="flex flex-col items-center justify-center py-8">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={summary.pct >= 80 ? "#10b981" : summary.pct >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${summary.pct} ${100 - summary.pct}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{summary.pct}%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700">Attendance Rate</p>
          <p className="text-xs text-slate-500 mt-1">
            {summary.pct >= 90 ? "Excellent!" : summary.pct >= 75 ? "Good" : "Needs improvement"}
          </p>
        </Card>

        {/* Daily Records */}
        <Card padding="none" className="lg:col-span-2">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Daily Records</h3>
          </div>
          <ul className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {records.map((r) => {
              const cfg = STATUS_ICONS[r.status];
              const Icon = cfg.icon;
              return (
                <li key={r.date} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={cfg.color} />
                    <p className="text-sm text-slate-700">
                      {new Date(r.date).toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge variant={cfg.badge}>{r.status}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
