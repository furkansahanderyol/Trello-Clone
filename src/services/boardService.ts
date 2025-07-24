import axios from "@/lib/axios"
import { boardsAtom, loadingAtom } from "@/store"
import { BoardType } from "@/store/types"
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

  export async function updateBoard(
    workspaceId: string,
    updatedBoards: [...BoardType]
  ) {
    console.log("updateBoardsReq", updatedBoards)

    axios
      .patch("/update-board", {
        workspaceId,
        updatedBoards,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateBoard -> ", error)

        throw error
      })
  }

  export async function addTask(title: string, boardId: string) {
    axios
      .post("/add-task", {
        title,
        boardId,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateBoard -> ", error)

        throw error
      })
  }

  export async function updateTaskName(title: string, id: string) {
    axios
      .patch("/update-task", {
        title: title,
        id: id,
      })
      .then((response) => {})
      .catch((error) => {
        console.error("BoardService - updateTaskName -> ", error)
      })
  }
}
