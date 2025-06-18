"use client"

import { AuthService } from "@/services/authService"
import { userAtom } from "@/store"
import { getDefaultStore, useAtom } from "jotai"
import { useEffect } from "react"

export default function UserLoader() {
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    const getUser = async () => {
      const user = await AuthService.getUser()

      setUser(user)
    }

    getUser()
  }, [])

  return null
}
