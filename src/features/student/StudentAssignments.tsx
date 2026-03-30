"use client";

import { useMemo } from "react";
import { ClipboardList, Clock } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store/authStore";
import { MOCK_ASSIGNMENTS } from "@/lib/mockData";

export function StudentAssignments() {
  const { user } = useAuthStore();
  const assignments = useMemo(() => MOCK_ASSIGNMENTS[user?.id ?? ""] ?? [], [user?.id]);

  const pending = assignments.filter((a) => a.status === "pending");
  const submitted = assignments.filter((a) => a.status === "submitted");
  const graded = assignments.filter((a) => a.status === "graded");

  return (
    <DashboardShell title="Assignments" subtitle="Track your tasks and deadlines">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">{submitted.length}</p>
          <p className="text-xs text-slate-500 mt-1">Submitted</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{graded.length}</p>
          <p className="text-xs text-slate-500 mt-1">Graded</p>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">All Assignments</h3>
        </div>
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <ClipboardList size={40} className="mb-3 opacity-40" />
            <p className="text-sm">No assignments yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {assignments.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-4">
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
                  <ClipboardList size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.subject}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={13} />
                  Due {a.dueDate}
                </div>
                <Badge
                  variant={a.status === "graded" ? "success" : a.status === "submitted" ? "info" : "warning"}
                >
                  {a.status}
                  {a.status === "graded" && a.score != null ? ` · ${a.score}/${a.maxScore}` : ""}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardShell>
  );
}
