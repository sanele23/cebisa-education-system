import type { Metadata } from "next";
import { AnnouncementsView } from "@/features/shared/AnnouncementsView";

export const metadata: Metadata = { title: "Announcements" };

export default function TeacherAnnouncementsPage() {
  return <AnnouncementsView role="teacher" title="School Announcements" />;
}
