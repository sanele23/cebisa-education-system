import type { Metadata } from "next";
import { ParentDashboard } from "@/features/parent/ParentDashboard";

export const metadata: Metadata = { title: "Parent Dashboard" };

export default function ParentDashboardPage() {
  return <ParentDashboard />;
}
