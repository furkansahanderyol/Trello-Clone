import { atom, useAtom } from "jotai"
import { AllWorkspacesType, BoardType, WorkspaceType } from "./types"
import { UniqueIdentifier } from "@dnd-kit/core"

export const testAtom = atom<string | undefined>(undefined)

// Global
export const loadingAtom = atom(false)
export const firstLoadAtom = atom(false)
export const modalContentAtom = atom<
  | { title: string; content: React.ReactNode; size: "s" | "m" | "l" | "xl" }
  | undefined
>()
export const pageLoadingAtom = atom(false)

// User
export const userAtom = atom<
  | {
      name: string
      surname: string
      email: string
      profileImage: string | undefined
    }
  | undefined
>(undefined)
export const sendCodeTimerAtom = atom<number | undefined>(undefined)
export const sendCodeAnimationTimerAtom = atom<number | undefined>(undefined)

// Workspaces
export const allWorkspacesAtom = atom<AllWorkspacesType[]>([])
export const selectedWorkspaceAtom = atom<WorkspaceType | undefined>()
export const dragActiveAtom = atom(false)
export const activeIdAtom = atom<UniqueIdentifier | null>(null)
export const editTaskActiveAtom = atom(false)

// Boards
export const boardsAtom = atom<BoardType>([])
export const trackBoardsChangeAtom = atom(false)
