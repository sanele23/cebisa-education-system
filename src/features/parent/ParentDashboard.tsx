"use client";

import { useState, useMemo } from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/store/authStore";
import { usePaymentsStore } from "@/lib/store/paymentsStore";
import {
  MOCK_STUDENTS,
  MOCK_RESULTS,
  MOCK_ATTENDANCE,
  MOCK_PERFORMANCE,
  MOCK_FEES,
  MOCK_ANNOUNCEMENTS,
} from "@/lib/mockData";

const PAYMENT_STATUS_CONFIG = {
  paid: { label: "Paid", variant: "success" as const, icon: CheckCircle2, iconColor: "text-emerald-600" },
  pending: { label: "Pending", variant: "warning" as const, icon: Clock, iconColor: "text-amber-600" },
  overdue: { label: "Overdue", variant: "danger" as const, icon: AlertTriangle, iconColor: "text-red-600" },
};

export function ParentDashboard() {
  const { user } = useAuthStore();
  const { payments, markAsPaid } = usePaymentsStore();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const children = MOCK_STUDENTS.filter((s) => s.parentId === user?.id);
  const myPayments = payments.filter((p) => p.parentId === user?.id);

  // Total fees across all children
  const feesTotal = useMemo(() => {
    return children.reduce(
      (acc, child) => {
        const f = MOCK_FEES[child.id] ?? { totalFees: 0, amountPaid: 0, outstanding: 0 };
        return {
          totalFees: acc.totalFees + f.totalFees,
          amountPaid: acc.amountPaid + f.amountPaid,
          outstanding: acc.outstanding + f.outstanding,
        };
      },
      { totalFees: 0, amountPaid: 0, outstanding: 0 }
    );
  }, [children]);

  const pendingPayments = myPayments.filter((p) => p.status !== "paid");

  const handleMarkAsPaid = async () => {
    if (!selectedPaymentId) return;
    setMarking(true);
    await new Promise((r) => setTimeout(r, 800));
    markAsPaid(selectedPaymentId);
    setMarking(false);
    setSuccessMsg("Payment marked as paid successfully!");
    setTimeout(() => {
      setPaymentModalOpen(false);
      setSuccessMsg("");
      setSelectedPaymentId(null);
    }, 1800);
  };

  const selectedPayment = myPayments.find((p) => p.id === selectedPaymentId);
  const announcements = MOCK_ANNOUNCEMENTS.filter((a) => a.targetRoles.includes("parent"));

  return (
    <DashboardShell
      title={`Hello, ${user?.name?.split(" ").slice(-1)[0]} 👋`}
      subtitle="Monitor your child's progress and manage school fees"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Children"
          value={children.length}
          icon={Users}
          iconColor="text-brand-teal"
        />
        <StatCard
          label="Total Fees"
          value={`R${feesTotal.totalFees.toLocaleString()}`}
          icon={CreditCard}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Outstanding"
          value={`R${feesTotal.outstanding.toLocaleString()}`}
          subValue={feesTotal.outstanding > 0 ? "Payment required" : "All clear!"}
          icon={AlertTriangle}
          iconColor={feesTotal.outstanding > 0 ? "text-red-500" : "text-emerald-600"}
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments.length}
          icon={Clock}
          iconColor={pendingPayments.length > 0 ? "text-amber-600" : "text-emerald-600"}
        />
      </div>

      {/* Children Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {children.map((child) => {
          const results = MOCK_RESULTS[child.id] ?? [];
          const performance = MOCK_PERFORMANCE[child.id] ?? [];
          const attendance = MOCK_ATTENDANCE[child.id] ?? [];
          const presentCount = attendance.filter((a) => a.status === "present").length;
          const attPct = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
          const avg = results.length
            ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
            : 0;
          const fees = MOCK_FEES[child.id] ?? { totalFees: 0, amountPaid: 0, outstanding: 0 };
          const paidPct = fees.totalFees ? Math.round((fees.amountPaid / fees.totalFees) * 100) : 0;

          const radialData = [{ name: "Paid", value: paidPct, fill: "#0d9488" }];

          return (
            <Card key={child.id} className="overflow-hidden">
              {/* Child Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {child.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{child.name}</p>
                  <p className="text-xs text-slate-500">{child.grade} · ID: {child.id}</p>
                </div>
                <Badge variant={avg >= 70 ? "success" : avg >= 50 ? "warning" : "danger"} className="ml-auto">
                  Avg {avg}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Performance mini chart */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Term Progress</p>
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={performance} margin={{ top: 2, right: 2, bottom: 0, left: -32 }}>
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#0d9488"
                        strokeWidth={2}
                        dot={false}
                      />
                      <XAxis dataKey="term" hide />
                      <YAxis domain={[30, 100]} hide />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                        formatter={(v: number) => [`${v}%`, "Avg"]}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Fees Radial */}
                <div className="flex flex-col items-center">
                  <p className="text-xs font-medium text-slate-500 mb-1">Fees Paid</p>
                  <ResponsiveContainer width="100%" height={80}>
                    <RadialBarChart
                      innerRadius="60%"
                      outerRadius="90%"
                      data={radialData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} cornerRadius={4} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <p className="text-sm font-bold text-slate-800 -mt-10">{paidPct}%</p>
                </div>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center text-blue-500 mb-1">
                    <Calendar size={14} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{attPct}%</p>
                  <p className="text-xs text-slate-400">Attend.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center text-purple-500 mb-1">
                    <BookOpen size={14} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{results.length}</p>
                  <p className="text-xs text-slate-400">Subjects</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center text-emerald-500 mb-1">
                    <TrendingUp size={14} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{performance.at(-1)?.average ?? avg}%</p>
                  <p className="text-xs text-slate-400">Latest</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fees & Payments */}
      <Card padding="none" className="mb-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Payment History</h3>
            <p className="text-xs text-slate-500 mt-0.5">All fee records for your children</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-500">Outstanding</p>
              <p className="text-sm font-bold text-red-600">R{feesTotal.outstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {myPayments.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No payment records found.</div>
          ) : (
            myPayments.map((payment) => {
              const cfg = PAYMENT_STATUS_CONFIG[payment.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={payment.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className={`p-2.5 rounded-xl bg-slate-50 ${cfg.iconColor}`}>
                    <Receipt size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{payment.description}</p>
                    <p className="text-xs text-slate-400">{payment.studentName} · {payment.term}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">R{payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={cfg.variant}>
                      <StatusIcon size={11} className="mr-1" />
                      {cfg.label}
                    </Badge>
                    {payment.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => {
                          setSelectedPaymentId(payment.id);
                          setPaymentModalOpen(true);
                        }}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Announcements for Parent */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <Badge variant="info">{announcements.length}</Badge>
        </CardHeader>
        <ul className="flex flex-col gap-3">
          {announcements.map((ann) => (
            <li key={ann.id} className="flex items-start justify-between gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{ann.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{ann.body}</p>
                <p className="text-xs text-slate-400 mt-1">{ann.date}</p>
              </div>
              <Badge variant={ann.priority === "urgent" ? "danger" : ann.priority === "important" ? "warning" : "neutral"}>
                {ann.priority}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>

      {/* Mark as Paid Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => {
          if (marking) return;
          setPaymentModalOpen(false);
          setSuccessMsg("");
          setSelectedPaymentId(null);
        }}
        title="Confirm Payment"
        size="sm"
      >
        {successMsg ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 text-center">{successMsg}</p>
          </div>
        ) : selectedPayment ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Student</span>
                <span className="font-medium text-slate-800">{selectedPayment.studentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Description</span>
                <span className="font-medium text-slate-800">{selectedPayment.description}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Term</span>
                <span className="font-medium text-slate-800">{selectedPayment.term}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                <span className="font-semibold text-slate-700">Amount</span>
                <span className="font-bold text-slate-900 text-base">R{selectedPayment.amount.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              This is a simulated payment record. In production, clicking below would initiate a real payment flow.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" fullWidth loading={marking} onClick={handleMarkAsPaid}>
                <CheckCircle2 size={16} />
                Confirm Payment
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardShell>
  );
}
