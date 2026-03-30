import type { Metadata } from "next";
import { StudentGrades } from "@/features/student/StudentGrades";

export const metadata: Metadata = { title: "My Grades" };

export default function GradesPage() {
  return <StudentGrades />;
}
