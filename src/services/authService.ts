import axios from "@/lib/axios"

interface RegisterPayload {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}

export async function register(data: RegisterPayload) {
  const response = await axios.post("/register", data)

  return response.data
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
