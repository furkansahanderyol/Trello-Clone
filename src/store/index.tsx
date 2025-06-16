import { atom } from "jotai"

export const testAtom = atom<string | undefined>(undefined)

// Global
export const loadingAtom = atom(false)

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
