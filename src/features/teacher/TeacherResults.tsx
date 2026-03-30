"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { MOCK_CLASSES, MOCK_RESULTS } from "@/lib/mockData";
import { useAuthStore } from "@/lib/store/authStore";

export function TeacherResults() {
  const { user } = useAuthStore();
  const myClasses = MOCK_CLASSES.filter((c) => c.teacherId === user?.id);
  const results = myClasses.flatMap((c) =>
    (MOCK_RESULTS[c.id] || []).map((result) => ({
      ...result,
      className: c.name,
    })),
  );

  return (
    <DashboardShell title="Results" subtitle="View and manage student results">
      <Card>
        <h2 className="text-lg font-semibold mb-4">Results</h2>
        <Table
          columns={[
            { key: "className", header: "Class" },
            { key: "subject", header: "Subject" },
            { key: "score", header: "Score" },
            { key: "grade", header: "Grade" },
            { key: "term", header: "Term" },
          ]}
          data={results}
        />
      </Card>
    </DashboardShell>
  );
}
