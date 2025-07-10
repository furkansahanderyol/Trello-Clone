import { UniqueIdentifier } from "@dnd-kit/core"
import styles from "./index.module.scss"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useRef, useState } from "react"
import { SquarePen } from "lucide-react"
import Button from "@/components/Button"
import { BoardService } from "@/services/boardService"
import { useParams } from "next/navigation"
import clsx from "clsx"

interface IProps {
  id: UniqueIdentifier
  title: string
  isActive?: boolean
}

export default function SortableCardItem({ id, title, isActive }: IProps) {
  const boardNameRef = useRef<HTMLTextAreaElement | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [checkboxVisible, setCheckboxVisible] = useState(false)

  const params = useParams()

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleCreateBoard() {
    if (boardNameRef.current) {
      const newBoardName = boardNameRef.current.value

      if (newBoardName === "" || !params.id) return

      BoardService.createBoard(params.id as string, newBoardName)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(styles.container, isActive && styles.active)}
    >
      {editMode ? (
        <div className={styles.createBoard}>
          <textarea ref={boardNameRef}></textarea>
          <Button
            type="button"
            text="Save"
            onClick={() => setEditMode(false)}
          />
        </div>
      ) : (
        <div
          className={styles.wrapper}
          onMouseEnter={() => setCheckboxVisible(true)}
          onMouseLeave={() => setCheckboxVisible(false)}
        >
          <div className={styles.boardNameSide}>
            <input
              className={clsx(
                styles.checkbox,
                checkboxVisible && styles.checkboxVisible
              )}
              type="checkbox"
            />
            <div>{title}</div>
          </div>

          <div
            onMouseDown={() => setEditMode(true)}
            style={{
              backgroundColor: "red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
            }}
          >
            <SquarePen />
          </div>
        </div>
      )}
    </div>
  )
}
