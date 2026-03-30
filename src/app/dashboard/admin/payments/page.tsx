import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/AdminDashboard";

export const metadata: Metadata = { title: "Payments" };

// Payments is the same view as admin dashboard (primary focus)
export default function AdminPaymentsPage() {
  return <AdminDashboard />;
}
