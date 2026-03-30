"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MOCK_TEACHERS } from "@/lib/mockData";

export function AdminTeachers() {
  return (
    <DashboardShell title="Teachers" subtitle="Manage and view all teachers">
      <Card>
        <h2 className="text-lg font-semibold mb-4">All Teachers</h2>
        <ul className="space-y-2">
          {MOCK_TEACHERS.map((teacher) => (
            <li
              key={teacher.id}
              className="border rounded-lg p-3 flex flex-col"
            >
              <span className="font-semibold">{teacher.name}</span>
              <span className="text-xs text-slate-500">
                Email: {teacher.email}
              </span>
              <span className="text-xs text-slate-500">
                Subject: {teacher.subject}
              </span>
              <span className="text-xs text-slate-500">
                Classes: {teacher.classIds.length}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </DashboardShell>
  );
}
