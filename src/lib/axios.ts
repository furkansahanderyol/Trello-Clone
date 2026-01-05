import axios from "axios"
import { toast } from "react-toastify"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || "Bir hata oluştu"

    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("Session expired. Please log in again.")
          break
        case 403:
          toast.error(
            "Access denied. You don't have permission for this action."
          )
          break
        case 404:
          toast.error("The requested resource was not found.")
          break
        case 500:
          toast.error("Internal server error. Please try again later.")
          break
        default:
          toast.error(message)
      }
    } else if (error.request) {
      toast.error("Network error. Please check your internet connection.")
    } else {
      toast.error("Request setup error.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
