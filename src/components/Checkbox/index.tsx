import { Check } from "lucide-react"
import styles from "./index.module.scss"
import clsx from "clsx"

interface IProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  label?: string
  text?: string
  disabled?: boolean
}

export default function Checkbox({
  checked,
  onChange,
  label,
  text,
  disabled,
}: IProps) {
  const handleChange = () => {
    if (disabled) return
    onChange?.(!checked)
  }

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div onClick={handleChange} className={styles.checkboxWrapper}>
        <div className={clsx(styles.checkbox, checked && styles.checked)}>
          {checked && <Check />}
        </div>
        {text && <div className={styles.text}>{text}</div>}
      </div>
    </div>
  )
}
