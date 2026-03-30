"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store/authStore";
import {
  MOCK_STUDENTS,
  MOCK_RESULTS,
  MOCK_PERFORMANCE,
  MOCK_ATTENDANCE,
} from "@/lib/mockData";

function barColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ParentPerformance() {
  const { user } = useAuthStore();
  const children = MOCK_STUDENTS.filter((s) => s.parentId === user?.id);
  const [activeChildId, setActiveChildId] = useState(children[0]?.id ?? "");

  const child = children.find((c) => c.id === activeChildId);
  const results = useMemo(() => MOCK_RESULTS[activeChildId] ?? [], [activeChildId]);
  const performance = useMemo(() => MOCK_PERFORMANCE[activeChildId] ?? [], [activeChildId]);
  const attendance = useMemo(() => MOCK_ATTENDANCE[activeChildId] ?? [], [activeChildId]);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attPct = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <DashboardShell title="Child Performance" subtitle="Detailed academic overview for your children">
      {/* Child selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChildId(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeChildId === c.id
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {child && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <p className="text-2xl font-bold text-brand-teal">{avg}%</p>
              <p className="text-xs text-slate-500 mt-1">Term Average</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-blue-600">{attPct}%</p>
              <p className="text-xs text-slate-500 mt-1">Attendance</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-purple-600">{results.length}</p>
              <p className="text-xs text-slate-500 mt-1">Subjects</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {performance.at(-1)?.average ?? avg}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Latest Term</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performance} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="term" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Average"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <defs>
                    <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0d9488" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <Line type="monotone" dataKey="average" stroke="url(#lg2)" strokeWidth={2.5} dot={{ fill: "#0d9488", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Subject Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Scores</CardTitle>
              </CardHeader>
              <ul className="space-y-2.5">
                {results.map((r) => (
                  <li key={r.subject} className="flex items-center gap-3">
                    <p className="text-xs text-slate-600 w-28 truncate">{r.subject}</p>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.score}%`, backgroundColor: barColor(r.score) }}
                      />
                    </div>
                    <Badge variant={r.score >= 80 ? "success" : r.score >= 65 ? "info" : r.score >= 50 ? "warning" : "danger"}>
                      {r.grade}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
