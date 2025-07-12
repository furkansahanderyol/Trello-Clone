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
import { activeIdAtom, overTaskItemAtom } from "@/store"
import clsx from "clsx"
import { useRef, useState } from "react"
import Textarea from "@/components/Textarea"
import Button from "@/components/Button"
import { Plus } from "lucide-react"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

interface IProps {
  id: UniqueIdentifier
  cardHeader: string
  cardItems: { id: UniqueIdentifier; title: string }[]
}

export default function SortableCard({ id, cardHeader, cardItems }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: id })
  const addTaskModeRef = useRef(null)
  const [activeId] = useAtom(activeIdAtom)
  const [overTaskItem] = useAtom(overTaskItemAtom)
  const [addTaskMode, setAddTaskMode] = useState(false)

  const restrictedTransform = transform ? { ...transform, y: 0 } : null

  const style = {
    transform: CSS.Transform.toString(restrictedTransform),
    transition,
  }

  useOnClickOutside(addTaskModeRef, () => setAddTaskMode(false))

  return (
    <SortableContext items={cardItems} strategy={verticalListSortingStrategy}>
      <div style={style} className={styles.container}>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className={styles.header}
        >
          {cardHeader}
        </div>
        <div className={clsx(styles.tasks, addTaskMode && styles.extend)}>
          {cardItems.map((item, index) => {
            return (
              <div key={item.id}>
                {item.id === overTaskItem?.id && overTaskItem.isAbove && (
                  <div className={clsx(styles.shadow, styles.marginBottom)} />
                )}
                <SortableCardItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  isActive={item.id === activeId}
                />
                {item.id === overTaskItem?.id &&
                  !overTaskItem.isAbove &&
                  cardItems.length - 1 === index && (
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
            <div ref={addTaskModeRef} className={styles.wrapper}>
              <Textarea onChange={(e) => console.log(e)} />
              <div className={styles.buttons}>
                <Button
                  type="button"
                  text="Save"
                  onClick={() => setAddTaskMode(false)}
                />
                <Button
                  type="button"
                  text="Cancel"
                  onClick={() => setAddTaskMode(false)}
                />
              </div>
            </div>
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
