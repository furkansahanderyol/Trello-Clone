import styles from "./index.module.scss"

interface IProps {
  title: string
  children: React.ReactNode
}

export default function Section({ title, children }: IProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}
