import type { Metadata } from "next";
import { StudentAttendance } from "@/features/student/StudentAttendance";

export const metadata: Metadata = { title: "My Attendance" };

export default function AttendancePage() {
  return <StudentAttendance />;
}
