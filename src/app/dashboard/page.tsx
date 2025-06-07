"use client"

import Button from "@/components/Button"
import { AuthService } from "@/services/authService"

export default function Dashboard() {
  async function handleClick() {
    AuthService.logout()
  }

  function handleVerifyPageRedirect() {
    AuthService.checkVerified()
  }

  return (
    <div>
      <div>Dashboard</div>
      <Button onClick={handleClick} type="button" text="Logout" />
      <Button onClick={handleVerifyPageRedirect} type="button" text="Verify" />
    </div>
  )
}
