import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Payment, PaymentStatus } from "@/types";
import { INITIAL_PAYMENTS } from "@/lib/mockData";

interface PaymentsState {
  payments: Payment[];
  markAsPaid: (paymentId: string) => void;
  addPayment: (payment: Omit<Payment, "id" | "date">) => void;
  getPaymentsByParent: (parentId: string) => Payment[];
  getPaymentsByStudent: (studentId: string) => Payment[];
  updateStatus: (paymentId: string, status: PaymentStatus) => void;
}

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set, get) => ({
      payments: INITIAL_PAYMENTS,

      markAsPaid: (paymentId) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId
              ? { ...p, status: "paid", date: new Date().toISOString().split("T")[0] }
              : p
          ),
        })),

      addPayment: (paymentData) =>
        set((state) => ({
          payments: [
            ...state.payments,
            {
              ...paymentData,
              id: `pay-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      getPaymentsByParent: (parentId) =>
        get().payments.filter((p) => p.parentId === parentId),

      getPaymentsByStudent: (studentId) =>
        get().payments.filter((p) => p.studentId === studentId),

      updateStatus: (paymentId, status) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId ? { ...p, status } : p
          ),
        })),
    }),
    {
      name: "cebisa-payments",
    }
  )
);
