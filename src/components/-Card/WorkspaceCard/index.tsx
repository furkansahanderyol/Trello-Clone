import { WorkspaceType } from "@/store/types"
import styles from "./index.module.scss"
import { WorkspaceService } from "@/services/workspaceService"
import { PageLink } from "@/constants/PageLink"
import { useRouter } from "next/navigation"
import { Ellipsis, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import clsx from "clsx"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

export default function WorkspaceCard({ id, color, name }: WorkspaceType) {
  const router = useRouter()
  const optionsRef = useRef<HTMLDivElement | null>(null)
  const [optionListActive, setOptionListActive] = useState(false)

  useOnClickOutside(optionsRef, () => setOptionListActive(false))

  function handleWorkspaceRedirect() {
    try {
      WorkspaceService.getWorkspace(id)
      router.push(`${PageLink.workspace}/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  function handleDeleteWorkspace() {
    WorkspaceService.deleteWorkspace(id)
  }

  return (
    <div
      style={{
        background: color,
      }}
      className={styles.container}
    >
      <div ref={optionsRef} className={styles.options}>
        <div
          onClick={() => setOptionListActive(!optionListActive)}
          className={clsx(styles.ellipsis, optionListActive && styles.active)}
        >
          <Ellipsis />
        </div>

        <div
          className={clsx(
            styles.optionList,
            optionListActive && styles.listActive
          )}
        >
          <div
            onClick={handleDeleteWorkspace}
            className={styles.optionListItem}
          >
            <Trash2 width={16} height={16} />
            Delete workspace
          </div>
        </div>
      </div>
      <div onClick={handleWorkspaceRedirect} className={styles.wrapper}>
        <div className={styles.name}>{name}</div>
      </div>
    </div>
  )
}
