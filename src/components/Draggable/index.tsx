import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface IProps {
  id: UniqueIdentifier
  content: string
}

export default function Draggable({ id, content }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: "1rem 0",
    backgroundColor: "yellow",
  }

  return (
    <button ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </button>
  )
}
