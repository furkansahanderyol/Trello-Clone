interface Orderable {
  order: number
}

export function calculateOrder<T extends Orderable>(list: T[]): T[] {
  return list.map((item, index) => {
    item.order = index
    return item
  })
}
