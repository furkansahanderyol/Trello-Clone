"use client"

import Draggable from "@/components/Draggable"
import styles from "./page.module.scss"
import WorkspaceLayout from "@/layouts/WorkspaceLayout"
import { selectedWorkspaceAtom } from "@/store"
import {
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useAtom } from "jotai"
import { act, useEffect, useState } from "react"
import Droppable from "@/components/Droppable"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

export default function Workspace() {
  const [selectedWorkspace] = useAtom(selectedWorkspaceAtom)

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [data, setData] = useState([
    {
      listId: "list-1",
      tasks: [
        { id: "task-1", content: "task-1" },
        { id: "task-2", content: "task-2" },
      ],
    },
    { listId: "list-2", tasks: [{ id: "task-3", content: "task-3" }] },
    { listId: "list-3", tasks: [] },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const activeId = active.id
    const overTaskId = data
      .flatMap((list) => list.tasks)
      .find((task) => task.id === over?.id)?.id

    let sourceListId

    sourceListId = data.find((lists) => {
      return lists.tasks.find((task) => {
        return task.id === active.id
      })
    })?.listId

    // If its on same list
    if (!overTaskId && sourceListId === over?.id) {
      setData((lists) => {
        return lists.map((list) => {
          if (list.listId === sourceListId) {
            const tasks = list.tasks

            const oldIndex = tasks.findIndex((task) => task.id === activeId)
            const newIndex = tasks.findIndex((task) => task.id === over?.id)

            const newTasks = arrayMove(tasks, oldIndex, newIndex)

            return { listId: list.listId, tasks: newTasks }
          } else {
            return list
          }
        })
      })
    } else {
    }

    if (over && active.id !== over.id) {
      // setData((items) => {
      //   // return arrayMove(items, oldIndex, newIndex)
      // })
    }
  }

  function findList(id: string) {}

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
              onDragOver={handleDragEnd}
            >
              {data.map((lists) => {
                return (
                  <SortableContext
                    key={lists.listId}
                    id={lists.listId}
                    items={lists.tasks}
                    strategy={verticalListSortingStrategy}
                  >
                    <Droppable id={lists.listId}>
                      <div className={styles.items}>
                        {lists.tasks.map((item) => (
                          <Draggable
                            key={item.id}
                            id={item.id}
                            content={item.content}
                          />
                        ))}
                      </div>
                    </Droppable>
                    <DragOverlay
                      dropAnimation={{
                        ...defaultDropAnimation,
                        sideEffects: defaultDropAnimationSideEffects({
                          styles: {
                            active: {
                              opacity: "1",
                            },
                          },
                        }),
                      }}
                    >
                      {activeId ? (
                        <Draggable
                          id={activeId}
                          content={
                            data
                              .flatMap((list) => list.tasks)
                              .find((t) => t.id === activeId)?.content ?? ""
                          }
                        />
                      ) : null}
                    </DragOverlay>
                  </SortableContext>
                )
              })}
              {/* <SortableContext
                id="sortable-1"
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <Droppable id={"x-1"}>
                  <div className={styles.items}>
                    {items.map((item) => {
                      return (
                        <Draggable
                          key={item.id}
                          id={item.id}
                          content={item.content}
                        />
                      )
                    })}
                  </div>
                </Droppable>
              </SortableContext>
              <SortableContext
                id="sortable-2"
                items={[]}
                strategy={verticalListSortingStrategy}
              >
                <Droppable id={"x-2"}>
                  <div className={styles.items}></div>
                </Droppable>
              </SortableContext> */}
            </DndContext>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
