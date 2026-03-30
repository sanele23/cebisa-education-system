"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, Receipt } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/lib/store/authStore";
import { usePaymentsStore } from "@/lib/store/paymentsStore";
import { MOCK_STUDENTS, MOCK_FEES } from "@/lib/mockData";

export function ParentFees() {
  const { user } = useAuthStore();
  const { payments, markAsPaid } = usePaymentsStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const children = MOCK_STUDENTS.filter((s) => s.parentId === user?.id);
  const myPayments = payments.filter((p) => p.parentId === user?.id);
  const selected = myPayments.find((p) => p.id === selectedId);

  const handlePay = async () => {
    if (!selectedId) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    markAsPaid(selectedId);
    setLoading(false);
    setDone(true);
    setTimeout(() => {
      setSelectedId(null);
      setDone(false);
    }, 2000);
  };

  return (
    <DashboardShell
      title="Fees & Payments"
      subtitle="Manage school fee payments for your children"
    >
      {/* Fees summary per child */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {children.map((child) => {
          const fees = MOCK_FEES[child.id] ?? {
            totalFees: 0,
            amountPaid: 0,
            outstanding: 0,
          };
          const paidPct = fees.totalFees
            ? Math.round((fees.amountPaid / fees.totalFees) * 100)
            : 0;
          return (
            <Card key={child.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                  {child.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{child.name}</p>
                  <p className="text-xs text-slate-500">{child.grade}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Fees</span>
                  <span className="font-semibold">
                    R{fees.totalFees.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Paid</span>
                  <span className="font-semibold text-emerald-600">
                    R{fees.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Outstanding</span>
                  <span
                    className={`font-semibold ${fees.outstanding > 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    R{fees.outstanding.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-gradient transition-all"
                      style={{ width: `${paidPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{paidPct}% paid</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payment list */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">
            Payment Records
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {myPayments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className={`p-2.5 rounded-xl bg-slate-50 ${p.status === "paid" ? "text-emerald-600" : p.status === "overdue" ? "text-red-600" : "text-amber-600"}`}
              >
                <Receipt size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">
                  {p.description}
                </p>
                <p className="text-xs text-slate-400">
                  {p.studentName} · {p.term}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">
                  R{p.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">{p.date}</p>
              </div>
              <Badge
                variant={
                  p.status === "paid"
                    ? "success"
                    : p.status === "overdue"
                      ? "danger"
                      : "warning"
                }
              >
                {p.status}
              </Badge>
              {p.status !== "paid" && (
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => setSelectedId(p.id)}
                >
                  Make Payment
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={!!selectedId}
        onClose={() => {
          if (!loading) {
            setSelectedId(null);
            setDone(false);
          }
        }}
        title="Make Payment"
        size="sm"
      >
        {done ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Payment successful!
            </p>
          </div>
        ) : selected ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Student</span>
                <span className="font-medium">{selected.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">For</span>
                <span className="font-medium">{selected.description}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-semibold text-slate-700">Amount</span>
                <span className="font-bold text-lg">
                  R{selected.amount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setSelectedId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                fullWidth
                loading={loading}
                onClick={handlePay}
              >
                <CreditCard size={15} />
                Pay Now
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardShell>
  );
}
