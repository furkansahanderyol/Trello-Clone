"use client"

import styles from "./page.module.scss"

import AuthLayout from "@/layouts/AuthLayout"
import Form from "@/components/Form"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { FormEvent, useReducer, useRef, useState } from "react"
import { checkPassword } from "@/helpers/validator"
import { AuthService } from "@/services/authService"

type Action =
  | { type: "currentPassword"; value: string[] }
  | { type: "newPassword"; value: string[] }
  | { type: "newPasswordConfirm"; value: string[] }

type Errors = {
  currentPasswordErrors: string[]
  newPasswordErrors: string[]
  newPasswordConfirmErrors: string[]
}

function reducer(errors: Errors, action: Action) {
  switch (action.type) {
    case "currentPassword":
      return {
        currentPasswordErrors: action.value,
        newPasswordErrors: errors.newPasswordErrors,
        newPasswordConfirmErrors: errors.newPasswordConfirmErrors,
      }
    case "newPassword":
      return {
        newPasswordErrors: action.value,
        currentPasswordErrors: errors.currentPasswordErrors,
        newPasswordConfirmErrors: errors.newPasswordConfirmErrors,
      }

    case "newPasswordConfirm":
      return {
        newPasswordConfirmErrors: action.value,
        currentPasswordErrors: errors.currentPasswordErrors,
        newPasswordErrors: errors.newPasswordErrors,
      }
  }
}

export default function ChangePasswordPage() {
  const currentPasswordRef = useRef<HTMLInputElement | null>(null)
  const newPasswordRef = useRef<HTMLInputElement | null>(null)
  const newPasswordConfirmRef = useRef<HTMLInputElement | null>(null)

  const [errors, dispatch] = useReducer(reducer, {
    currentPasswordErrors: [],
    newPasswordErrors: [],
    newPasswordConfirmErrors: [],
  })

  const [isFirstSubmit, setIsFirstSubmit] = useState(true)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log(errors)

    setIsFirstSubmit(false)

    const isCurrentPasswordValid = checkPassword(
      currentPasswordRef.current?.value
    ) as string[]
    const isNewPasswordValid = checkPassword(
      newPasswordRef.current?.value
    ) as string[]
    const isNewPasswordConfirmValid = checkPassword(
      newPasswordConfirmRef.current?.value
    ) as string[]

    dispatch({ type: "currentPassword", value: isCurrentPasswordValid })
    dispatch({ type: "newPassword", value: isNewPasswordValid })
    dispatch({ type: "newPasswordConfirm", value: isNewPasswordConfirmValid })

    if (
      isCurrentPasswordValid.length === 0 &&
      isNewPasswordValid.length === 0 &&
      isNewPasswordConfirmValid.length === 0
    ) {
      AuthService.changePassword(
        currentPasswordRef.current?.value!,
        newPasswordRef.current?.value!,
        newPasswordConfirmRef.current?.value!
      )
    }
  }

  return (
    <AuthLayout>
      <Form formHeader={"Change password"} onSubmit={handleSubmit}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input
              ref={currentPasswordRef}
              type={"password"}
              label={"Current password"}
              onChange={(e) =>
                dispatch({ type: "currentPassword", value: checkPassword(e) })
              }
              errorMessage={!isFirstSubmit ? errors.currentPasswordErrors : []}
            />
            <Input
              ref={newPasswordRef}
              type={"password"}
              label={"New password"}
              onChange={(e) =>
                dispatch({ type: "newPassword", value: checkPassword(e) })
              }
              errorMessage={!isFirstSubmit ? errors.newPasswordErrors : []}
            />
            <Input
              ref={newPasswordConfirmRef}
              type={"password"}
              label={"New password confirm"}
              onChange={(e) =>
                dispatch({
                  type: "newPasswordConfirm",
                  value: checkPassword(e),
                })
              }
              errorMessage={
                !isFirstSubmit ? errors.newPasswordConfirmErrors : []
              }
            />
          </div>
          <div className={styles.buttonSide}>
            <Button type={"submit"} text={"Change password"} />
          </div>
        </div>
      </Form>
    </AuthLayout>
  )
}
