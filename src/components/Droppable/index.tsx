import { useDroppable } from "@dnd-kit/core"

interface IProps {
  id: string
  children: React.ReactNode
}

export default function Droppable({ id, children }: IProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div
      style={{
        width: "400px",
        height: "400px",
        backgroundColor: "red",
      }}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}
