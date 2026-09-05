"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/app/lib/supabase/client"
import { LogOut } from 'lucide-react'

export default function DashboardHeader() {
  const router = useRouter();
  const supabase = createClient()
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await supabase.auth.signOut();

      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Kasbon
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="flex gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Keluar ..." : "Keluar"} <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}