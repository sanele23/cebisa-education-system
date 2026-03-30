import type { Metadata } from "next";
import { LoginView } from "@/features/auth/LoginView";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return <LoginView />;
}
