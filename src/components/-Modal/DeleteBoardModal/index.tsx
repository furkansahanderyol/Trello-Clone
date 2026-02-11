import Button from "@/components/Button"
import styles from "./index.module.scss"
import { FormEvent } from "react"
import { BoardService } from "@/services/boardService"
import { useAtom } from "jotai"
import { modalContentAtom, selectedWorkspaceAtom } from "@/store"

interface IProps {
  boardId: string
}

export default function DeleteBoardModal({ boardId }: IProps) {
  const [workspace] = useAtom(selectedWorkspaceAtom)
  const [, setModalContent] = useAtom(modalContentAtom)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!workspace) return

    BoardService.deleteBoard(workspace?.id, boardId)
    setModalContent(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.text}>Are you sure to delete your board?</div>
      <div className={styles.buttons}>
        <Button
          onClick={() => setModalContent(undefined)}
          type="button"
          text="Cancel"
        />
        <Button type="submit" text="Confirm" />
      </div>
    </form>
  )
}
