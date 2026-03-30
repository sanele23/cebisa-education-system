"use client";

import { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store/authStore";
import { MOCK_RESULTS } from "@/lib/mockData";

function scoreVariant(score: number) {
  if (score >= 80) return "success" as const;
  if (score >= 65) return "info" as const;
  if (score >= 50) return "warning" as const;
  return "danger" as const;
}

function barColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function StudentGrades() {
  const { user } = useAuthStore();
  const results = useMemo(() => MOCK_RESULTS[user?.id ?? ""] ?? [], [user?.id]);

  const average = useMemo(
    () => (results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0),
    [results]
  );

  const highest = useMemo(() => results.reduce((h, r) => (r.score > h.score ? r : h), results[0]), [results]);
  const lowest = useMemo(() => results.reduce((l, r) => (r.score < l.score ? r : l), results[0]), [results]);

  return (
    <DashboardShell title="Subjects & Grades" subtitle="Term 1, 2025">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-2xl font-bold text-slate-800">{average}%</p>
          <p className="text-xs text-slate-500 mt-1">Class Average</p>
        </Card>
        {highest && (
          <Card className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{highest.score}%</p>
            <p className="text-xs text-slate-500 mt-1">Highest · {highest.subject}</p>
          </Card>
        )}
        {lowest && (
          <Card className="text-center">
            <p className="text-2xl font-bold text-amber-600">{lowest.score}%</p>
            <p className="text-xs text-slate-500 mt-1">Needs work · {lowest.subject}</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Score Comparison</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={results} margin={{ top: 4, right: 4, bottom: 20, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v: number) => [`${v}%`, "Score"]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {results.map((r) => (
                  <Cell key={r.subject} fill={barColor(r.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Results list */}
        <Card padding="none">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">All Subjects</h3>
          </div>
          <ul className="divide-y divide-slate-50">
            {results.map((r) => (
              <li key={r.subject} className="flex items-center gap-4 px-5 py-3.5">
                <div
                  className="w-2 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: barColor(r.score) }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{r.subject}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 w-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${r.score}%`, backgroundColor: barColor(r.score) }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{r.score}%</p>
                  <Badge variant={scoreVariant(r.score)}>{r.grade}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
