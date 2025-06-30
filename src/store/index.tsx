import { atom } from "jotai"
import { AllWorkspacesType, WorkspaceType } from "./types"

export const testAtom = atom<string | undefined>(undefined)

// Global
export const loadingAtom = atom(false)
export const firstLoadAtom = atom(false)
export const modalContentAtom = atom<
  { title: string; content: React.ReactNode } | undefined
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
