"use client"

import AuthLayout from "@/layouts/AuthLayout"
import styles from "./page.module.scss"
import Form from "@/components/Form"
import Button from "@/components/Button"
import { Eye, EyeOff } from "lucide-react"
import Input from "@/components/Input"
import Link from "next/link"
import { PageLink } from "@/constants/PageLink"
import { IconGoogle } from "@/assets/svg/IconGoogle"
import { FormEvent, useEffect, useReducer, useState } from "react"
import { validateEmail } from "@/helpers/validateEmail"
import { validatePassword } from "@/helpers/validatePassword"

type FormInformation = {
  email: string
  password: string
}

type Action =
  | { type: "email"; email: string }
  | { type: "password"; password: string }

type Errors = {
  email: string[]
  password: string[]
}

function reducer(userInput: FormInformation, action: Action) {
  switch (action.type) {
    case "email":
      return {
        email: action.email,
        password: userInput.password,
      }
      break
    case "password":
      return {
        email: userInput.email,
        password: action.password,
      }
      break
  }
}

export default function Login() {
  const [userInput, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Errors>({
    email: [],
    password: [],
  })
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const checkEmail = validateEmail(userInput.email).length < 1
    const checkPassword = validatePassword(userInput.password).length < 1

    if (!checkEmail || !checkPassword) {
      return setErrors({
        email: !checkEmail ? validateEmail(userInput.email) : [],
        password: !checkPassword ? validatePassword(userInput.password) : [],
      })
    } else {
      console.log("SUCCESS")
    }
  }

  return (
    <AuthLayout>
      <Form formHeader={"Login"} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input
              type={"email"}
              label={"Email"}
              errorMessage={errors.email ? errors.email : []}
              onChange={(e) => {
                dispatch({ type: "email", email: e })
              }}
            />
            <div className={styles.passwordInputWrapper}>
              <Input
                type={showPassword ? "text" : "password"}
                label={"Password"}
                errorMessage={
                  errors.password.length > 0
                    ? errors.password.map((message) => {
                        console.log("message", message)
                        return message
                      })
                    : undefined
                }
                onChange={(e) => {
                  dispatch({ type: "password", password: e })
                }}
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
