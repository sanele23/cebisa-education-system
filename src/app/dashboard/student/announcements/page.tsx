import type { Metadata } from "next";
import { AnnouncementsView } from "@/features/shared/AnnouncementsView";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return <AnnouncementsView role="student" title="Announcements" />;
}
