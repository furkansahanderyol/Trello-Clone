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
import Textarea from "@/components/Textarea"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { useAtom } from "jotai"
import { dragActiveAtom, editTaskActiveAtom } from "@/store"
interface IProps {
  id: UniqueIdentifier
  title: string
  isActive?: boolean
}

export default function SortableCardItem({ id, title, isActive }: IProps) {
  const [, setEditTaskActive] = useAtom(editTaskActiveAtom)
  const [, setDragActive] = useAtom(dragActiveAtom)
  const editTaskRef = useRef(null)
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

  useOnClickOutside(editTaskRef, () => {
    setEditMode(false)
    setEditTaskActive(false)
    setDragActive(false)
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(styles.container, isActive && styles.active)}
    >
      {editMode ? (
        <div
          ref={editTaskRef}
          className={clsx(
            styles.createBoard,
            editMode && styles.createBoardActive
          )}
        >
          <Textarea className={styles.textArea} />
          <div className={styles.buttons}>
            <Button
              type="button"
              text="Save"
              onClick={() => {
                setEditMode(false)
                setEditTaskActive(false)
                setDragActive(false)
              }}
            />
          </div>
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
            onMouseDown={() => {
              setEditMode(true)
              setEditTaskActive(true)
              setDragActive(true)
            }}
            className={styles.editButton}
          >
            <SquarePen />
          </div>
        </div>
      )}
    </div>
  )
}
