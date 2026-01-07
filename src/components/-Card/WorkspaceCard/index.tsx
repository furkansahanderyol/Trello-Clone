import { WorkspaceType } from "@/store/types"
import styles from "./index.module.scss"
import { WorkspaceService } from "@/services/workspaceService"
import { PageLink } from "@/constants/PageLink"
import { useRouter } from "next/navigation"
import { Edit, Ellipsis, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import clsx from "clsx"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { useAtom } from "jotai"
import { allWorkspacesAtom, modalContentAtom, socketAtom } from "@/store"
import EditWorkspaceModal from "@/components/-Modal/EditWorkspaceModal"

interface IProps {
  id: string
  color: string
  name: string
  onClick: () => void
}

export default function WorkspaceCard({ id, color, name, onClick }: IProps) {
  const router = useRouter()
  const optionsRef = useRef<HTMLDivElement | null>(null)
  const [optionListActive, setOptionListActive] = useState(false)
  const [socket] = useAtom(socketAtom)
  const [workspaces, setWorkspaces] = useAtom(allWorkspacesAtom)
  const [, setModalContent] = useAtom(modalContentAtom)

  useOnClickOutside(optionsRef, () => setOptionListActive(false))

  function handleEditWorkspace() {
    setModalContent({
      title: ``,
      size: "s",
      content: <EditWorkspaceModal />,
    })
  }

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

    socket?.on("workspace_list_updated", (data) =>
      setWorkspaces((previousWorkspaces) => {
        if (!data.workspaceId) return previousWorkspaces

        const updatedWorkspacesList = workspaces.filter(
          (workspace) => workspace.workspaceId !== data.workspaceId
        )

        return updatedWorkspacesList
      })
    )
  }

  return (
    <div
      onClick={onClick}
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
          <div onClick={handleEditWorkspace} className={styles.optionListItem}>
            <Edit width={16} height={16} />
            Edit workspace
          </div>
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
