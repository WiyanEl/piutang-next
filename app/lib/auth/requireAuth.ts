import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/supabase/server";

export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}