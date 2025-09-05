import axios from "@/lib/axios"
import {
  allWorkspacesAtom,
  pageLoadingAtom,
  selectedWorkspaceAtom,
} from "@/store"
import { getDefaultStore } from "jotai"

const defaultStore = getDefaultStore()

export namespace WorkspaceService {
  export async function getAllWorkspaces() {
    defaultStore.set(pageLoadingAtom, true)

    await axios
      .get("/get-all-workspaces")
      .then((response) => {
        defaultStore.set(allWorkspacesAtom, response.data.workspaces)

        return response.data
      })
      .catch((error) => {
        console.error("BoardService - getAllWorkspaces -> ", error)
        throw error
      })
      .finally(() => {
        return defaultStore.set(pageLoadingAtom, false)
      })
  }

  export async function createWorkspace(name: string, color: string) {
    await axios
      .post("/create-workspace", {
        name,
        color,
      })
      .then((response) => {
        const newWorkspace = response.data.workspace

        defaultStore.set(allWorkspacesAtom, (prev) => [
          ...prev,
          newWorkspace[0],
        ])
      })
      .catch((error) => {
        console.error("WorkspaceService - createWorkspace -> ", error)
        throw error
      })
  }

  export async function getWorkspace(id: string) {
    defaultStore.set(pageLoadingAtom, true)

    await axios
      .get(`/get-workspace/${id}`)
      .then((response) => {
        defaultStore.set(selectedWorkspaceAtom, response.data)

        return response.data
      })
      .catch((error) => {
        console.error("WorkspaceService - getWorkspace -> ", error)
        throw error
      })
      .finally(() => {
        return defaultStore.set(pageLoadingAtom, false)
      })
  }

  export async function inviteUsers(
    workspaceId: string,
    invitedEmails: string[],
    message: string
  ) {
    try {
      const response = await axios.post("/invite-users", {
        workspaceId,
        invitedEmails,
        message,
      })
      console.log("responseBok", response)

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - inviteUsers ->", error)
      return
    }
  }
}
