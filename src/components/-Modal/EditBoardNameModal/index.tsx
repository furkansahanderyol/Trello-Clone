import Input from "@/components/Input"
import styles from "./index.module.scss"
import { FormEvent, useState } from "react"
import Button from "@/components/Button"
import { toast } from "react-toastify"
import { useAtom } from "jotai"
import { modalContentAtom, selectedWorkspaceAtom, socketAtom } from "@/store"
import { BoardService } from "@/services/boardService"
import { UniqueIdentifier } from "@dnd-kit/core"

interface IProps {
  boardId: UniqueIdentifier
}

export default function EditBoardNameModal({ boardId }: IProps) {
  const [workspace] = useAtom(selectedWorkspaceAtom)
  const [, setModalContent] = useAtom(modalContentAtom)
  const [boardName, setBoardName] = useState("")

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (boardName === "" || !workspace) {
      toast.error("Board name cannot be empty.")
      return
    }

    BoardService.editBoardName(workspace?.id, boardId, boardName)
    setModalContent(undefined)
  }

  return (
    <form onSubmit={handleFormSubmit} className={styles.container}>
      <Input
        className={styles.input}
        label="Enter your new board name."
        onChange={(e) => setBoardName(e)}
      />

      <div className={styles.buttons}>
        <Button
          onClick={() => setModalContent(undefined)}
          type="button"
          text="Cancel"
        />
        <Button type="submit" text="Apply" />
      </div>
    </form>
  )
}
