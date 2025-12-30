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
        toast.error(error.message)
        console.error("BoardService - getAllBoards", error)
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
        throw error
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
    axios
      .patch("/update-board-tasks", {
        workspaceId,
        taskId,
        previousBoardId,
        newBoardId,
        oldIndex,
        newIndex,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateBoard -> ", error)

        throw error
      })
  }

  export async function addTask(
    workspaceId: string,
    title: string,
    boardId: string,
    user: UserType
  ) {
    axios
      .post("/add-task", {
        workspaceId,
        title,
        boardId,
        user,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateBoard -> ", error)

        throw error
      })
  }

  export async function updateTaskName(
    workspaceId: string,
    title: string,
    id: string
  ) {
    axios
      .patch("/update-task", {
        workspaceId: workspaceId,
        title: title,
        id: id,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateTaskName -> ", error)
      })
  }

  export async function updateBoardOrders(
    workspaceId: string,
    boardId: string,
    newOrder: number
  ) {
    axios
      .patch("/update-board-orders", { workspaceId, boardId, newOrder })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateBoardOrders ->", error)
        throw error
      })
  }
}
