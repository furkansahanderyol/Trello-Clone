"use client"

import AuthLayout from "@/layouts/AuthLayout"
import styles from "./page.module.scss"
import Form from "@/components/Form"
import Button from "@/components/Button"
import { Search } from "lucide-react"
import Input from "@/components/Input"
import Link from "next/link"
import { PageLink } from "@/constants/PageLink"
import { IconGoogle } from "@/assets/svg/IconGoogle"

export default function Login() {
  return (
    <AuthLayout>
      <Form formHeader={"Login"} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formWrapper}>
          <div className={styles.inputSide}>
            <Input type={"email"} label={"Email"} />
            <div className={styles.passwordInputWrapper}>
              <Input type={"password"} label={"Password"} />
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
