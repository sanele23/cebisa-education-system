import type {
  Student,
  Teacher,
  Parent,
  Admin,
  SubjectResult,
  AttendanceRecord,
  Assignment,
  Announcement,
  Payment,
  ClassInfo,
  PerformancePoint,
} from "@/types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu-001",
    name: "Liam Dube",
    email: "liam.dube@cebisa.edu",
    role: "student",
    grade: "Grade 10",
    classId: "cls-001",
    parentId: "par-001",
  },
  {
    id: "stu-002",
    name: "Aisha Mokoena",
    email: "aisha.mokoena@cebisa.edu",
    role: "student",
    grade: "Grade 10",
    classId: "cls-001",
    parentId: "par-002",
  },
  {
    id: "stu-003",
    name: "Thabo Nkosi",
    email: "thabo.nkosi@cebisa.edu",
    role: "student",
    grade: "Grade 11",
    classId: "cls-002",
    parentId: "par-001",
  },
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: "tch-001",
    name: "Ms. Nomsa Zulu",
    email: "nomsa.zulu@cebisa.edu",
    role: "teacher",
    subject: "Mathematics",
    classIds: ["cls-001", "cls-002"],
  },
  {
    id: "tch-002",
    name: "Mr. David Sithole",
    email: "david.sithole@cebisa.edu",
    role: "teacher",
    subject: "Physical Science",
    classIds: ["cls-001"],
  },
];

export const MOCK_PARENTS: Parent[] = [
  {
    id: "par-001",
    name: "Mr. James Dube",
    email: "james.dube@gmail.com",
    role: "parent",
    childIds: ["stu-001", "stu-003"],
  },
  {
    id: "par-002",
    name: "Mrs. Faith Mokoena",
    email: "faith.mokoena@gmail.com",
    role: "parent",
    childIds: ["stu-002"],
  },
];

export const MOCK_ADMIN: Admin = {
  id: "adm-001",
  name: "Principal Khoza",
  email: "admin@cebisa.edu",
  role: "admin",
};

// ─── Mock Credentials (email → password) ─────────────────────────────────────
// In production replace with real auth.
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string; role: string }> = {
  "liam.dube@cebisa.edu": { password: "student123", userId: "stu-001", role: "student" },
  "aisha.mokoena@cebisa.edu": { password: "student123", userId: "stu-002", role: "student" },
  "nomsa.zulu@cebisa.edu": { password: "teacher123", userId: "tch-001", role: "teacher" },
  "david.sithole@cebisa.edu": { password: "teacher123", userId: "tch-002", role: "teacher" },
  "james.dube@gmail.com": { password: "parent123", userId: "par-001", role: "parent" },
  "faith.mokoena@gmail.com": { password: "parent123", userId: "par-002", role: "parent" },
  "admin@cebisa.edu": { password: "admin123", userId: "adm-001", role: "admin" },
};

// ─── Classes ──────────────────────────────────────────────────────────────────

export const MOCK_CLASSES: ClassInfo[] = [
  {
    id: "cls-001",
    name: "10A",
    grade: "Grade 10",
    teacherId: "tch-001",
    studentIds: ["stu-001", "stu-002"],
  },
  {
    id: "cls-002",
    name: "11B",
    grade: "Grade 11",
    teacherId: "tch-001",
    studentIds: ["stu-003"],
  },
];

// ─── Subject Results ──────────────────────────────────────────────────────────

export const MOCK_RESULTS: Record<string, SubjectResult[]> = {
  "stu-001": [
    { subject: "Mathematics", score: 78, maxScore: 100, grade: "B+", term: "Term 1" },
    { subject: "Physical Science", score: 82, maxScore: 100, grade: "A-", term: "Term 1" },
    { subject: "English", score: 74, maxScore: 100, grade: "B", term: "Term 1" },
    { subject: "History", score: 88, maxScore: 100, grade: "A", term: "Term 1" },
    { subject: "Life Sciences", score: 70, maxScore: 100, grade: "B", term: "Term 1" },
    { subject: "Accounting", score: 65, maxScore: 100, grade: "C+", term: "Term 1" },
  ],
  "stu-002": [
    { subject: "Mathematics", score: 91, maxScore: 100, grade: "A", term: "Term 1" },
    { subject: "Physical Science", score: 87, maxScore: 100, grade: "A", term: "Term 1" },
    { subject: "English", score: 79, maxScore: 100, grade: "B+", term: "Term 1" },
    { subject: "History", score: 83, maxScore: 100, grade: "A-", term: "Term 1" },
    { subject: "Life Sciences", score: 92, maxScore: 100, grade: "A+", term: "Term 1" },
    { subject: "Accounting", score: 76, maxScore: 100, grade: "B+", term: "Term 1" },
  ],
  "stu-003": [
    { subject: "Mathematics", score: 60, maxScore: 100, grade: "C+", term: "Term 1" },
    { subject: "Physical Science", score: 55, maxScore: 100, grade: "C", term: "Term 1" },
    { subject: "English", score: 72, maxScore: 100, grade: "B", term: "Term 1" },
    { subject: "History", score: 80, maxScore: 100, grade: "B+", term: "Term 1" },
    { subject: "Life Sciences", score: 68, maxScore: 100, grade: "B-", term: "Term 1" },
    { subject: "Accounting", score: 58, maxScore: 100, grade: "C", term: "Term 1" },
  ],
};

// ─── Performance Over Time ────────────────────────────────────────────────────

export const MOCK_PERFORMANCE: Record<string, PerformancePoint[]> = {
  "stu-001": [
    { term: "T1 '24", average: 68 },
    { term: "T2 '24", average: 72 },
    { term: "T3 '24", average: 75 },
    { term: "T4 '24", average: 79 },
    { term: "T1 '25", average: 76 },
  ],
  "stu-002": [
    { term: "T1 '24", average: 82 },
    { term: "T2 '24", average: 85 },
    { term: "T3 '24", average: 88 },
    { term: "T4 '24", average: 84 },
    { term: "T1 '25", average: 85 },
  ],
  "stu-003": [
    { term: "T1 '24", average: 55 },
    { term: "T2 '24", average: 60 },
    { term: "T3 '24", average: 58 },
    { term: "T4 '24", average: 63 },
    { term: "T1 '25", average: 66 },
  ],
};

// ─── Attendance ───────────────────────────────────────────────────────────────

export const MOCK_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  "stu-001": [
    { date: "2025-03-03", status: "present" },
    { date: "2025-03-04", status: "present" },
    { date: "2025-03-05", status: "absent" },
    { date: "2025-03-06", status: "present" },
    { date: "2025-03-07", status: "late" },
    { date: "2025-03-10", status: "present" },
    { date: "2025-03-11", status: "present" },
    { date: "2025-03-12", status: "present" },
    { date: "2025-03-13", status: "present" },
    { date: "2025-03-14", status: "absent" },
  ],
  "stu-002": [
    { date: "2025-03-03", status: "present" },
    { date: "2025-03-04", status: "present" },
    { date: "2025-03-05", status: "present" },
    { date: "2025-03-06", status: "present" },
    { date: "2025-03-07", status: "present" },
    { date: "2025-03-10", status: "present" },
    { date: "2025-03-11", status: "late" },
    { date: "2025-03-12", status: "present" },
    { date: "2025-03-13", status: "present" },
    { date: "2025-03-14", status: "present" },
  ],
  "stu-003": [
    { date: "2025-03-03", status: "present" },
    { date: "2025-03-04", status: "absent" },
    { date: "2025-03-05", status: "absent" },
    { date: "2025-03-06", status: "present" },
    { date: "2025-03-07", status: "late" },
    { date: "2025-03-10", status: "present" },
    { date: "2025-03-11", status: "absent" },
    { date: "2025-03-12", status: "present" },
    { date: "2025-03-13", status: "late" },
    { date: "2025-03-14", status: "present" },
  ],
};

// ─── Assignments ──────────────────────────────────────────────────────────────

export const MOCK_ASSIGNMENTS: Record<string, Assignment[]> = {
  "stu-001": [
    { id: "asgn-001", title: "Algebra Problem Set 3", subject: "Mathematics", dueDate: "2025-04-02", status: "pending" },
    { id: "asgn-002", title: "Forces & Motion Lab Report", subject: "Physical Science", dueDate: "2025-04-04", status: "submitted" },
    { id: "asgn-003", title: "Essay: WWI Causes", subject: "History", dueDate: "2025-03-28", status: "graded", score: 85, maxScore: 100 },
    { id: "asgn-004", title: "Reading Comprehension", subject: "English", dueDate: "2025-04-07", status: "pending" },
  ],
  "stu-002": [
    { id: "asgn-001", title: "Algebra Problem Set 3", subject: "Mathematics", dueDate: "2025-04-02", status: "graded", score: 95, maxScore: 100 },
    { id: "asgn-005", title: "Cell Biology Diagram", subject: "Life Sciences", dueDate: "2025-04-05", status: "submitted" },
    { id: "asgn-006", title: "Balance Sheet Exercise", subject: "Accounting", dueDate: "2025-04-08", status: "pending" },
  ],
  "stu-003": [
    { id: "asgn-007", title: "Quadratic Equations", subject: "Mathematics", dueDate: "2025-04-01", status: "pending" },
    { id: "asgn-008", title: "Chemical Reactions WS", subject: "Physical Science", dueDate: "2025-04-03", status: "pending" },
  ],
};

// ─── Announcements ────────────────────────────────────────────────────────────

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-001",
    title: "Term 2 starts 7 April",
    body: "Please ensure all fees are settled before the first day of Term 2.",
    date: "2025-03-25",
    targetRoles: ["student", "parent"],
    priority: "important",
  },
  {
    id: "ann-002",
    title: "Staff Development Day — 4 April",
    body: "There will be no school on Friday 4 April due to staff development activities.",
    date: "2025-03-27",
    targetRoles: ["student", "teacher", "parent"],
    priority: "normal",
  },
  {
    id: "ann-003",
    title: "Grade 10 Science Fair",
    body: "The annual Science Fair is scheduled for 25 April. Projects must be submitted by 18 April.",
    date: "2025-03-20",
    targetRoles: ["student", "teacher"],
    priority: "normal",
  },
  {
    id: "ann-004",
    title: "Urgent: Outstanding Fees",
    body: "Several accounts are overdue. Please contact the finance office immediately to avoid disruption to your child's education.",
    date: "2025-03-29",
    targetRoles: ["parent"],
    priority: "urgent",
  },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay-001",
    studentId: "stu-001",
    studentName: "Liam Dube",
    parentId: "par-001",
    parentName: "Mr. James Dube",
    amount: 4500,
    description: "Term 1 School Fees",
    date: "2025-01-15",
    status: "paid",
    term: "Term 1",
  },
  {
    id: "pay-002",
    studentId: "stu-001",
    studentName: "Liam Dube",
    parentId: "par-001",
    parentName: "Mr. James Dube",
    amount: 4500,
    description: "Term 2 School Fees",
    date: "2025-03-30",
    status: "pending",
    term: "Term 2",
  },
  {
    id: "pay-003",
    studentId: "stu-003",
    studentName: "Thabo Nkosi",
    parentId: "par-001",
    parentName: "Mr. James Dube",
    amount: 4800,
    description: "Term 1 School Fees",
    date: "2025-01-20",
    status: "paid",
    term: "Term 1",
  },
  {
    id: "pay-004",
    studentId: "stu-003",
    studentName: "Thabo Nkosi",
    parentId: "par-001",
    parentName: "Mr. James Dube",
    amount: 4800,
    description: "Term 2 School Fees",
    date: "2025-03-30",
    status: "overdue",
    term: "Term 2",
  },
  {
    id: "pay-005",
    studentId: "stu-002",
    studentName: "Aisha Mokoena",
    parentId: "par-002",
    parentName: "Mrs. Faith Mokoena",
    amount: 4500,
    description: "Term 1 School Fees",
    date: "2025-01-10",
    status: "paid",
    term: "Term 1",
  },
  {
    id: "pay-006",
    studentId: "stu-002",
    studentName: "Aisha Mokoena",
    parentId: "par-002",
    parentName: "Mrs. Faith Mokoena",
    amount: 4500,
    description: "Term 2 School Fees",
    date: "2025-03-30",
    status: "pending",
    term: "Term 2",
  },
];

// ─── Fees Summary Per Student ──────────────────────────────────────────────────

export const MOCK_FEES: Record<string, { totalFees: number; amountPaid: number; outstanding: number }> = {
  "stu-001": { totalFees: 9000, amountPaid: 4500, outstanding: 4500 },
  "stu-002": { totalFees: 9000, amountPaid: 4500, outstanding: 4500 },
  "stu-003": { totalFees: 9600, amountPaid: 4800, outstanding: 4800 },
};
