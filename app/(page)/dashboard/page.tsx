import { Metadata } from "next"

import Dashboard from "@/app/components/dashboard/Dashboard"

export const metadata: Metadata = {
  title: `Dashboard | Kasbon`
}

export default function DashboardLayout() {
  return (
    <Dashboard />
  )
}
