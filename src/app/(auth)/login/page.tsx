import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Spy vs Detectives",
  description: "Secure terminal access for authorized agents only.",
};

export default function LoginPage() {
  return (
    <main>
      {/* The LoginForm component handles the full screen layout */}
      <LoginForm />
    </main>
  );
}
