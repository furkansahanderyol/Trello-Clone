"use client"

import getCookie from "@/helpers/getCookie"
import { UserService } from "@/services/userService"
import { socketAtom } from "@/store"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { io } from "socket.io-client"

interface IProps {
  children: React.ReactNode
}

export default function SocketProvider({ children }: IProps) {
  const [socket, setSocket] = useAtom(socketAtom)

  useEffect(() => {
    const token = getCookie("socket-token")

    const socket = io("http://localhost:8000", {
      auth: { token: token },
      autoConnect: true,
    })

    if (socket) {
      setSocket(socket)
    }

    return () => {
      socket?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on("connect", () => {
      socket.on("invite_users", (response) => {
        UserService.getUserNotifications().then((apiResponse) => {})
      })
    })

    return () => {
      socket.off("invite_users")
    }
  }, [socket])

  return children
}
