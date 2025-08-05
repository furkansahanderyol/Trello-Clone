import axios from "@/lib/axios"
import { UploadImageResponse } from "./type"

export namespace TaskService {
  export async function uploadImage(
    workspaceId: string,
    boardId: string,
    taskId: string,
    files: Blob[]
  ): Promise<UploadImageResponse | undefined> {
    const data = new FormData()

    data.append("workspaceId", workspaceId)
    data.append("boardId", boardId)
    data.append("taskId", taskId)

    files.forEach((file) => {
      data.append("files", file)
    })

    try {
      const response = await axios.post(
        `/upload-task-image?taskId=${taskId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - uploadImage -> ", error)
      throw error
    }
  }
}
