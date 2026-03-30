"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  GraduationCap,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { usePaymentsStore } from "@/lib/store/paymentsStore";
import { MOCK_STUDENTS } from "@/lib/mockData";
import type { PaymentStatus } from "@/types";

type FilterStatus = "all" | PaymentStatus;

const STATUS_CONFIG = {
  paid: { label: "Paid", variant: "success" as const, color: "#10b981" },
  pending: { label: "Pending", variant: "warning" as const, color: "#f59e0b" },
  overdue: { label: "Overdue", variant: "danger" as const, color: "#ef4444" },
};

export function AdminDashboard() {
  const { payments } = usePaymentsStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const totalCollected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.studentName.toLowerCase().includes(q) ||
        p.parentName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [payments, search, statusFilter]);

  // Chart data: payments per term
  const termData = useMemo(() => {
    const grouped: Record<string, { term: string; collected: number; pending: number }> = {};
    payments.forEach((p) => {
      if (!grouped[p.term]) grouped[p.term] = { term: p.term, collected: 0, pending: 0 };
      if (p.status === "paid") grouped[p.term].collected += p.amount;
      else grouped[p.term].pending += p.amount;
    });
    return Object.values(grouped);
  }, [payments]);

  // Pie chart data
  const pieData = [
    { name: "Paid", value: payments.filter((p) => p.status === "paid").length, color: "#10b981" },
    { name: "Pending", value: payments.filter((p) => p.status === "pending").length, color: "#f59e0b" },
    { name: "Overdue", value: payments.filter((p) => p.status === "overdue").length, color: "#ef4444" },
  ];

  return (
    <DashboardShell
      title="Finance Overview"
      subtitle="School payment tracking and financial summary"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Collected"
          value={`R${totalCollected.toLocaleString()}`}
          icon={CreditCard}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Pending"
          value={`R${totalPending.toLocaleString()}`}
          icon={Clock}
          iconColor="text-amber-600"
        />
        <StatCard
          label="Overdue"
          value={`R${totalOverdue.toLocaleString()}`}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <StatCard
          label="Students"
          value={MOCK_STUDENTS.length}
          icon={GraduationCap}
          iconColor="text-blue-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar chart — Term collections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Collections by Term</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={termData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="term" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(v: number) => [`R${v.toLocaleString()}`, ""]}
              />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [v, "Records"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Payments Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-800">All Payments</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredPayments.length} of {payments.length} records
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-36"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                {(["all", "paid", "pending", "overdue"] as FilterStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === s
                        ? "bg-white shadow-sm text-slate-800"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50">
              <tr>
                {["Student", "Parent", "Description", "Term", "Amount", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                    No payments match your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const cfg = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {p.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          {p.studentName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users size={13} className="text-slate-400" />
                          {p.parentName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{p.term}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">
                        R{p.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={cfg.variant}>
                          {p.status === "paid" && <CheckCircle2 size={11} className="mr-1" />}
                          {p.status === "pending" && <Clock size={11} className="mr-1" />}
                          {p.status === "overdue" && <AlertTriangle size={11} className="mr-1" />}
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{p.date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-6">
          <div className="text-xs text-slate-500">
            Total Collected: <span className="font-bold text-emerald-700">R{totalCollected.toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-500">
            Pending: <span className="font-bold text-amber-700">R{totalPending.toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-500">
            Overdue: <span className="font-bold text-red-700">R{totalOverdue.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}
