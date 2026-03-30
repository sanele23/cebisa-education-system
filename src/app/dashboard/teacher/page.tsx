import type { Metadata } from "next";
import { TeacherDashboard } from "@/features/teacher/TeacherDashboard";

export const metadata: Metadata = { title: "Teacher Dashboard" };

export default function TeacherDashboardPage() {
  return <TeacherDashboard />;
}
