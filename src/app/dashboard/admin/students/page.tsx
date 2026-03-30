import type { Metadata } from "next";
import { AdminStudents } from "@/features/admin/AdminStudents";

export const metadata: Metadata = { title: "Students" };

export default function AdminStudentsPage() {
  return <AdminStudents />;
}
