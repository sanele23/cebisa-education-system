"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store/authStore";
import {
  MOCK_CREDENTIALS,
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_PARENTS,
  MOCK_ADMIN,
} from "@/lib/mockData";
import type { UserRole } from "@/types";

type RoleTab = "student" | "teacher" | "parent" | "admin";

interface RoleConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  activeGradient: string;
  demoEmail: string;
  demoPassword: string;
  description: string;
}

const ROLE_CONFIG: Record<RoleTab, RoleConfig> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    color: "text-teal-600",
    activeGradient: "from-teal-500 to-teal-600",
    demoEmail: "liam.dube@cebisa.edu",
    demoPassword: "student123",
    description: "View grades, assignments & attendance",
  },
  teacher: {
    label: "Teacher",
    icon: BookOpen,
    color: "text-blue-600",
    activeGradient: "from-blue-500 to-blue-600",
    demoEmail: "nomsa.zulu@cebisa.edu",
    demoPassword: "teacher123",
    description: "Manage classes, results & students",
  },
  parent: {
    label: "Parent",
    icon: Users,
    color: "text-purple-600",
    activeGradient: "from-purple-500 to-purple-600",
    demoEmail: "james.dube@gmail.com",
    demoPassword: "parent123",
    description: "Track child progress & manage fees",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-amber-600",
    activeGradient: "from-amber-500 to-amber-600",
    demoEmail: "admin@cebisa.edu",
    demoPassword: "admin123",
    description: "Finance overview & system management",
  },
};

function getUserByIdAndRole(userId: string, role: UserRole) {
  if (role === "student") return MOCK_STUDENTS.find((s) => s.id === userId);
  if (role === "teacher") return MOCK_TEACHERS.find((t) => t.id === userId);
  if (role === "parent") return MOCK_PARENTS.find((p) => p.id === userId);
  if (role === "admin") return MOCK_ADMIN;
  return null;
}

export function LoginView() {
  const [activeTab, setActiveTab] = useState<RoleTab>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuthStore();
  const router = useRouter();

  const config = ROLE_CONFIG[activeTab];

  const handleTabChange = (tab: RoleTab) => {
    setActiveTab(tab);
    setEmail("");
    setPassword("");
    setError("");
  };

  const fillDemo = () => {
    setEmail(config.demoEmail);
    setPassword(config.demoPassword);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const cred = MOCK_CREDENTIALS[email];
    if (!cred || cred.password !== password || cred.role !== activeTab) {
      setLoading(false);
      setError("Invalid credentials. Use the demo button to auto-fill.");
      return;
    }

    const user = getUserByIdAndRole(cred.userId, cred.role as UserRole);
    if (!user) {
      setLoading(false);
      setError("User account not found.");
      return;
    }

    login({ id: user.id, name: user.name, email: user.email, role: user.role });
    router.push(`/dashboard/${activeTab}`);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-brand-gradient-soft relative overflow-hidden flex-col items-center justify-center p-12 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="w-80 h-80 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl overflow-hidden">
            <Image
              src="/cebisa-logo.jpeg"
              alt="Cebisa Logo"
              className="w-80 h-80 object-contain"
              width={320}
              height={320}
            />
          </div>

          {/* <h1 className="text-4xl font-bold mb-2">Cebisa Education</h1> */}
          <p className="text-white/70 text-xl font-semibold mb-12">
            School Management System
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: "1,200+", label: "Students" },
              { value: "86", label: "Teachers" },
              { value: "98%", label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <blockquote className="relative z-10 mt-16 max-w-sm text-center">
          <p className="text-white/80 text-sm italic leading-relaxed">
            &ldquo;Cebisa has transformed how we engage with parents and track
            student progress. It&apos;s indispensable.&rdquo;
          </p>
          <footer className="mt-3 text-white/50 text-xs">
            — Principal Khoza, Cebisa Academy
          </footer>
        </blockquote>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center overflow-hidden">
              <img
                src="/cebisa-logo.jpg"
                alt="Cebisa Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-slate-800">Cebisa Education</p>
              <p className="text-slate-500 text-xs">School Management System</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Welcome back
          </h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your portal</p>

          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-8 p-1 bg-slate-100 rounded-2xl">
            {(Object.keys(ROLE_CONFIG) as RoleTab[]).map((role) => {
              const cfg = ROLE_CONFIG[role];
              const Icon = cfg.icon;
              const isActive = activeTab === role;
              return (
                <button
                  key={role}
                  onClick={() => handleTabChange(role)}
                  className={clsx(
                    "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  <Icon
                    size={18}
                    className={clsx(isActive ? cfg.color : "text-slate-400")}
                  />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Role Description */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500">{config.description}</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Email Address"
              type="email"
              placeholder={`e.g. ${config.demoEmail}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-xl"
                role="alert"
              >
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Sign In
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          {/* Demo shortcut */}
          <div className="mt-6 p-4 bg-brand-navy/5 rounded-xl border border-brand-navy/10">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Demo Credentials
            </p>
            <p className="text-xs text-slate-500 mb-3">
              <span className="font-medium text-slate-700">
                {config.demoEmail}
              </span>
              {" / "}
              <span className="font-medium text-slate-700">
                {config.demoPassword}
              </span>
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs font-medium text-brand-teal hover:underline"
            >
              Auto-fill demo credentials →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
