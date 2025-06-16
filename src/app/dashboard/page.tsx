"use client"

import Button from "@/components/Button"
import DashboardLayout from "@/layouts/DashboardLayout"
import { AuthService } from "@/services/authService"

export default function Dashboard() {
  function handleVerifyPageRedirect() {
    AuthService.checkVerified()
  }

  return (
    <DashboardLayout>
      <div>Dashboard</div>
    </DashboardLayout>
  )
}
