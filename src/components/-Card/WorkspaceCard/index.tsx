import { WorkspaceType } from "@/store/types"
import styles from "./index.module.scss"
import Link from "next/link"

export default function WorkspaceCard({ id, color, name }: WorkspaceType) {
  return (
    <Link
      href={"#"}
      style={{
        background: color,
      }}
      className={styles.container}
    >
      <div className={styles.name}>{name}</div>
    </Link>
  )
}
