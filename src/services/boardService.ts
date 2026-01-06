import axios from "@/lib/axios"
import { boardsAtom, loadingAtom } from "@/store"
import { UserType } from "@/store/types"
import { getDefaultStore } from "jotai"
import { toast } from "react-toastify"

const defaultStore = getDefaultStore()
export namespace BoardService {
  export async function getAllBoards(workspaceId: string) {
    defaultStore.set(loadingAtom, true)

    axios
      .get(`/boards/${workspaceId}`)
      .then((response) => {
        if (response.status === 200) {
          defaultStore.set(boardsAtom, response.data.boards)
          return response.data
        }
      })
      .catch((error) => {
        console.error("BoardService - getAllBoards", error)
        toast.error(
          "Something went wrong, please check your internet connection."
        )
        return
      })
      .finally(() => {
        return defaultStore.set(loadingAtom, false)
      })
  }

  export async function createBoard(workspaceId: string, title: string) {
    axios
      .post("/create-board", { workspaceId, title })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message)
          return response.data
        }
      })
      .catch((error) => {
        console.error("BoardService - createBoard -> ", error)
        toast.error(
          "Something went wrong, please check your internet connection."
        )
        return
      })
  }

  export async function updateBoardTasks(
    workspaceId: string,
    taskId: string,
    previousBoardId: string,
    newBoardId: string,
    oldIndex: number,
    newIndex: number
  ) {
    try {
      const response = await axios.patch("/update-board-tasks", {
        workspaceId,
        taskId,
        previousBoardId,
        newBoardId,
        oldIndex,
        newIndex,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("BoardService - updateBoard -> ", error)

      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function addTask(
    workspaceId: string,
    title: string,
    boardId: string,
    user: UserType
  ) {
    try {
      const response = await axios.post("/add-task", {
        workspaceId,
        title,
        boardId,
        user,
      })

      if (response.status === 200) {
        toast.success("Task created successfully.")
        return response.data
      }
    } catch (error) {
      console.error("BoardService - updateBoard -> ", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function updateTaskName(
    workspaceId: string,
    title: string,
    id: string
  ) {
    const response = await axios.patch("/update-task", {
      workspaceId: workspaceId,
      title: title,
      id: id,
    })
    if (response.status === 200) {
      return response.data
    }
  }

  export async function updateBoardOrders(
    workspaceId: string,
    boardId: string,
    newOrder: number
  ) {
    try {
      const response = await axios.patch("/update-board-orders", {
        workspaceId,
        boardId,
        newOrder,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("BoardService - updateBoardOrders ->", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }
}
