import type { Metadata } from "next";
import { ParentFees } from "@/features/parent/ParentFees";

export const metadata: Metadata = { title: "Fees & Payments" };

export default function ParentFeesPage() {
  return <ParentFees />;
}
