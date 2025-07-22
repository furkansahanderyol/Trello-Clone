import { useEffect } from "react"

export const useMouseMove = (onMouseMove: (e: MouseEvent) => void) => {
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, [onMouseMove])
}
