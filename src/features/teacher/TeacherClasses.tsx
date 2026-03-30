"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { MOCK_CLASSES } from "@/lib/mockData";
import { useAuthStore } from "@/lib/store/authStore";

export function TeacherClasses() {
  const { user } = useAuthStore();
  const myClasses = MOCK_CLASSES.filter((c) => c.teacherId === user?.id);

  return (
    <DashboardShell title="My Classes" subtitle="View your assigned classes">
      <Card>
        <h2 className="text-lg font-semibold mb-4">My Classes</h2>
        <ul className="space-y-2">
          {myClasses.map((c) => (
            <li key={c.id} className="border rounded-lg p-3 flex flex-col">
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-slate-500">Grade: {c.grade}</span>
              <span className="text-xs text-slate-500">
                Students: {c.studentIds.length}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </DashboardShell>
  );
}
