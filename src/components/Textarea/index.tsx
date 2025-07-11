import { ChangeEvent, Ref } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"

interface IProps {
  ref?: Ref<HTMLTextAreaElement>
  label?: string
  onChange?: (e: string) => void
  className?: string
}

export default function Textarea({ ref, label, onChange, className }: IProps) {
  function handleOnChange(e: ChangeEvent<HTMLTextAreaElement>) {
    return onChange?.(e.target.value)
  }

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <textarea
        ref={ref}
        onChange={(e) => handleOnChange(e)}
        className={clsx(styles.textarea, className)}
      />
    </div>
  )
}
