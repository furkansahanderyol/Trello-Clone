"use client"

import AuthLayout from "@/layouts/AuthLayout"
import styles from "./page.module.scss"
import Form from "@/components/Form"
import Button from "@/components/Button"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { PageLink } from "@/constants/PageLink"
import { IconGoogle } from "@/assets/svg/IconGoogle"
import { FormEvent, useEffect, useReducer, useRef, useState } from "react"
import { checkMail, checkPassword } from "@/helpers/validator"
import Input from "@/components/Input"

type Action =
  | { type: "email"; value: string[] }
  | { type: "password"; value: string[] }

type Errors = {
  emailErrors: string[]
  passwordErrors: string[]
}

function reducer(errors: Errors, action: Action) {
  switch (action.type) {
    case "email":
      return {
        emailErrors: action.value,
        passwordErrors: errors.passwordErrors,
      }
    case "password":
      return {
        emailErrors: errors.emailErrors,
        passwordErrors: action.value,
      }
  }
}

export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const [errors, dispatch] = useReducer(reducer, {
    emailErrors: [],
    passwordErrors: [],
  })

  const [isFirstSubmit, setIsFirstSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setIsFirstSubmit(true)

    const isMailValid = checkMail(emailRef?.current?.value) as string[]
    const isPasswordValid = checkPassword(
      passwordRef?.current?.value
    ) as string[]

    dispatch({ type: "email", value: isMailValid })
    dispatch({
      type: "password",
      value: isPasswordValid,
    })

    if (isMailValid.length !== 0 || isPasswordValid.length !== 0) {
      return
    } else {
      const test = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      })
      const content = await test.json()

      console.log("test", content)
    }
  }

  return (
    <AuthLayout>
      <Form formHeader={"Login"} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input
              ref={emailRef}
              onChange={(e) => dispatch({ type: "email", value: checkMail(e) })}
              type={"email"}
              label={"Email"}
              errorMessage={isFirstSubmit ? errors.emailErrors : []}
            />
            <div className={styles.passwordInputWrapper}>
              <Input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                onChange={(e) =>
                  dispatch({ type: "password", value: checkPassword(e) })
                }
                label={"Password"}
                errorMessage={isFirstSubmit ? errors.passwordErrors : []}
                suffix={
                  showPassword ? (
                    <div onClick={() => setShowPassword(!showPassword)}>
                      <Eye size={12} />
                    </div>
                  ) : (
                    <div onClick={() => setShowPassword(!showPassword)}>
                      <EyeOff size={12} />
                    </div>
                  )
                }
              />
              <Link href={"#"} className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className={styles.buttonSide}>
            <Button
              onClick={() => console.log("Submitted")}
              type={"submit"}
              text={"Login"}
              className={styles.submitButton}
            />
            <Button
              onClick={() => console.log("Submitted")}
              type={"submit"}
              text={"Continue with Google"}
              className={styles.googleButton}
              prefix={<IconGoogle width={16} height={16} />}
            />
          </div>
          <div className={styles.signUp}>
            Don't have an account?{" "}
            <Link className={styles.signUpLink} href={PageLink.register}>
              Sign up
            </Link>{" "}
          </div>
        </div>
      </Form>
    </AuthLayout>
  )
}
