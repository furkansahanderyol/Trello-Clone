import { PageLink } from "@/constants/PageLink"
import axios from "axios"
import { getDefaultStore } from "jotai"
import Router from "next/navigation"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export default axiosInstance
