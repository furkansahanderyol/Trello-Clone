"use client"

import styles from "./page.module.scss"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import {
  activeIdAtom,
  boardsAtom,
  dragActiveAtom,
  editTaskActiveAtom,
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
import { act, useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  const [editTaskActive] = useAtom(editTaskActiveAtom)
  const [activeId, setActiveId] = useAtom(activeIdAtom)
  const [addNewList, setAddNewList] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [trackBoardsChange, setTrackBoardsChange] = useAtom(
    trackBoardsChangeAtom
  )
  const listRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
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
        const boardId = boards.filter((board) => board.id === active.id)[0].id
        const newList = arrayMove(boards, activeListIndex, overListIndex)
        const orderedNewList = newList
        setBoards(orderedNewList)
        BoardService.updateBoardOrders(
          params.id as string,
          boardId,
          overListIndex
        )
        setTrackBoardsChange(!trackBoardsChange)
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
          BoardService.updateBoardTasks(
            params.id as string,
            taskToMove.id,
            newData[activeTaskListIndex].id,
            over.id as string,
            overListOnlyIndex,
            0
          )
          setTrackBoardsChange(!trackBoardsChange)

          return
        }
      }

      // If task is in the same list
      if (activeTaskListIndex === overTaskListIndex) {
        const list = boards[activeTaskListIndex]
        const selectedTask = active.id as string
        const oldIndex = list.tasks.filter((task) => task.id === active.id)[0]
          .order
        const newIndex = list.tasks.filter((task) => task.id === over.id)[0]
          .order

        const newTasks = arrayMove(list.tasks, oldIndex, newIndex)
        const orderedList = newTasks
        const newData = [...boards]
        newData[activeTaskListIndex] = { ...list, tasks: orderedList }

        BoardService.updateBoardTasks(
          params.id as string,
          selectedTask,
          list.id,
          list.id,
          oldIndex,
          newIndex
        )

        setBoards(newData)
        setTrackBoardsChange(!trackBoardsChange)
      } else {
        // If task is in another list
        const activeList = boards[activeTaskListIndex]
        const overList = boards[overTaskListIndex]
        const activeRect = active.rect.current?.translated
        const overRect = over.rect

        const task = activeList.tasks.filter((task) => task.id === active.id)
        const movedItemOldIndex = task[0].order
        const oldTasks = activeList.tasks.filter(
          (task) => task.id !== active.id
        )

        if (!activeRect || !overRect) return
        const activeItemCenterY = activeRect.top + activeRect.height / 2
        const overItemCenterY = overRect.top + overRect.height / 2
        const isAbove = activeItemCenterY < overItemCenterY

        const overItemIndex = overList.tasks.filter(
          (task) => task.id === over.id
        )[0].order

        const newTasks = [...overList.tasks]

        const newIndex = isAbove ? overItemIndex : overItemIndex + 1

        newTasks.splice(newIndex, 0, task[0])

        const newData = [...boards]

        newData[activeTaskListIndex] = {
          ...activeList,
          tasks: oldTasks,
        }
        newData[overTaskListIndex] = {
          ...overList,
          tasks: newTasks,
        }

        setBoards(newData)
        BoardService.updateBoardTasks(
          params.id as string,
          task[0].id,
          activeList.id,
          overList.id,
          movedItemOldIndex,
          newIndex
        )
      }

      setTrackBoardsChange(!trackBoardsChange)
      return
    },
    [boards, setBoards, arrayMove]
  )

  function isActiveIdTask() {
    return boards.some((list) =>
      list.tasks.some((task) => task.id === activeId)
    )
  }

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
    return (
      <SortableCardItem
        boardId={""}
        id={activeId as UniqueIdentifier}
        title=""
        labels={[]}
      />
    )
  }, [activeId, setActiveId])

  return (
    <WorkspaceLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>Header</div>
          <div>Header Left</div>
        </div>
        <div className={styles.body}>
          <div ref={listRef} className={styles.lists}>
            <DndContext
              sensors={sensors}
              onDragStart={(e) => {
                setActiveId(e?.active?.id)
                setDragActive(true)
              }}
              onDragEnd={(e) => {
                handleDragEnd(e)
                setActiveId(null)
                setDragActive(false)
              }}
              collisionDetection={closestCorners}
              autoScroll={true}
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
                      data={boards}
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
