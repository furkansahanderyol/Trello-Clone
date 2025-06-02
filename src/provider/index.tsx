"use client"

import { createStore, Provider } from "jotai"

interface Props {
  children: React.ReactNode
}

export default function StoreProvider({ children }: Props) {
  return <Provider>{children}</Provider>
}
