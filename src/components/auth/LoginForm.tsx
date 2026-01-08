"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // --- Logic Handlers ---
  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Using Supabase direct sign-in for simplicity, or keep your API route if preferred
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Connection to HQ failed. Please retry.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("Secure channel initialization failed.");
      setLoading(false);
    }
  };

  // --- UI Render ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* 1. Background Effects (The "High Tech" Vibe) */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none"></div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

      {/* 2. The Glass Card */}
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative z-10 mx-4">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Agent Login
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access the encrypted network.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error State */}
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-950/50 border-red-900 text-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Codename (Email)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@cipher.com"
                  className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" classname="text-slate-200">
                  Passkey
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Forgot key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-900/20 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Establish Secure Connection"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">
                Or authenticate via
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Google Protocol
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-slate-800/50 pt-6">
          <p className="text-center text-sm text-slate-500">
            New agent?{" "}
            <Link
              href="/signup"
              className="font-semibold text-emerald-500 hover:text-emerald-400 hover:underline transition-all"
            >
              Request Clearance
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
