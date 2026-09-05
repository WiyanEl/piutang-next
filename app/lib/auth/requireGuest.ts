import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/supabase/server";

export async function requireGuest() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
}