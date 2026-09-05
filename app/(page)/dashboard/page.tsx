import { Metadata } from "next"

import Dashboard from "@/app/components/dashboard/Dashboard"
import { requireAuth } from "@/app/lib/auth/requireAuth"

export const metadata: Metadata = {
  title: `Dashboard | Kasbon`
}

export default async function DashboardPage() {
  await requireAuth();

  return (
    <Dashboard />
  )
}
