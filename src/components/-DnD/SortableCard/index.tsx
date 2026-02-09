import { UniqueIdentifier } from "@dnd-kit/core"
import styles from "./index.module.scss"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import SortableCardItem from "../SortableCardItem"
import { useAtom } from "jotai"
import {
  activeIdAtom,
  boardsAtom,
  modalContentAtom,
  socketAtom,
  userAtom,
} from "@/store"
import clsx from "clsx"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import Textarea from "@/components/Textarea"
import Button from "@/components/Button"
import { Edit, Ellipsis, Plus, Trash2 } from "lucide-react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { BoardService } from "@/services/boardService"
import { toast } from "react-toastify"
import { useMouseMove } from "@/hooks/useMouseMove"
import { BoardType, LabelType } from "@/store/types"
import { useParams } from "next/navigation"
import Input from "@/components/Input"
import EditBoardNameModal from "@/components/-Modal/EditBoardNameModal"

interface IProps {
  id: UniqueIdentifier
  cardHeader: string
  cardItems: {
    id: UniqueIdentifier
    title: string
    boardId: string
    labels: LabelType[]
  }[]
  data: BoardType
}

export default function SortableCard({
  id,
  cardHeader,
  cardItems,
  data,
}: IProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    active,
    over,
  } = useSortable({ id: id })
  const addTaskModeRef = useRef(null)
  const optionsListRef = useRef(null)
  const [activeId] = useAtom(activeIdAtom)
  const params = useParams()
  const [addTaskMode, setAddTaskMode] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const restrictedTransform = transform ? { ...transform, y: 0 } : null
  const [mouseY, setMouseY] = useState<number | undefined>(undefined)
  const [user] = useAtom(userAtom)
  const [socket] = useAtom(socketAtom)
  const [, setBoards] = useAtom(boardsAtom)
  const [optionsActive, setOptionsActive] = useState(false)
  const [, setModalContent] = useAtom(modalContentAtom)

  const style = {
    transform: CSS.Transform.toString(restrictedTransform),
    transition,
  }
  useOnClickOutside(addTaskModeRef, () => setAddTaskMode(false))
  useOnClickOutside(optionsListRef, () => setOptionsActive(false))

  function handleAddTask(e: FormEvent) {
    e.preventDefault()

    if (taskTitle.length <= 0) {
      return toast.error("Task title must be provided.")
    }

    if (!user) {
      return toast.error("User cannot be found.")
    }

    BoardService.addTask(params.id as string, taskTitle, id as string, user)
    setTaskTitle("")
    setAddTaskMode(false)
  }

  useEffect(() => {
    if (!socket) return

    socket.on("task_created", (newTask) => {
      setBoards((prevBoards) => {
        return prevBoards.map((board) => {
          if (board.id === newTask.boardId) {
            const exists = board.tasks.some((t) => t.id === newTask.id)
            if (exists) return board

            return {
              ...board,
              tasks: [...board.tasks, newTask],
            }
          }
          return board
        })
      })
    })
  }, [])

  useMouseMove((e) => {
    if (!over) return
    return setMouseY(e.clientY)
  })

  const checkSameList = useMemo(() => {
    const isSameList = data
      .filter((board) => board.id === id)[0]
      .tasks.find((item) => item.id === active?.id)

    return isSameList
  }, [id, active, cardItems])

  useEffect(() => {
    console.log("optionsActive", optionsActive)
  }, [optionsActive])

  const checkIsAbove = useMemo(() => {
    const activeItemY = active?.rect.current.translated?.top
    const overItemY = over?.rect.top

    if (!activeItemY || !overItemY) return

    if (overItemY < activeItemY) {
      return true
    }

    if (overItemY > activeItemY) {
      return false
    }
  }, [over, active, mouseY])

  return (
    <SortableContext items={cardItems} strategy={verticalListSortingStrategy}>
      <div
        style={style}
        className={clsx(
          styles.container,
          cardItems.length > 0 && styles.containerPadding,
        )}
      >
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={styles.header}
        >
          {cardHeader}
          <div ref={optionsListRef} className={styles.options}>
            <div
              onClick={() => setOptionsActive(!optionsActive)}
              className={styles.optionsListTrigger}
            >
              <Ellipsis />
            </div>
            <div
              className={clsx(
                styles.optionsList,
                optionsActive && styles.active,
              )}
            >
              <div
                onClick={() =>
                  setModalContent({
                    title: `Edit ${cardHeader}`,
                    size: "s",
                    content: <EditBoardNameModal />,
                  })
                }
                className={styles.option}
              >
                <Edit />
                Edit
              </div>
              <div className={styles.option}>
                <Trash2 />
                Delete
              </div>
            </div>
          </div>
        </div>
        <div className={clsx(styles.tasks, addTaskMode && styles.extend)}>
          {cardItems.map((item, index) => {
            return (
              <div key={item.id}>
                {/* {isEmptyList && (
                  <div className={clsx(styles.shadow, styles.marginBottom)} />
                )} */}
                {!checkSameList &&
                  item.id === over?.id &&
                  cardItems.length - 1 === index &&
                  !checkIsAbove && (
                    <div className={clsx(styles.shadow, styles.marginBottom)} />
                  )}

                {!checkSameList &&
                  item.id === over?.id &&
                  activeId !== over.id &&
                  cardItems.length - 1 !== index && (
                    <div className={clsx(styles.shadow, styles.marginBottom)} />
                  )}

                <SortableCardItem
                  key={item.id}
                  id={item.id}
                  boardId={id as string}
                  title={item.title}
                  isActive={item.id === activeId}
                  labels={item.labels}
                />

                {!checkSameList &&
                  item.id === over?.id &&
                  cardItems.length - 1 === index &&
                  checkIsAbove && (
                    <div className={clsx(styles.shadow, styles.marginTop)} />
                  )}
              </div>
            )
          })}
        </div>
        <div
          className={clsx(styles.addTask, addTaskMode && styles.addTaskActive)}
        >
          {addTaskMode ? (
            <form
              onSubmit={handleAddTask}
              ref={addTaskModeRef}
              className={styles.wrapper}
            >
              <Textarea onChange={(e) => setTaskTitle(e)} />
              <div className={styles.buttons}>
                <Button type="submit" text="Save" />
                <Button
                  type="button"
                  text="Cancel"
                  onClick={() => setAddTaskMode(false)}
                />
              </div>
            </form>
          ) : (
            <div
              className={styles.addTaskText}
              onClick={() => setAddTaskMode(true)}
            >
              <Plus />
              Add task
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  )
}
