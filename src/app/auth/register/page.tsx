"use client"

import AuthLayout from "@/layouts/AuthLayout"
import styles from "./page.module.scss"
import Form from "@/components/Form"
import Link from "next/link"
import { PageLink } from "@/constants/PageLink"
import Button from "@/components/Button"
import { FormEvent, useEffect, useReducer, useRef, useState } from "react"
import Input from "@/components/Input"
import {
  checkConfirmPassword,
  checkMail,
  checkName,
  checkPassword,
} from "@/helpers/validator"

type Action =
  | { type: "name"; value: string[] }
  | { type: "surname"; value: string[] }
  | { type: "email"; value: string[] }
  | { type: "password"; value: string[] }
  | { type: "confirmPassword"; value: string[] }

type Errors = {
  nameErrors: string[]
  surnameErrors: string[]
  emailErrors: string[]
  passwordErrors: string[]
  confirmPasswordErrors: string[]
}

function reducer(errors: Errors, action: Action) {
  switch (action.type) {
    case "name":
      return {
        ...errors,
        nameErrors: action.value,
      }
    case "surname":
      return {
        ...errors,
        surnameErrors: action.value,
      }
    case "email":
      return {
        ...errors,
        emailErrors: action.value,
      }
    case "password":
      return {
        ...errors,
        passwordErrors: action.value,
      }
    case "confirmPassword":
      return {
        ...errors,
        confirmPasswordErrors: action.value,
      }
  }
}

export default function Register() {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const surnameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null)

  const [errors, dispatch] = useReducer(reducer, {
    nameErrors: [],
    surnameErrors: [],
    emailErrors: [],
    passwordErrors: [],
    confirmPasswordErrors: [],
  })

  const [isFirstSubmit, setIsFirstSubmit] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setIsFirstSubmit(true)

    const isNameValid = checkName(nameRef?.current?.value || "") as string[]
    const isSurnameValid = checkName(
      surnameRef?.current?.value || ""
    ) as string[]
    const isMailValid = checkMail(emailRef?.current?.value) as string[]
    const isPasswordValid = checkPassword(
      passwordRef?.current?.value
    ) as string[]
    const isConfirmPasswordValid = checkConfirmPassword(
      passwordRef?.current?.value || "",
      passwordConfirmRef?.current?.value || ""
    ) as string[]

    dispatch({ type: "name", value: isNameValid })
    dispatch({ type: "surname", value: isSurnameValid })
    dispatch({ type: "email", value: isMailValid })
    dispatch({
      type: "password",
      value: isPasswordValid,
    })
    dispatch({ type: "confirmPassword", value: isConfirmPasswordValid })

    if (
      isNameValid.length !== 0 ||
      isSurnameValid.length !== 0 ||
      isMailValid.length !== 0 ||
      isPasswordValid.length !== 0 ||
      isConfirmPasswordValid.length !== 0
    ) {
      return
    } else {
      alert("Success")
    }
  }

  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  return (
    <AuthLayout>
      <Form formHeader={"Sign Up"} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input
              onChange={(e) => dispatch({ type: "name", value: checkName(e) })}
              ref={nameRef}
              type={"text"}
              label={"Name"}
              errorMessage={isFirstSubmit ? errors.nameErrors : []}
            />
            <div className={styles.passwordInputWrapper}>
              <Input
                onChange={(e) =>
                  dispatch({ type: "surname", value: checkName(e) })
                }
                ref={surnameRef}
                type={"text"}
                label={"Surname"}
                errorMessage={isFirstSubmit ? errors.surnameErrors : []}
              />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input
                onChange={(e) =>
                  dispatch({ type: "email", value: checkMail(e) })
                }
                ref={emailRef}
                type={"email"}
                label={"Email"}
                errorMessage={isFirstSubmit ? errors.emailErrors : []}
              />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input
                onChange={(e) =>
                  dispatch({ type: "password", value: checkPassword(e) })
                }
                ref={passwordRef}
                type={"password"}
                label={"Password"}
                errorMessage={isFirstSubmit ? errors.passwordErrors : []}
              />
            </div>
            <div className={styles.passwordInputWrapper}>
              <Input
                onChange={(e) =>
                  dispatch({
                    type: "confirmPassword",
                    value: checkConfirmPassword(
                      passwordRef?.current?.value || "",
                      e
                    ),
                  })
                }
                ref={passwordConfirmRef}
                type={"password"}
                label={"Confirm Password"}
                errorMessage={isFirstSubmit ? errors.confirmPasswordErrors : []}
              />
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
