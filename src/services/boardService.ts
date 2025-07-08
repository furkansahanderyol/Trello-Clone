import axios from "@/lib/axios"
import { toast } from "react-toastify"

export namespace BoardService {
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
