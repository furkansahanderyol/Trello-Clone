import { useRef, useState } from "react"
import styles from "./index.module.scss"
import { useOnClickOutside } from "@/hooks/useOnClickOutside"

interface IProps {
  icon: React.ReactNode
  label: string
  dropdownOptions?: React.ReactNode
}

export default function TaskOption({ icon, label, dropdownOptions }: IProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdownActive, setDropdownActive] = useState(false)

  useOnClickOutside(dropdownRef, () => {
    setDropdownActive(false)
  })

  return (
    <div ref={dropdownRef} className={styles.container}>
      <div
        onClick={() => setDropdownActive(!dropdownActive)}
        className={styles.label}
      >
        {icon}
        <div>{label}</div>
      </div>

      {dropdownActive && (
        <div className={styles.dropdown}>{dropdownOptions}</div>
      )}
    </div>
  )
}
