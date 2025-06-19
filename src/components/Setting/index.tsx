import styles from "./index.module.scss"

interface IProps {
  prefix?: React.ReactNode
  label: string
  value: string | React.ReactNode
  suffix?: React.ReactNode
}

export default function Setting({ prefix, label, value, suffix }: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {prefix && <div className={styles.prefix}>{prefix}</div>}
        <div className={styles.information}>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  )
}
