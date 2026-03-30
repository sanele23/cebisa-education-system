import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = "text-brand-teal",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-100 shadow-card p-3 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-0">
        <div>
          <p className="text-xs sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-800">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-slate-500 mt-0.5">{subValue}</p>
          )}
          {trend && (
            <p
              className={clsx(
                "text-xs font-medium mt-1.5",
                trend.value >= 0 ? "text-emerald-600" : "text-red-500",
              )}
            >
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%{" "}
              {trend.label}
            </p>
          )}
        </div>
        <div className={clsx("p-2 rounded-xl sm:p-2.5 bg-slate-50", iconColor)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
