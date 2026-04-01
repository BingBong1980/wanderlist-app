"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/map");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError("Check your email to confirm your account!");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B8DCF0 50%, #F5F0E8 100%)" }}>
      {/* Header */}
      <div className="cloud-container relative pt-12 pb-8 px-6 text-center">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="relative z-10">
          <img src="/logo.png" alt="Wanderlist" className="w-32 h-auto mx-auto mb-2 drop-shadow-lg" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8">
        <div className="spot-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === "login" ? "Sign in to access your travel map" : "Get started with Wanderlist"}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-md active:scale-95 transition-transform disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
            >
              {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-gray-500"
            >
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <span className="text-orange-500 font-medium">
                {mode === "login" ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
