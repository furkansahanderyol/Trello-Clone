"use client"
import { ChangeEvent, Ref, useState } from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
import { X } from "lucide-react"
import { PatternFormat } from "react-number-format"

interface Props {
  label?: string
  onChange?: (value: string) => void
  className?: string
  format: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  errorMessage?: string[]
  placeholder?: string
}

export default function PatternFormatInput({
  label,
  onChange,
  format,
  className,
  prefix,
  suffix,
  errorMessage,
  placeholder,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)

  function handleOnChange(values: { value: string }) {
    return onChange?.(values.value)
  }

  return (
    <div className={clsx(className, styles.container)}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(styles.inputWrapper, isFocused && styles.focused)}
      >
        {prefix && <div className={styles.prefix}>{prefix}</div>}
        <PatternFormat
          format={format}
          className={clsx(
            styles.input,
            prefix && styles.inputWithPrefix,
            suffix && styles.inputWithSuffix
          )}
          onValueChange={(values) => {
            handleOnChange(values)
          }}
          placeholder={placeholder}
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
