import { useAtom } from "jotai"
import styles from "./index.module.scss"
import { modalContentAtom, userAtom } from "@/store"
import Button from "@/components/Button"
import { WorkspaceService } from "@/services/workspaceService"

interface IProps {
  type: "workspace-invite" | "board-update"
  message: string
  workspaceId: string
}

export default function NotificationModal({
  type,
  message,
  workspaceId,
}: IProps) {
  const [user] = useAtom(userAtom)
  const [modalContent, setModalContent] = useAtom(modalContentAtom)

  console.log("workspaceId", workspaceId)
  return (
    <div className={styles.container}>
      <div className={styles.message}>{message}</div>

      {type === "workspace-invite" && (
        <div className={styles.buttons}>
          <Button type="button" text="Decline" className={styles.button} />
          <Button
            type="button"
            text="Accept"
            className={styles.button}
            onClick={() =>
              WorkspaceService.acceptWorkspaceInvite(workspaceId, user?.email!)
            }
          />
        </div>
      )}
    </div>
  )
}
