import styles from "./index.module.scss"

interface IProps {
  children: React.ReactNode
}

export default function Sidebar({ children }: IProps) {
  return <div className={styles.container}>{children}</div>
}
