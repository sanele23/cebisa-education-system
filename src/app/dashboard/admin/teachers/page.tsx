import type { Metadata } from "next";
import { AdminTeachers } from "@/features/admin/AdminTeachers";

export const metadata: Metadata = { title: "Teachers" };

export default function AdminTeachersPage() {
  return <AdminTeachers />;
}
