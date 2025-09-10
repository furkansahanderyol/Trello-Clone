export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  const format = (value: number, unit: string) => {
    const suffix = value === 1 ? unit : `${unit}s`
    return `${value} ${suffix} ago`
  }

  switch (true) {
    case diff < 60:
      return format(diff, "second")

    case diff < 3600:
      return format(Math.floor(diff / 60), "minute")

    case diff < 86400:
      return format(Math.floor(diff / 3600), "hour")

    case diff < 2592000:
      return format(Math.floor(diff / 86400), "day")

    case diff < 31104000:
      return format(Math.floor(diff / 2592000), "month")

    default:
      return format(Math.floor(diff / 31104000), "year")
  }
}
