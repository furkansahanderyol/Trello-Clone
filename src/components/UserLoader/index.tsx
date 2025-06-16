"use client"

import { AuthService } from "@/services/authService"
import { userAtom } from "@/store"
import { getDefaultStore } from "jotai"
import { useEffect } from "react"

export default function UserLoader() {
  const user = getDefaultStore().get(userAtom)

  useEffect(() => {
    AuthService.getUser()
  }, [user])

  return null
}
