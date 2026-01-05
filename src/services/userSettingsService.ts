import axios from "@/lib/axios"
import { toast } from "react-toastify"

export namespace userSettingsService {
  export async function uploadProfileImage(imageBlob: Blob) {
    const formData = new FormData()
    formData.append("profileImage", imageBlob, "profile.jpg")

    axios
      .post("/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        console.error(error)
        toast.error(
          "Something went wrong, please check your internet connection."
        )
        return
      })
  }
}
