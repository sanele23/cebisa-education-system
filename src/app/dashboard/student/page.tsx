import type { Metadata } from "next";
import { StudentDashboard } from "@/features/student/StudentDashboard";

export const metadata: Metadata = { title: "Student Dashboard" };

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
