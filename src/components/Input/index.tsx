"use client"
import { ChangeEvent, Ref, useRef, useState } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
import { X } from "lucide-react"

interface Props {
  label?: string
  onChange?: (value: string) => void
  className?: string
  type?: "text" | "password" | "email" | "file"
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  errorMessage?: string[]
  ref?: Ref<HTMLInputElement>
  placeholder?: string
  defaultValue?: string
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
  placeholder,
  defaultValue,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    return onChange?.(event.target.value)
  }

  return (
    <div className={clsx(styles.container, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(styles.inputWrapper, isFocused && styles.focused)}
      >
        {prefix && <div className={styles.prefix}>{prefix}</div>}
        <input
          ref={ref}
          type={type}
          className={clsx(
            styles.input,
            prefix && styles.inputWithPrefix,
            suffix && styles.inputWithSuffix
          )}
          onChange={handleOnChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
        {suffix && (
          <div tabIndex={-1} className={styles.suffix}>
            {suffix}
          </div>
        )}
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
