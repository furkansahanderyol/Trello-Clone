import Button from "@/components/Button"
import styles from "./index.module.scss"
import { useAtom } from "jotai"
import { modalContentAtom } from "@/store"

interface IProps {
  message: string
}

export default function WorkspaceDeletionNotificationModal({
  message,
}: IProps) {
  const [, setModalContent] = useAtom(modalContentAtom)

  return (
    <div className={styles.container}>
      <div className={styles.message}>{message}</div>
      <Button
        onClick={() => setModalContent(undefined)}
        type="button"
        text="Close"
        className={styles.button}
      />
    </div>
  )
}
