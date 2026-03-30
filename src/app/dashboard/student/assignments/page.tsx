import type { Metadata } from "next";
import { StudentAssignments } from "@/features/student/StudentAssignments";

export const metadata: Metadata = { title: "Assignments" };

export default function AssignmentsPage() {
  return <StudentAssignments />;
}
