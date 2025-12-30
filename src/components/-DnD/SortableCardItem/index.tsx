import { UniqueIdentifier } from "@dnd-kit/core"
import styles from "./index.module.scss"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FormEvent, useEffect, useRef, useState } from "react"
import { SquarePen } from "lucide-react"
import Button from "@/components/Button"
import { BoardService } from "@/services/boardService"
import clsx from "clsx"
import Textarea from "@/components/Textarea"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { useAtom } from "jotai"
import {
  boardsAtom,
  dragActiveAtom,
  editTaskActiveAtom,
  modalContentAtom,
  socketAtom,
  taskLabelsAtom,
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
  const [socket] = useAtom(socketAtom)
  const [, setBoards] = useAtom(boardsAtom)
  const [, setEditTaskActive] = useAtom(editTaskActiveAtom)
  const [, setDragActive] = useAtom(dragActiveAtom)
  const [, setTaskLabels] = useAtom(taskLabelsAtom)
  const editTaskRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  const [newTitle, setNewTitle] = useState("")

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

    BoardService.updateTaskName(params.id as string, newTitle, id as string)
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

  useEffect(() => {
    socket?.on("task_name_updated", (updatedTask) => {
      setBoards((prevBoards) => {
        return prevBoards.map((board) => {
          const hasTask = board.tasks.some((t) => t.id === updatedTask.id)

          if (!hasTask) return board

          return {
            ...board,
            tasks: board.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          }
        })
      })
    })
  }, [])

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
              {labels &&
                labels.map((data) => {
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
