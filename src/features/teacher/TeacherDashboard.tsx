"use client";

import { useState } from "react";
import { Users, BarChart3, CheckCircle2, XCircle, AlertCircle, Edit3 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store/authStore";
import {
  MOCK_CLASSES,
  MOCK_STUDENTS,
  MOCK_RESULTS,
  MOCK_ATTENDANCE,
  MOCK_ANNOUNCEMENTS,
} from "@/lib/mockData";

interface StudentRow {
  id: string;
  name: string;
  grade: string;
  average: number;
  attendance: number;
  [key: string]: unknown;
}

export function TeacherDashboard() {
  const { user } = useAuthStore();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [newScore, setNewScore] = useState("");

  const teacher = user;

  const myClasses = MOCK_CLASSES.filter((c) => c.teacherId === teacher?.id);
  const allStudentIds = myClasses.flatMap((c) => c.studentIds);
  const myStudents = MOCK_STUDENTS.filter((s) => allStudentIds.includes(s.id));

  const studentRows: StudentRow[] = myStudents.map((s) => {
    const results = MOCK_RESULTS[s.id] ?? [];
    const avg = results.length
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;
    const att = MOCK_ATTENDANCE[s.id] ?? [];
    const present = att.filter((a) => a.status === "present").length;
    const attPct = att.length ? Math.round((present / att.length) * 100) : 0;
    return { id: s.id, name: s.name, grade: s.grade, average: avg, attendance: attPct };
  });

  const announcements = MOCK_ANNOUNCEMENTS.filter((a) => a.targetRoles.includes("teacher")).slice(0, 3);

  const tableColumns = [
    { key: "name", header: "Student" },
    { key: "grade", header: "Grade" },
    {
      key: "average",
      header: "Average",
      render: (row: StudentRow) => (
        <span
          className={
            row.average >= 75
              ? "text-emerald-600 font-semibold"
              : row.average >= 50
              ? "text-amber-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {row.average}%
        </span>
      ),
    },
    {
      key: "attendance",
      header: "Attendance",
      render: (row: StudentRow) => (
        <div className="flex items-center gap-1.5">
          {row.attendance >= 80 ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : row.attendance >= 60 ? (
            <AlertCircle size={14} className="text-amber-500" />
          ) : (
            <XCircle size={14} className="text-red-500" />
          )}
          <span>{row.attendance}%</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: StudentRow) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedStudent(row);
            setResultModalOpen(true);
          }}
        >
          <Edit3 size={14} /> Update Result
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell
      title={`Good morning, ${teacher?.name?.split(" ").slice(-1)[0]} 👩‍🏫`}
      subtitle="Your class overview for this week"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="My Classes" value={myClasses.length} icon={Users} iconColor="text-brand-teal" />
        <StatCard label="My Students" value={myStudents.length} icon={BarChart3} iconColor="text-blue-600" />
        <StatCard
          label="Class Average"
          value={`${Math.round(studentRows.reduce((s, r) => s + r.average, 0) / (studentRows.length || 1))}%`}
          icon={BarChart3}
          iconColor="text-purple-600"
        />
        <StatCard
          label="Avg Attendance"
          value={`${Math.round(studentRows.reduce((s, r) => s + r.attendance, 0) / (studentRows.length || 1))}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
      </div>

      {/* Classes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {myClasses.map((cls) => (
          <Card key={cls.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">Class {cls.name}</p>
                <p className="text-sm text-slate-500">{cls.grade}</p>
                <p className="text-xs text-slate-400 mt-1">{cls.studentIds.length} students enrolled</p>
              </div>
              <Badge variant="info">{cls.grade}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Student Performance Table */}
      <Card padding="none" className="mb-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Student Performance Overview</h3>
        </div>
        <Table
          columns={tableColumns as Parameters<typeof Table>[0]["columns"]}
          data={studentRows}
          emptyMessage="No students in your classes yet."
        />
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>School Announcements</CardTitle>
        </CardHeader>
        <ul className="flex flex-col gap-3">
          {announcements.map((ann) => (
            <li key={ann.id} className="flex items-start justify-between gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{ann.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ann.body}</p>
                <p className="text-xs text-slate-400 mt-1">{ann.date}</p>
              </div>
              <Badge variant={ann.priority === "urgent" ? "danger" : ann.priority === "important" ? "warning" : "neutral"}>
                {ann.priority}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>

      {/* Update Result Modal */}
      <Modal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={`Update Result — ${selectedStudent?.name}`}
      >
        {selectedStudent && (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
              Current average: <strong>{selectedStudent.average}%</strong>
            </div>
            <Input
              label="New Score (%)"
              type="number"
              min="0"
              max="100"
              placeholder="Enter score (0–100)"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              hint="This will be saved as the updated term result."
            />
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setResultModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In production: dispatch to API / store
                  setResultModalOpen(false);
                  setNewScore("");
                }}
              >
                Save Result
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
