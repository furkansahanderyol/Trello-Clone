"use client"

import Button from "@/components/Button"
import Form from "@/components/Form"
import Input from "@/components/Input"
import { PageLink } from "@/constants/PageLink"
import AuthLayout from "@/layouts/AuthLayout"
import { AuthService } from "@/services/authService"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

export default function RegisterSuccess() {
  const [verificationCode, setVerificationCode] = useState("")
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  AuthService.checkVerified()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email) return

    AuthService.verify(email, verificationCode)
  }

  function handleResendCode() {
    if (!email) return

    AuthService.resendVerification(email)
  }

  return (
    <AuthLayout>
      <Form formHeader="Verification Code" onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setVerificationCode(e)}
          label="Please enter your verification code."
        />
        <Button type="submit" text="Send" />
        <Button onClick={handleResendCode} type="button" text="Resend code" />
        <Link href={PageLink.dashboard}>Verify account later.</Link>
      </Form>
    </AuthLayout>
  )
}
