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

interface IProps {
  id: UniqueIdentifier
  cardHeader: string
  cardItems: { id: UniqueIdentifier; title: string }[]
}

export default function SortableCard({ id, cardHeader, cardItems }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: id })
  const [activeId] = useAtom(activeIdAtom)
  const [overTaskItem] = useAtom(overTaskItemAtom)

  const restrictedTransform = transform ? { ...transform, y: 0 } : null

  const style = {
    transform: CSS.Transform.toString(restrictedTransform),
    transition,
  }

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
        <div className={styles.tasks}>
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
        <div className={styles.addTask}>Add Task</div>
      </div>
    </SortableContext>
  )
}
