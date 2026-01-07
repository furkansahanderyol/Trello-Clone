import axios from "@/lib/axios"
import {
  allWorkspacesAtom,
  pageLoadingAtom,
  selectedWorkspaceAtom,
} from "@/store"
import { getDefaultStore } from "jotai"
import { toast } from "react-toastify"

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
        toast.error(
          "Something went wrong, please check your internet connection."
        )
        return
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
        toast.error(
          "Something went wrong, please check your internet connection."
        )
        return
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

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - inviteUsers ->", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function acceptWorkspaceInvite(
    workspaceId: string,
    email: string
  ) {
    try {
      const response = await axios.post("/accept-workspace-invite", {
        workspaceId,
        email,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - acceptWorkspaceInvite ->", error)
      return
    }
  }

  export async function getWorkspaceMembers(workspaceId: string) {
    try {
      const response = await axios.get(`/get-workspace-members/${workspaceId}`)

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - getWorkspaceMembers -> ", error)
      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function removeWorkspaceMember(
    workspaceId: string,
    email: string
  ) {
    try {
      const response = await axios.post("/remove-workspace-member", {
        workspaceId,
        email,
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - removeWorkspaceMember -> ", error)
      return
    }
  }

  export async function deleteWorkspace(workspaceId: string) {
    try {
      const response = await axios.delete(`/workspace-delete/${workspaceId}`)

      if (response.status === 200) {
        toast.success("Workspace deleted")
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - deleteWorkspace -> ", error)

      toast.error(
        "Something went wrong, please check your internet connection."
      )
      return
    }
  }

  export async function editWorkspace(
    workspaceId: string,
    name: string,
    selectedColor: string
  ) {
    try {
      const response = await axios.patch(`/workspace-edit/${workspaceId}`, {
        name,
        selectedColor,
      })

      if (response.status === 200) {
        toast.success("Workspace updated.")
        return response.data
      }
    } catch (error) {
      console.error("WorkspaceService - editWorkspace -> ", error)
      toast.error("Something went wrong.")
      return
    }
  }
}
