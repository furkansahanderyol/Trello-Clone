import clsx from "clsx"
import styles from "./index.module.scss"

interface Props {
  onClick?: () => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  text?: string
  className?: string
  type: "submit" | "button"
  loading?: boolean
}

export default function Button({
  onClick,
  prefix,
  suffix,
  text,
  className,
  type,
  loading,
}: Props) {
  return (
    <button
      type={type}
      className={clsx(styles.button, className, loading && styles.loading)}
      onClick={onClick}
    >
      {loading && <div className={styles.spinner} />}
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <span className={styles.text}>{text}</span>
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </button>
  )
}
