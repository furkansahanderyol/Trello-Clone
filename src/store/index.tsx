import { atom } from "jotai"

export const testAtom = atom<string | undefined>(undefined)

// Global
export const loadingAtom = atom(false)
