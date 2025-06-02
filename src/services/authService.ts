import { PageLink } from "@/constants/PageLink"
import { handleRedirect } from "@/helpers/handleRedirect"
import axios from "@/lib/axios"

interface RegisterPayload {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}

export namespace AuthService {
  export async function register(data: RegisterPayload) {
    await axios
      .post("/register", data)
      .then((response) => {
        handleRedirect(PageLink.dashboard, 1000)
        return response.data
      })
      .catch((error) => {
        console.error("AuthService-Register -> ", error)
      })
  }

  export async function login(email: string, password: string) {
    const response = await axios.post(
      "/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return response.data
  }
}
