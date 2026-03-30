"use client";

import { Megaphone } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mockData";
import type { UserRole } from "@/types";

interface AnnouncementsViewProps {
  role: UserRole;
  title?: string;
}

export function AnnouncementsView({ role, title = "Announcements" }: AnnouncementsViewProps) {
  const items = MOCK_ANNOUNCEMENTS.filter((a) => a.targetRoles.includes(role));

  return (
    <DashboardShell title={title} subtitle="Stay up to date with school news">
      {items.length === 0 ? (
        <Card className="flex flex-col items-center py-20 text-slate-400">
          <Megaphone size={40} className="mb-3 opacity-40" />
          <p className="text-sm">No announcements at the moment.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((ann) => (
            <Card key={ann.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-slate-800">{ann.title}</h3>
                <Badge
                  variant={
                    ann.priority === "urgent" ? "danger" : ann.priority === "important" ? "warning" : "neutral"
                  }
                >
                  {ann.priority}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{ann.body}</p>
              <p className="text-xs text-slate-400 mt-3">{ann.date}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
