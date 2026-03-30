import type { Metadata } from "next";
import { AnnouncementsView } from "@/features/shared/AnnouncementsView";

export const metadata: Metadata = { title: "Announcements" };

export default function ParentAnnouncementsPage() {
  return <AnnouncementsView role="parent" title="School Announcements" />;
}
