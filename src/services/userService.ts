import axios from "@/lib/axios"

export namespace UserService {
  export async function searchUser(input: string) {
    try {
      const response = await axios.post("/search-user", { input })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("UserService - searchUser", error)
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
    }
  }
}
