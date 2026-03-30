"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MOCK_STUDENTS, MOCK_RESULTS, MOCK_ATTENDANCE } from "@/lib/mockData";

export function AdminStudents() {
  return (
    <DashboardShell title="Students" subtitle="All enrolled students">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STUDENTS.map((student) => {
          const results = MOCK_RESULTS[student.id] ?? [];
          const avg = results.length
            ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
            : 0;
          const att = MOCK_ATTENDANCE[student.id] ?? [];
          const present = att.filter((a) => a.status === "present").length;
          const attPct = att.length ? Math.round((present / att.length) * 100) : 0;

          return (
            <Card key={student.id} hoverable>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.grade} · {student.id}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="font-bold text-slate-800">{avg}%</p>
                  <p className="text-xs text-slate-400">Average</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{attPct}%</p>
                  <p className="text-xs text-slate-400">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{results.length}</p>
                  <p className="text-xs text-slate-400">Subjects</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
