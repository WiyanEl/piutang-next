"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/signin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 rounded-lg border px-4 py-2"
    >
      Keluar
    </button>
  );
}