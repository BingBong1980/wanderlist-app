"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, MapPin, Heart, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({ hearts: 0, lists: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setEmail(user.email || "");

      const [{ count: hearts }, { count: lists }] = await Promise.all([
        supabase.from("hearts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("user_lists").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setStats({ hearts: hearts || 0, lists: lists || 0 });
    };
    load();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B8DCF0 30%, #F5F0E8 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Wanderlist" className="h-8 w-auto drop-shadow" />
        </div>

        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md"
          style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
        >
          <User size={28} className="text-white" />
        </div>
        <p className="text-gray-600 text-sm">{email}</p>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4">
        <div className="spot-card p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart size={16} className="text-red-400 fill-red-400" />
                <span className="text-xl font-bold text-gray-800">{stats.hearts}</span>
              </div>
              <p className="text-xs text-gray-500">Hearted spots</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <List size={16} className="text-orange-400" />
                <span className="text-xl font-bold text-gray-800">{stats.lists}</span>
              </div>
              <p className="text-xs text-gray-500">My lists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 space-y-3">
        <button
          onClick={handleSignOut}
          className="spot-card w-full p-4 flex items-center gap-3 text-red-500"
        >
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
