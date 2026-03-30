import type { Metadata } from "next";
import { ParentPerformance } from "@/features/parent/ParentPerformance";

export const metadata: Metadata = { title: "Child Performance" };

export default function ParentPerformancePage() {
  return <ParentPerformance />;
}
