"use client"

import { AuthService } from "@/services/authService"
import { UserService } from "@/services/userService"
import { notificationAtom, userAtom } from "@/store"
import { useAtom } from "jotai"
import { useEffect } from "react"

export default function UserLoader() {
  const [, setUser] = useAtom(userAtom)
  const [, setNotification] = useAtom(notificationAtom)

  useEffect(() => {
    const getUser = async () => {
      const user = await AuthService.getUser()

      setUser(user)
    }

    const getNotification = async () => {
      const notification = await UserService.getUserNotifications()

      setNotification(notification)
    }

    getUser()
    getNotification()
  }, [])

  return null
}
