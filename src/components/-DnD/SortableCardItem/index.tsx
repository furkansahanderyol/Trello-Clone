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
  modalContentAtom,
  taskLabelsAtom,
  trackBoardsChangeAtom,
} from "@/store"
import TaskModal from "@/components/-Modal/TaskModal"
import { LabelType } from "@/store/types"
import { TaskService } from "@/services/taskService"
import { useParams } from "next/navigation"
interface IProps {
  id: UniqueIdentifier
  title: string
  isActive?: boolean
  boardId: string
  labels: LabelType[]
}

export default function SortableCardItem({
  id,
  title,
  isActive,
  boardId,
  labels,
}: IProps) {
  const params = useParams()
  const [, setEditTaskActive] = useAtom(editTaskActiveAtom)
  const [, setDragActive] = useAtom(dragActiveAtom)
  const [taskLabels, setTaskLabels] = useAtom(taskLabelsAtom)
  const editTaskRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [trackBoardsChange, setTrackBoardsChange] = useAtom(
    trackBoardsChangeAtom
  )
  const [, setModalContent] = useAtom(modalContentAtom)

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
    setEditMode(false)
    setEditTaskActive(false)
    setDragActive(false)
  }

  function handleTaskModal() {
    setModalContent({
      title: title,
      content: (
        <TaskModal title={title} taskId={id as string} boardId={boardId} />
      ),
      size: "l",
    })

    TaskService.getLabelStatus(params.id as string, id as string).then(
      (response) => {
        setTaskLabels(response.labels)
      }
    )
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
        <div className={styles.wrapper}>
          <div onClick={handleTaskModal} className={styles.titleWrapper}>
            <div className={styles.boardNameSide}>
              <div>{title}</div>
            </div>

            <div className={styles.labelsWrapper}>
              {labels.map((data) => {
                return (
                  <div
                    key={data.label.id}
                    className={styles.label}
                    style={{ backgroundColor: data.label.color }}
                  />
                )
              })}
            </div>
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
