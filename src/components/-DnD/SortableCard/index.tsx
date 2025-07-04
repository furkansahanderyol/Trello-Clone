import { UniqueIdentifier } from "@dnd-kit/core"
import styles from "./index.module.scss"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import SortableCardItem from "../SortableCardItem"

interface IProps {
  id: UniqueIdentifier
  cardHeader: string
  cardItems: { id: UniqueIdentifier; title: string }[]
}

export default function SortableCard({ id, cardHeader, cardItems }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

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
        {cardItems.map((item) => {
          return (
            <SortableCardItem key={item.id} id={item.id} title={item.title} />
          )
        })}
      </div>
    </SortableContext>
  )
}
