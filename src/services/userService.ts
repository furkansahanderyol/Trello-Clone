import axios from "@/lib/axios"
import { toast } from "react-toastify"

export namespace UserService {
  export async function searchUser(input: string) {
    try {
      const response = await axios.post("/search-user", { input })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("UserService - searchUser", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function getUserNotifications() {
    try {
      const response = await axios.get("/user-notifications")
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("UserService - getUserNotifications -> ", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function markNotificationAsRead(notificationId: string) {
    try {
      const response = await axios.patch(
        `/notifications/read/${notificationId}`
      )

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("UserService - markNotificationAsRead -> ", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }
}
