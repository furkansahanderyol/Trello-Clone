import axios from "@/lib/axios"
import { UploadImageResponse } from "./type"
import { JSONContent } from "@tiptap/react"
export namespace TaskService {
  export async function getTaskData(
    workspaceId: string,
    boardId: string,
    taskId: string
  ) {
    try {
      const response = await axios.post("/get-task-data", {
        workspaceId,
        boardId,
        taskId,
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - getTaskData ->", error)
      throw error
    }
  }

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
        `/upload-task-image?boardId=${boardId}`,
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

  export async function uploadDescription(
    workspaceId: string,
    boardId: string,
    taskId: string,
    description: JSONContent
  ) {
    try {
      const response = await axios.patch("/upload-task-description", {
        workspaceId,
        boardId,
        taskId,
        description,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - uploadDescription -> ", error)
      throw error
    }
  }
}
