import { ChangeEvent } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"

interface Props {
  label?: string
  onChange?: (value: string) => void
  className?: string
  type?: "text" | "password" | "email"
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export default function Input({
  label,
  onChange,
  className,
  type,
  prefix,
  suffix,
}: Props) {
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    return onChange?.(event.target.value)
  }

  return (
    <div className={clsx(className, styles.container)}>
      <div className={styles.label}>{label}</div>
      <div className={styles.inputWrapper}>
        <div className={styles.prefix}>{prefix}</div>
        <input type={type} className={styles.input} onChange={handleOnChange} />
        <div className={styles.suffix}>{suffix}</div>
      </div>
    </div>
  )
}
