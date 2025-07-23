import { BoardType, TaskType } from "@/store/types"

interface Orderable {
  order: number
}

type ListType = Orderable

export function calculateOrder<T extends Orderable>(list: T[]): T[] {
  return list.map((item, index) => {
    item.order = index
    return item
  })
}
