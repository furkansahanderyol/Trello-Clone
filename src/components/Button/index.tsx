import clsx from "clsx"
import styles from "./index.module.scss"
import { useState } from "react"

interface Props {
  onClick?: () => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  text?: string
  className?: string
  type: "submit" | "button"
  loading?: boolean
  disabled?: boolean
}

export default function Button({
  onClick,
  prefix,
  suffix,
  text,
  className,
  type,
  loading,
  disabled,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <button
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      type={type}
      className={clsx(
        styles.button,
        className,
        isFocused && styles.focused,
        loading && styles.loading,
        disabled && styles.disabled
      )}
      onClick={onClick}
    >
      {loading && <div className={styles.spinner} />}
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <span className={styles.text}>{text}</span>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </button>
  )
}
