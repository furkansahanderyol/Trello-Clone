import { useAtom } from "jotai"
import styles from "./index.module.scss"
import { dragActiveAtom } from "@/store"
import clsx from "clsx"

interface IProps {
  children: React.ReactNode
}

export default function Sidebar({ children }: IProps) {
  const [dragActive] = useAtom(dragActiveAtom)

  return (
    <div className={clsx(styles.container, dragActive && styles.dragActive)}>
      {children}
    </div>
  )
}
