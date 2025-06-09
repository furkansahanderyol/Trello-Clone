import { PageLink } from "@/constants/PageLink"
import { handleRedirect } from "@/helpers/handleRedirect"
import axios from "@/lib/axios"
import { loadingAtom } from "@/store"
import { getDefaultStore } from "jotai"
import { toast } from "react-toastify"

interface RegisterPayload {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}

const defaultStore = getDefaultStore()

export namespace AuthService {
  export async function register(data: RegisterPayload) {
    defaultStore.set(loadingAtom, true)

    await axios
      .post("/register", data, { withCredentials: true })
      .then((response) => {
        if (response.status === 201) {
          toast.success(response.data.message)

          handleRedirect(
            `${PageLink.registerSuccess}?email=${encodeURIComponent(
              response.data.user.email
            )}`,
            200
          )
        }

        return response.data
      })
      .catch((error) => {
        console.error("AuthService-Register -> ", error)
        toast.error(error.message)
        throw error
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function login(email: string, password: string) {
    await axios
      .post(
        "/login",
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        defaultStore.set(loadingAtom, true)

        if (response.status === 200) {
          toast.success(response.data.message)
          handleRedirect(PageLink.dashboard, 200)
        }

        return response.data
      })
      .catch((error) => {
        console.error("AuthService-Login -> ", error)
        toast.error(error.message)
        throw error
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function verify(email: string, code: string) {
    defaultStore.set(loadingAtom, true)

    await axios
      .post(
        "/register-success",
        { email, code },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message)
          handleRedirect(PageLink.dashboard, 200)
          return response.data
        }
      })
      .catch((error) => {
        console.error("AuthService-Verify -> ", error)
        toast.error(error.message)
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function resendVerification(email: string) {
    defaultStore.set(loadingAtom, true)

    await axios
      .post("/resend-verification", { email })
      .then((response) => {
        toast.success(response.data.message)
        return response.data
      })
      .catch((error) => {
        toast.error(error.message)
        console.error("AuthService - ResendVerification -> ", error)
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function logout() {
    defaultStore.set(loadingAtom, true)
    await axios
      .post("/logout")
      .then((response) => {
        if (response.status === 201) {
          handleRedirect(PageLink.login, 200)
          toast.success(response.data.message)
          return response.data
        }
      })
      .catch((error) => {
        console.error("AuthService-Logout -> ", error)
        throw error
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function checkVerified() {
    await axios
      .get("/check-verified")
      .then((response) => {
        handleRedirect(response.data.redirectTo, 0)
        return response.data.isVerified
      })
      .catch((error) => {
        console.error("AuthService-checkVerified -> ", error)
        throw error
      })
  }

  export function googleAuth() {
    handleRedirect("http://localhost:8000/auth/google", 0)
  }
}
