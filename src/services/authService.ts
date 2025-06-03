import { PageLink } from "@/constants/PageLink"
import { handleRedirect } from "@/helpers/handleRedirect"
import axios from "@/lib/axios"
import { loadingAtom } from "@/store"
import { getDefaultStore } from "jotai"

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
      .post("/register", data)
      .then((response) => {
        handleRedirect(
          `${PageLink.registerSuccess}?email=${encodeURIComponent(
            response.data.user.email
          )}`,
          200
        )
        return response.data
      })
      .catch((error) => {
        console.error("AuthService-Register -> ", error)
        throw error
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }

  export async function login(email: string, password: string) {
    const response = await axios.post("/login", { email, password })

    return response.data
  }

  export async function verify(email: string, code: string) {
    defaultStore.set(loadingAtom, true)

    await axios
      .post("/register-success", { email, code })
      .then((response) => {
        if (response.status) {
          handleRedirect(PageLink.dashboard, 200)
          return response.data
        }
      })
      .catch((error) => {
        console.error("AuthService-Verify -> ", error)
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
        return response.data
      })
      .catch((error) => {
        console.error("AuthService - ResendVerification -> ", error)
      })
      .finally(() => {
        defaultStore.set(loadingAtom, false)
      })
  }
}
