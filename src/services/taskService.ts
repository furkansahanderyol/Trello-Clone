import axios from "@/lib/axios"
import { UploadImageResponse } from "./type"
import { JSONContent } from "@tiptap/react"
import { UserType } from "@/store/types"
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

  export async function taskComment(
    workspaceId: string,
    boardId: string,
    taskId: string,
    comment: JSONContent,
    user: UserType
  ) {
    try {
      const response = await axios.post("/task-comment", {
        workspaceId,
        boardId,
        taskId,
        comment,
        user,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - taskComment -> ", error)
      throw error
    }
  }

  export async function deleteTaskComment(
    workspaceId: string,
    boardId: string,
    taskId: string,
    commentId: string
  ) {
    try {
      const response = await axios.post("/delete-task-comment", {
        workspaceId,
        boardId,
        taskId,
        commentId,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - taskComment -> ", error)
      throw error
    }
  }

  export async function updateTaskComment(
    workspaceId: string,
    boardId: string,
    taskId: string,
    commentId: string,
    comment: JSONContent
  ) {
    try {
      const response = await axios.patch("/update-task-comment", {
        workspaceId,
        boardId,
        taskId,
        commentId,
        comment,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - updateTaskComment -> ", comment)
      throw error
    }
  }

  export async function getTaskLabels(
    workspaceId: string,
    boardId: string,
    taskId: string
  ) {
    try {
      const response = await axios.post("/get-task-labels", {
        workspaceId,
        boardId,
        taskId,
      })

      return response.data
    } catch (error) {
      console.error("TaskService - createTaskLabel -> ", error)
    }
  }

  export async function createTaskLabel(
    workspaceId: string,
    boardId: string,
    taskId: string,
    labelName: string,
    labelColor: string
  ) {
    console.log("labelColor", labelColor)
    try {
      const response = await axios.post("/create-task-label", {
        workspaceId,
        boardId,
        taskId,
        labelName,
        labelColor,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - createTaskLabel -> ", error)
    }
  }

  export async function editTaskLabel(
    workspaceId: string,
    boardId: string,
    taskId: string,
    labelId: string,
    labelName: string,
    labelColor: string
  ) {
    try {
      const response = await axios.patch("/edit-task-label", {
        workspaceId,
        boardId,
        taskId,
        labelId,
        labelName,
        labelColor,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - editTaskLabel -> ", error)
    }
  }

  export async function deleteTaskLabel(
    workspaceId: string,
    boardId: string,
    taskId: string,
    labelId: string
  ) {
    try {
      const response = await axios.post("/delete-task-label", {
        workspaceId,
        boardId,
        taskId,
        labelId,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("TaskService - editTaskLabel -> ", error)
    }
  }
}
