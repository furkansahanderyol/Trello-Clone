"use client"

import styles from "./page.module.scss"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import { selectedWorkspaceAtom } from "@/store"
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useAtom } from "jotai"
import { useState } from "react"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import SortableCard from "@/components/-DnD/SortableCard"
import SortableCardItem from "@/components/-DnD/SortableCardItem"

export default function Workspace() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [data, setData] = useState([
    {
      listId: "list-1",
      tasks: [
        { id: "task-1", title: "task-1" },
        { id: "task-2", title: "task-2" },
      ],
    },
    { listId: "list-2", tasks: [{ id: "task-3", title: "task-3" }] },
    { listId: "list-3", tasks: [] },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e

    if (!over || active.id === over.id) return

    const activeListIndex = data.findIndex((list) => list.listId === active.id)
    const overListIndex = data.findIndex((list) => list.listId === over.id)

    // Changes order of the lists
    if (activeListIndex !== -1 && overListIndex !== -1) {
      const newList = arrayMove(data, activeListIndex, overListIndex)
      setData(newList)
      return
    }

    const activeTaskListIndex = data.findIndex((list) =>
      list.tasks.some((task) => task.id === active.id)
    )

    const overTaskListIndex = data.findIndex((list) =>
      list.tasks.some((task) => task.id === over.id)
    )
    // Aborts when task or target task cannot be found
    if (activeTaskListIndex === -1) return

    // If task carried to the new list
    if (overTaskListIndex === -1) {
      const overListOnlyIndex = data.findIndex(
        (list) => list.listId === over.id
      )
      if (overListOnlyIndex !== -1) {
        const activeList = data[activeTaskListIndex]
        const taskToMove = activeList.tasks.find(
          (task) => task.id === active.id
        )!

        const newActiveTasks = activeList.tasks.filter(
          (task) => task.id !== active.id
        )

        const newData = [...data]
        newData[activeTaskListIndex] = { ...activeList, tasks: newActiveTasks }

        const newOverTasks = [...newData[overListOnlyIndex].tasks, taskToMove]

        newData[overListOnlyIndex] = {
          ...newData[overListOnlyIndex],
          tasks: newOverTasks,
        }

        setData(newData)
        return
      }
    }

    // If task is in the same list
    if (activeTaskListIndex === overTaskListIndex) {
      const list = data[activeTaskListIndex]
      const oldIndex = list.tasks.findIndex((task) => task.id === active.id)
      const newIndex = list.tasks.findIndex((task) => task.id === over.id)

      const newTasks = arrayMove(list.tasks, oldIndex, newIndex)
      const newData = [...data]
      newData[activeTaskListIndex] = { ...list, tasks: newTasks }
      setData(newData)
    } else {
      // If task is in another list
      const activeList = data[activeTaskListIndex]
      const overList = data[overTaskListIndex]

      const task = activeList.tasks.filter((task) => task.id === active.id)
      const oldTasks = activeList.tasks.filter((task) => task.id !== active.id)

      const newIndex = overList.tasks.findIndex((task) => task.id === over.id)

      const newTasks = [...overList.tasks]
      newTasks.splice(newIndex, 0, task[0])

      const newData = [...data]
      newData[activeTaskListIndex] = { ...activeList, tasks: oldTasks }
      newData[overTaskListIndex] = { ...overList, tasks: newTasks }

      setData(newData)
    }
  }

  function isActiveIdTask() {
    return data.some((list) => list.tasks.some((task) => task.id === activeId))
  }

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
              onDragStart={(e) => setActiveId(e?.active?.id)}
              onDragEnd={(e) => {
                handleDragEnd(e)
                setActiveId(null)
              }}
              collisionDetection={closestCorners}
            >
              <SortableContext
                items={data.map((list) => list.listId)}
                strategy={horizontalListSortingStrategy}
              >
                {data.map((list) => {
                  return (
                    <SortableCard
                      key={list.listId}
                      id={list.listId}
                      cardHeader={list.listId}
                      cardItems={list.tasks}
                    />
                  )
                })}
                <DragOverlay>
                  {activeId && isActiveIdTask() ? (
                    <SortableCardItem id={activeId} title={""} />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
