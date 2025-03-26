import { createStore, Provider } from "jotai"

interface Props {
  children: React.ReactNode
}

const store = createStore()

export default function StoreProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
