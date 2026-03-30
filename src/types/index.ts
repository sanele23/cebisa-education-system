// ─── User Roles ───────────────────────────────────────────────────────────────

export type UserRole = "student" | "teacher" | "parent" | "admin";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// ─── Student ──────────────────────────────────────────────────────────────────

export interface Student extends BaseUser {
  role: "student";
  grade: string;
  classId: string;
  parentId: string;
}

// ─── Teacher ──────────────────────────────────────────────────────────────────

export interface Teacher extends BaseUser {
  role: "teacher";
  subject: string;
  classIds: string[];
}

// ─── Parent ───────────────────────────────────────────────────────────────────

export interface Parent extends BaseUser {
  role: "parent";
  childIds: string[];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface Admin extends BaseUser {
  role: "admin";
}

// ─── Subjects & Grades ────────────────────────────────────────────────────────

export interface SubjectResult {
  subject: string;
  score: number;
  maxScore: number;
  grade: string;
  term: string;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
  maxScore?: number;
}

// ─── Announcements ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  targetRoles: UserRole[];
  priority: "normal" | "important" | "urgent";
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export type PaymentStatus = "paid" | "pending" | "overdue";

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  amount: number;
  description: string;
  date: string;
  status: PaymentStatus;
  term: string;
}

export interface FeesSummary {
  totalFees: number;
  amountPaid: number;
  outstanding: number;
  currency: string;
}

// ─── Class ────────────────────────────────────────────────────────────────────

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
  studentIds: string[];
}

// ─── Performance Chart ────────────────────────────────────────────────────────

export interface PerformancePoint {
  term: string;
  average: number;
}
