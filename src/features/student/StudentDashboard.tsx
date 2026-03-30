"use client";

import { useMemo } from "react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store/authStore";
import {
  MOCK_RESULTS,
  MOCK_PERFORMANCE,
  MOCK_ATTENDANCE,
  MOCK_ASSIGNMENTS,
  MOCK_ANNOUNCEMENTS,
} from "@/lib/mockData";

function gradeColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 65) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function StudentDashboard() {
  const { user } = useAuthStore();

  const results = useMemo(() => MOCK_RESULTS[user?.id ?? ""] ?? [], [user?.id]);
  const performance = useMemo(() => MOCK_PERFORMANCE[user?.id ?? ""] ?? [], [user?.id]);
  const attendance = useMemo(() => MOCK_ATTENDANCE[user?.id ?? ""] ?? [], [user?.id]);
  const assignments = useMemo(() => MOCK_ASSIGNMENTS[user?.id ?? ""] ?? [], [user?.id]);

  const avgScore = useMemo(() => {
    if (!results.length) return 0;
    return Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  }, [results]);

  const attendanceSummary = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    return { total, present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 };
  }, [attendance]);

  const pendingAssignments = assignments.filter((a) => a.status === "pending").length;

  const announcements = MOCK_ANNOUNCEMENTS.filter((a) => a.targetRoles.includes("student")).slice(0, 3);

  return (
    <DashboardShell
      title={`Welcome, ${user?.name?.split(" ")[0]} 👋`}
      subtitle="Here's your academic overview for Term 1, 2025"
    >
      {/* Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={Award}
          iconColor="text-brand-teal"
          trend={{ value: 3, label: "vs last term" }}
        />
        <StatCard
          label="Attendance"
          value={`${attendanceSummary.percentage}%`}
          subValue={`${attendanceSummary.present}/${attendanceSummary.total} days`}
          icon={Calendar}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Subjects"
          value={results.length}
          icon={BookOpen}
          iconColor="text-purple-600"
        />
        <StatCard
          label="Pending Tasks"
          value={pendingAssignments}
          icon={ClipboardList}
          iconColor={pendingAssignments > 0 ? "text-amber-600" : "text-emerald-600"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <TrendingUp size={14} />
              Improving
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performance} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="term" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v: number) => [`${v}%`, "Average"]}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="url(#lineGrad)"
                strokeWidth={2.5}
                dot={{ fill: "#0d9488", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <ul className="flex flex-col gap-3">
            {announcements.map((ann) => (
              <li key={ann.id} className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700 leading-snug">{ann.title}</p>
                  <Badge
                    variant={
                      ann.priority === "urgent" ? "danger" : ann.priority === "important" ? "warning" : "neutral"
                    }
                  >
                    {ann.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{ann.date}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Results — Term 1</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={results} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v: number) => [`${v}%`, "Score"]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {results.map((r) => (
                  <Cell key={r.subject} fill={gradeColor(r.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <Badge variant="info">{pendingAssignments} pending</Badge>
          </CardHeader>
          <ul className="flex flex-col gap-3">
            {assignments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.subject} · Due {a.dueDate}</p>
                </div>
                <Badge
                  variant={
                    a.status === "graded" ? "success" : a.status === "submitted" ? "info" : "warning"
                  }
                >
                  {a.status}
                  {a.status === "graded" && a.score != null ? ` · ${a.score}%` : ""}
                </Badge>
              </li>
            ))}
            {assignments.length === 0 && (
              <li className="text-sm text-slate-400 py-4 text-center">No assignments yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
