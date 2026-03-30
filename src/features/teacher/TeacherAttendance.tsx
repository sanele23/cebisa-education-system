"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { MOCK_CLASSES, MOCK_ATTENDANCE } from "@/lib/mockData";
import { useAuthStore } from "@/lib/store/authStore";

export function TeacherAttendance() {
  const { user } = useAuthStore();
  const myClasses = MOCK_CLASSES.filter((c) => c.teacherId === user?.id);
  const attendanceRecords = myClasses.flatMap((c) =>
    (MOCK_ATTENDANCE[c.id] || []).map((record) => ({
      ...record,
      className: c.name,
    })),
  );

  return (
    <DashboardShell
      title="Attendance"
      subtitle="View and manage class attendance"
    >
      <Card>
        <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
        <Table
          columns={[
            { key: "className", header: "Class" },
            { key: "date", header: "Date" },
            { key: "status", header: "Status" },
          ]}
          data={attendanceRecords}
        />
      </Card>
    </DashboardShell>
  );
}
