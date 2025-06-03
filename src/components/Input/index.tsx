"use client"
import { ChangeEvent, Ref } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
import { X } from "lucide-react"

interface Props {
  label?: string
  onChange?: (value: string) => void
  className?: string
  type?: "text" | "password" | "email"
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  errorMessage?: string[]
  ref?: Ref<HTMLInputElement>
}

export default function Input({
  label,
  onChange,
  className,
  type,
  prefix,
  suffix,
  errorMessage,
  ref,
}: Props) {
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    return onChange?.(event.target.value)
  }

  return (
    <div className={clsx(className, styles.container)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.inputWrapper}>
        {prefix && <div className={styles.prefix}>{prefix}</div>}
        <input
          ref={ref}
          type={type}
          className={styles.input}
          onChange={handleOnChange}
        />
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
      {errorMessage && (
        <div className={styles.errors}>
          {errorMessage.map((message, index) => {
            return (
              <div className={styles.error} key={index}>
                <span className={styles.icon}>
                  <X size={12} />
                </span>
                {message}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
