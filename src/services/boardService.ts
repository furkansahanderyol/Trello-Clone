import axios from "@/lib/axios"
import { boardsAtom, loadingAtom } from "@/store"
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
}
