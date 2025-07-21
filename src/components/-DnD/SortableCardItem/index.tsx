import { UniqueIdentifier } from "@dnd-kit/core"
import styles from "./index.module.scss"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FormEvent, useRef, useState } from "react"
import { SquarePen } from "lucide-react"
import Button from "@/components/Button"
import { BoardService } from "@/services/boardService"
import clsx from "clsx"
import Textarea from "@/components/Textarea"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { useAtom } from "jotai"
import {
  dragActiveAtom,
  editTaskActiveAtom,
  trackBoardsChangeAtom,
} from "@/store"
interface IProps {
  id: UniqueIdentifier
  title: string
  isActive?: boolean
}

export default function SortableCardItem({ id, title, isActive }: IProps) {
  const [, setEditTaskActive] = useAtom(editTaskActiveAtom)
  const [, setDragActive] = useAtom(dragActiveAtom)
  const editTaskRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  const [checkboxVisible, setCheckboxVisible] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [trackBoardsChange, setTrackBoardsChange] = useAtom(
    trackBoardsChangeAtom
  )

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useOnClickOutside(editTaskRef, () => {
    setEditMode(false)
    setEditTaskActive(false)
    setDragActive(false)
  })

  function handleEditTaskName(e: FormEvent) {
    e.preventDefault()

    BoardService.updateTaskName(newTitle, id as string)
    setTrackBoardsChange(!trackBoardsChange)
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
        <form
          onSubmit={handleEditTaskName}
          ref={editTaskRef}
          className={clsx(
            styles.createBoard,
            editMode && styles.createBoardActive
          )}
        >
          <Textarea
            className={styles.textArea}
            onChange={(e) => setNewTitle(e)}
          />
          <div className={styles.buttons}>
            <Button type="submit" text="Save" />
          </div>
        </form>
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
