import { atom } from "jotai"
import {
  AllWorkspacesType,
  BoardType,
  LabelType,
  NotificationsDataType,
  TaskType,
  UserType,
  WorkspaceMember,
  WorkspaceType,
} from "./types"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Socket } from "socket.io-client"

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
export const userAtom = atom<UserType | undefined>(undefined)
export const sendCodeTimerAtom = atom<number | undefined>(undefined)
export const sendCodeAnimationTimerAtom = atom<number | undefined>(undefined)

// Workspaces
export const allWorkspacesAtom = atom<AllWorkspacesType[]>([])
export const selectedWorkspaceAtom = atom<WorkspaceType | undefined>()
export const dragActiveAtom = atom(false)
export const activeIdAtom = atom<UniqueIdentifier | null>(null)
export const editTaskActiveAtom = atom(false)
export const workspaceMembersAtom = atom<WorkspaceMember[] | null>(null)

// Boards
export const boardsAtom = atom<BoardType>([])

// Task
export const taskAtom = atom<TaskType | undefined>(undefined)
export const editTaskAtom = atom(false)
export const taskLabelsAtom = atom<LabelType[] | undefined>(undefined)

// Socket
export const socketAtom = atom<Socket | undefined>(undefined)

// Notifications
export const notificationAtom = atom<NotificationsDataType | undefined>(
  undefined
)
export const notificationAlertAtom = atom(false)
