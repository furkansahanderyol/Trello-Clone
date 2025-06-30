import { WorkspaceType } from "@/store/types"
import styles from "./index.module.scss"
import { WorkspaceService } from "@/services/workspaceService"
import { PageLink } from "@/constants/PageLink"
import { useRouter } from "next/navigation"

export default function WorkspaceCard({ id, color, name }: WorkspaceType) {
  const router = useRouter()

  function handleWorkspaceRedirect() {
    try {
      WorkspaceService.getWorkspace(id)

      router.push(`${PageLink.workspace}/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      onClick={handleWorkspaceRedirect}
      style={{
        background: color,
      }}
      className={styles.container}
    >
      <div className={styles.name}>{name}</div>
    </div>
  )
}
