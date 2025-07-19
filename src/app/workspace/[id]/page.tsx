"use client"

import styles from "./page.module.scss"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import {
  activeIdAtom,
  boardsAtom,
  dragActiveAtom,
  editTaskActiveAtom,
  overTaskItemAtom,
  trackBoardsChangeAtom,
} from "@/store"
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useAtom } from "jotai"
import { useCallback, useMemo, useState } from "react"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import SortableCard from "@/components/-DnD/SortableCard"
import SortableCardItem from "@/components/-DnD/SortableCardItem"
import Textarea from "@/components/Textarea"
import { Plus } from "lucide-react"
import Button from "@/components/Button"
import clsx from "clsx"
import { BoardService } from "@/services/boardService"
import { toast } from "react-toastify"
import { useParams } from "next/navigation"

export default function Workspace() {
  const [boards, setBoards] = useAtom(boardsAtom)
  const [, setDragActive] = useAtom(dragActiveAtom)
  const [, setOverTaskItem] = useAtom(overTaskItemAtom)
  const [editTaskActive] = useAtom(editTaskActiveAtom)
  const [activeId, setActiveId] = useAtom(activeIdAtom)
  const [addNewList, setAddNewList] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [trackBoardsChange, setTrackBoardsChange] = useAtom(
    trackBoardsChangeAtom
  )
  const params = useParams()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 20 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e

      if (!over || active.id === over.id) return

      const activeListIndex = boards.findIndex((list) => list.id === active.id)
      const overListIndex = boards.findIndex((list) => list.id === over.id)

      // Changes order of the lists
      if (activeListIndex !== -1 && overListIndex !== -1) {
        const newList = arrayMove(boards, activeListIndex, overListIndex)
        setBoards(newList)
        return
      }

      const activeTaskListIndex = boards.findIndex((list) =>
        list.tasks.some((task) => task.id === active.id)
      )

      const overTaskListIndex = boards.findIndex((list) =>
        list.tasks.some((task) => {
          return task.id === over.id
        })
      )

      // Aborts when task or target task cannot be found
      if (activeTaskListIndex === -1) return

      // If task carried to the new list
      if (overTaskListIndex === -1) {
        const overListOnlyIndex = boards.findIndex(
          (list) => list.id === over.id
        )

        if (overListOnlyIndex !== -1) {
          const activeList = boards[activeTaskListIndex]
          const taskToMove = activeList.tasks.find(
            (task) => task.id === active.id
          )!

          const newActiveTasks = activeList.tasks.filter(
            (task) => task.id !== active.id
          )

          const newData = [...boards]
          newData[activeTaskListIndex] = {
            ...activeList,
            tasks: newActiveTasks,
          }

          const newOverTasks = [...newData[overListOnlyIndex].tasks, taskToMove]

          newData[overListOnlyIndex] = {
            ...newData[overListOnlyIndex],
            tasks: newOverTasks,
          }

          setBoards(newData)
          return
        }
      }

      // If task is in the same list
      if (activeTaskListIndex === overTaskListIndex) {
        const list = boards[activeTaskListIndex]
        const oldIndex = list.tasks.findIndex((task) => task.id === active.id)
        const newIndex = list.tasks.findIndex((task) => task.id === over.id)

        const newTasks = arrayMove(list.tasks, oldIndex, newIndex)
        const newData = [...boards]
        newData[activeTaskListIndex] = { ...list, tasks: newTasks }
        setBoards(newData)
      } else {
        // If task is in another list
        const activeList = boards[activeTaskListIndex]
        const overList = boards[overTaskListIndex]
        const activeRect = active.rect.current?.translated
        const overRect = over.rect

        const task = activeList.tasks.filter((task) => task.id === active.id)
        const oldTasks = activeList.tasks.filter(
          (task) => task.id !== active.id
        )

        if (!activeRect || !overRect) return
        const activeItemCenterY = activeRect.top + activeRect.height / 2
        const overItemCenterY = overRect.top + overRect.height / 2
        const isAbove = activeItemCenterY < overItemCenterY

        const overItemIndex = overList.tasks.findIndex(
          (task) => task.id === over.id
        )

        const newTasks = [...overList.tasks]

        const newIndex = isAbove ? overItemIndex : overItemIndex + 1

        newTasks.splice(newIndex, 0, task[0])

        const newData = [...boards]
        newData[activeTaskListIndex] = { ...activeList, tasks: oldTasks }
        newData[overTaskListIndex] = { ...overList, tasks: newTasks }

        setBoards(newData)
      }
    },
    [boards, setBoards, arrayMove]
  )

  function isActiveIdTask() {
    return boards.some((list) =>
      list.tasks.some((task) => task.id === activeId)
    )
  }

  const checkMove = useCallback(
    (e: DragMoveEvent) => {
      const { active, over } = e

      if (!over) return

      const activeTaskListIndex = boards.findIndex((list) =>
        list.tasks.some((task) => task.id === active.id)
      )

      const overTaskListIndex = boards.findIndex((list) =>
        list.tasks.some((task) => {
          return task.id === over.id
        })
      )

      const activeList = boards[activeTaskListIndex]
      const overList = boards[overTaskListIndex]

      const activeRect = active.rect.current?.translated
      const overRect = over.rect
      if (!activeRect || !overRect) return
      const activeItemCenterY = activeRect.top + activeRect.height / 2
      const overItemCenterY = overRect.top + overRect.height / 2
      const isAbove = activeItemCenterY < overItemCenterY

      const findOverTask = boards.findIndex((list) =>
        list.tasks.some((task) => {
          return task.id === over.id
        })
      )

      if (findOverTask >= 0 && activeList.id !== overList.id) {
        setOverTaskItem({ id: over.id, isAbove: isAbove })
      }
    },
    [boards, setOverTaskItem]
  )

  function handleCreateBoard() {
    setAddNewList(false)

    if (newListName === "") {
      return toast.error("List name must be provided.")
    }

    if (params.id) {
      BoardService.createBoard(params.id as string, newListName)
      setTrackBoardsChange(!trackBoardsChange)
    }
  }

  const activeTask = useMemo(() => {
    return <SortableCardItem id={activeId as UniqueIdentifier} title={""} />
  }, [activeId, setActiveId])

  return (
    <WorkspaceLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>Header</div>
          <div>Header Left</div>
        </div>
        <div className={styles.body}>
          <div className={styles.lists}>
            <DndContext
              sensors={sensors}
              onDragStart={(e) => {
                setActiveId(e?.active?.id)
                setDragActive(true)
              }}
              onDragMove={checkMove}
              onDragEnd={(e) => {
                handleDragEnd(e)
                setActiveId(null)
                setDragActive(false)
                setOverTaskItem(undefined)
              }}
              collisionDetection={closestCorners}
            >
              <SortableContext
                items={boards.map((list) => list.id)}
                strategy={horizontalListSortingStrategy}
              >
                {boards.map((list) => {
                  return (
                    <SortableCard
                      key={list.id}
                      id={list.id}
                      cardHeader={list.title}
                      cardItems={list.tasks}
                    />
                  )
                })}
                <div className={styles.addNewList}>
                  {addNewList ? (
                    <div className={styles.newListTextareaWrapper}>
                      <Textarea onChange={(e) => setNewListName(e)} />
                      <div className={styles.buttons}>
                        <Button
                          type="button"
                          text="Cancel"
                          onClick={() => setAddNewList(false)}
                        />
                        <Button
                          type="button"
                          text="Save"
                          onClick={handleCreateBoard}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setAddNewList(true)}
                      className={styles.addNewListText}
                    >
                      <Plus /> Add new list{" "}
                    </div>
                  )}
                </div>
                <DragOverlay>
                  {activeId && isActiveIdTask() ? activeTask : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <div
          className={clsx(
            styles.overlay,
            editTaskActive && styles.overlayVisible
          )}
        />
      </div>
    </WorkspaceLayout>
  )
}
