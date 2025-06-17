import { atom } from "jotai"

export const testAtom = atom<string | undefined>(undefined)

// Global
export const loadingAtom = atom(false)
export const firstLoadAtom = atom(false)
export const modalContentAtom = atom<
  { title: string; content: React.ReactNode } | undefined
>()

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
