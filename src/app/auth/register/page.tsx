"use client"

import AuthLayout from "@/layouts/AuthLayout"
import styles from "./page.module.scss"
import Form from "@/components/Form"
import Link from "next/link"
import { PageLink } from "@/constants/PageLink"
import Button from "@/components/Button"
import { FormEvent, useState } from "react"
import Input from "@/components/Input"

export default function Register() {
  const [isFirstSubmit, setIsFirstSubmit] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setIsFirstSubmit(true)
  }

  return (
    <AuthLayout>
      <Form formHeader={"Sign Up"} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input type={"text"} label={"Name"} />
            <div className={styles.passwordInputWrapper}>
              <Input type={"text"} label={"Surname"} />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input type={"email"} label={"Email"} />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input type={"password"} label={"Password"} />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input type={"password"} label={"Confirm Password"} />
            </div>
          </div>
          <Button
            type={"submit"}
            onClick={() => console.log("Submitted")}
            className={styles.createAccountButton}
            text={"Create Account"}
          />
          <div className={styles.signIn}>
            Already have an account?{" "}
            <Link className={styles.signInLink} href={PageLink.login}>
              Sign in
            </Link>
          </div>
        </div>
      </Form>
    </AuthLayout>
  )
}
