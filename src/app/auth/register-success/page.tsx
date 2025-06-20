"use client"

import Button from "@/components/Button"
import Form from "@/components/Form"
import Input from "@/components/Input"
import { PageLink } from "@/constants/PageLink"
import AuthLayout from "@/layouts/AuthLayout"
import { AuthService } from "@/services/authService"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import styles from "./page.module.scss"
import { formatTime } from "@/helpers/formatTime"
import clsx from "clsx"
import { toast } from "react-toastify"
import PatternFormatInput from "@/components/PatternFormatInput"

export default function RegisterSuccess() {
  const [verificationCode, setVerificationCode] = useState("")
  const [startCountdown, setStartCountdown] = useState(false)
  const [countdown, setCountdown] = useState(120)
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    AuthService.checkVerified()
  }, [])

  useEffect(() => {
    if (!startCountdown) return
    if (countdown === 0) {
      setStartCountdown(false)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, startCountdown])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email) return

    AuthService.verify(email, verificationCode)
  }

  function handleResendCode() {
    startTimer()

    if (startCountdown && countdown !== 0) {
      toast.error(
        "Please wait until the current countdown ends before requesting new code."
      )
      return
    }

    if (!email) return

    AuthService.resendVerification(email)
  }

  function startTimer() {
    setStartCountdown(true)
    setCountdown(120)
  }

  useEffect(() => {
    console.log("verificationCode", verificationCode)
  }, [verificationCode])

  return (
    <AuthLayout>
      <Form formHeader="Verification Code" onSubmit={handleSubmit}>
        <div className={styles.wrapper}>
          <PatternFormatInput
            format={"### ###"}
            label="Please enter your verification code."
            onChange={(e) => setVerificationCode(e)}
          />
          <div className={styles.buttons}>
            <Button type="submit" text="Send" />
            <Button
              onClick={handleResendCode}
              type="button"
              text="Resend code"
              disabled={startCountdown}
            />
            <Link className={styles.verifyLater} href={PageLink.dashboard}>
              Verify account later.
            </Link>
            {startCountdown && (
              <div
                className={clsx(
                  styles.progressBar,
                  startCountdown && styles.progress
                )}
              >
                <div className={styles.countdown}>{formatTime(countdown)}</div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </AuthLayout>
  )
}
